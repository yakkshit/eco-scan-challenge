from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.responses import JSONResponse  
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from typing import List, Dict, Optional
from pydantic import BaseModel
import random
from fastapi.middleware.cors import CORSMiddleware
import json
from dotenv import load_dotenv
import os
import aiofiles.tempfile
import uvicorn

try:
    import google.generativeai as genai
except ImportError:
    genai = None

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
modelUsed = os.getenv("GEMINI_MODEL")

# Load valid users from the environment variable
valid_users = {
    os.getenv("USER"): os.getenv("PASSWORD"),
}

# Load company coupons 
company_coupons = [
    {"title": "Eco Store", "price": "$5", "link": "https://yakkshit.com"},
    {"title": "Green Products Co.", "price": "$1", "link": "https://yakkshit.com"},
    {"title": "Sustainable Fashion", "price": "$15", "link": "https://yakkshit.com"},
    {"title": "Organic Marketplace", "price": "$7", "link": "https://yakkshit.com"},
    {"title": "Renewable Goods", "price": "$1", "link": "https://yakkshit.com"},
    {"title": "Eco-Friendly Apparel", "price": "$8", "link": "https://yakkshit.com"},
    {"title": "Green Living Essentials", "price": "$20", "link": "https://yakkshit.com"},
    {"title": "Conscious Clothing", "price": "$25", "link": "https://yakkshit.com"},
    {"title": "Nature's Best", "price": "$18", "link": "https://yakkshit.com"},
    {"title": "Planet-Friendly Products", "price": "$1", "link": "https://yakkshit.com"},
    {"title": "Ethical Fashion Hub", "price": "$2", "link": "https://yakkshit.com"},
    {"title": "Sustainable Home Goods", "price": "$9", "link": "https://yakkshit.com"},
    {"title": "Zero Waste Shop", "price": "$1", "link": "https://yakkshit.com"},
    {"title": "Green Tech Solutions", "price": "$3", "link": "https://yakkshit.com"}
]

app = FastAPI()
security = HTTPBasic()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
def generate_random_coupons(total_footprint: float) -> List[Coupon]:
    # Filter the coupons based on the total_footprint
    filtered_coupons = [Coupon(**c) for c in company_coupons if float(c['price'].replace('$', '')) <= total_footprint]
    
    # If there are no coupons that match the total_footprint, return an empty list
    if not filtered_coupons:
        return []
    
    # Otherwise, return filtered coupons
    return filtered_coupons

async def authenticate(credentials: HTTPBasicCredentials = Depends(security)):
    # Check if the username and password are correct
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
    ecosaving = total_footprint * 2.0  # eco points where 1kg = 2ecopoints

    # Generate random coupons
    coupons = generate_random_coupons(total_footprint)
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
        if genai is None:
            raise HTTPException(status_code=500, detail="Google Generative AI library not installed.")
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        # Upload file to Gemini API
        myfile = genai.upload_file(file_path, mime_type="image/png")
        model = genai.GenerativeModel(modelUsed)
        
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
        os.remove(file_path)  # cleanup of temp file

    return JSONResponse(content=response_data.dict())

@app.get("/")
async def root():
    return {"message": "Test Successful"} # created for testing

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred."}
    )

async def handler(req, res):
    return await app(req, res) 

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
