from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.responses import JSONResponse  
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from typing import List, Dict, Optional
from pydantic import BaseModel
import random
from fastapi.middleware.cors import CORSMiddleware
import json
from dotenv import load_dotenv
import google.generativeai as genai
import os
import aiofiles.tempfile
import uvicorn

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Load valid users from the environment variable
valid_users = {
    os.getenv("USER"): os.getenv("PASSWORD"),
}

# Load company coupons from the environment variable
company_coupons = [
    {"title": "Eco Store", "price": "$5", "link": "https://yakkshit.com"},
    {"title": "Green Products Co.", "price": "$10", "link": "https://yakkshit.com"},
    {"title": "Sustainable Fashion", "price": "$15", "link": "https://yakkshit.com"},
    {"title": "Organic Marketplace", "price": "$7", "link": "https://yakkshit.com"},
    {"title": "Renewable Goods", "price": "$12", "link": "https://yakkshit.com"},
    {"title": "Eco-Friendly Apparel", "price": "$8", "link": "https://yakkshit.com"},
    {"title": "Green Living Essentials", "price": "$20", "link": "https://yakkshit.com"},
    {"title": "Conscious Clothing", "price": "$25", "link": "https://yakkshit.com"},
    {"title": "Nature's Best", "price": "$18", "link": "https://yakkshit.com"},
    {"title": "Planet-Friendly Products", "price": "$14", "link": "https://yakkshit.com"},
    {"title": "Ethical Fashion Hub", "price": "$22", "link": "https://yakkshit.com"},
    {"title": "Sustainable Home Goods", "price": "$9", "link": "https://yakkshit.com"},
    {"title": "Zero Waste Shop", "price": "$11", "link": "https://yakkshit.com"},
    {"title": "Green Tech Solutions", "price": "$30", "link": "https://yakkshit.com"}
]

app = FastAPI()
security = HTTPBasic()


# Predefined data
default_carbonfootprints = {
    "hoodie": "2kg",
    "sweatpants": "3kg",
    "t-shirt": "1kg",
    "jeans": "4kg",
    "jacket": "5kg",
    "shorts": "2kg",
    "dress": "3.5kg",
    "skirt": "2.5kg",
    "socks": "0.5kg",
    "hat": "0.8kg",
    "scarf": "1kg",
    "activewear": "3kg",
    "swimwear": "2kg",
    "pajamas": "1.5kg",
    "overalls": "4.5kg",
    "others": "1kg",
    "blazer": "4kg"
}


# Data models
class CarbonFootprintInput(BaseModel):
    category: Optional[str] = None
    items: List[str] = []
    image: Optional[str] = None

class Coupon(BaseModel):
    title: str
    price: str
    link: str

class CarbonFootprintOutput(BaseModel):
    carbonfootprint: Dict[str, str]
    coupons: List[Coupon]
    coupontotal: str
    ecosavings: float  # eco-savings points
    modelused: str
    image: str
    total_footprint: float

# Helper functions
def generate_random_coupons(count: int) -> List[Coupon]:
    return random.sample([Coupon(**c) for c in company_coupons], min(count, len(company_coupons)))

async def authenticate(credentials: HTTPBasicCredentials = Depends(security)):
    correct_password = valid_users.get(credentials.username)
    if correct_password != credentials.password:
        raise HTTPException(status_code=401, detail="Invalid credentials.")

def calculate_carbon_footprint(data: CarbonFootprintInput, modelUsed: str) -> CarbonFootprintOutput:
    carbon_footprint = {}
    
    # Check if all items are invalid or if category is unknown and items are invalid
    if (data.category == "unknown" and all(item.lower() == "invalid" or item.lower() == "unknown" for item in data.items)) or \
       (data.category == "invalid" and (len(data.items) == 0 or all(item.lower() == "invalid" or item.lower() == "unknown" for item in data.items))):
        carbon_footprint = {"invalid image": "0"}
    elif len(data.items) > 0:
        # Process each item
        for item in data.items:
            if item.lower() == "invalid":
                carbon_footprint[item] = "0kg"
            elif item.lower() == "unknown":
                carbon_footprint[item] = "0kg"
            else:
                # Check if item exists in default_carbonfootprints
                if item in default_carbonfootprints:
                    carbon_footprint[item] = default_carbonfootprints[item]
                else:
                    # Generate random carbon footprint between 1 and 5
                    random_footprint = round(random.uniform(1, 5), 2)
                    carbon_footprint[item] = f"{random_footprint}kg"
    
    total_footprint = 0.0
    if len(carbon_footprint) > 0 and "invalid image" not in carbon_footprint:
        # Calculate total footprint excluding invalid items
        total_footprint = sum(
            float(value.replace('kg', '')) 
            for value in carbon_footprint.values()
            if value != "0kg"
        )
    
    # Calculate carbon score as eco-savings points
    ecosaving = total_footprint * 2.0  # Example multiplier for eco points where 1kg = 2ecopoints

    # Generate random coupons
    coupons = generate_random_coupons(random.randint(0, 12))
    coupontotal = f"The Eco-Savings points you received for this transaction is ${ecosaving:.2f}."

    return CarbonFootprintOutput(
        carbonfootprint=carbon_footprint,
        coupons=coupons,
        coupontotal=coupontotal,
        ecosavings=ecosaving,
        modelused=modelUsed,
        image=data.image,
        total_footprint=total_footprint
    )

async def process_gemini_response(result):
    try:
        # Parse JSON content from Gemini API response
        content = json.loads(result.candidates[0].content.parts[0].text)
        return {
            "category": content.get("category", ""),
            "items": content.get("items", []),
            "image": content.get("cloth_image", "")
        }
    except (KeyError, json.JSONDecodeError):
        return None
    
@app.post("/upload")
async def upload_image(file: UploadFile = File(...), credentials: HTTPBasicCredentials = Depends(security)):
    await authenticate(credentials)
    
    # Save the file temporarily using async file handling
    async with aiofiles.tempfile.NamedTemporaryFile(delete=False) as temp_file:
        file_path = temp_file.name
        content = await file.read()  # Read the content
        print(f"Read content size: {len(content)} bytes")  # Debugging line
        await temp_file.write(content)

    try:
        # Upload file to Gemini API
        myfile = genai.upload_file(file_path, mime_type="image/png")
        model = genai.GenerativeModel("gemini-1.5-flash")
        modelUsed = "gemini-1.5-flash"
        
        result = model.generate_content(
            [
                myfile, "\n\n",
                "Identify clothing items and category data in JSON format. if there is no clothing items send all values as invalid. here is an example json format "
                '{"category": "Casual Wear", "items": ["hoodie", "sweatpants"], "cloth_image": "valid/invalid"}.'
            ],
            generation_config=genai.GenerationConfig(response_mime_type="application/json")
        )

        processed_data = await process_gemini_response(result)
        if not processed_data:
            raise HTTPException(status_code=500, detail="Failed to process Gemini response.")

        # Calculate carbon footprint using the parsed Gemini response
        response_data = calculate_carbon_footprint(CarbonFootprintInput(**processed_data), modelUsed)

    finally:
        os.remove(file_path)  # Ensure cleanup of temp file

    return JSONResponse(content=response_data.dict())

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred."}
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=80)