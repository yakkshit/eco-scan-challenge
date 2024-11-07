import os
import pytest
from fastapi.testclient import TestClient
from fastapi.security import HTTPBasicCredentials
from fastapi import HTTPException
from unittest.mock import MagicMock, patch
from main import app, authenticate, calculate_carbon_footprint, CarbonFootprintInput, CarbonFootprintOutput
from dotenv import load_dotenv

client = TestClient(app)

load_dotenv()
test_user = os.getenv("USER")
test_password = os.getenv("PASSWORD")

# Mocking the google.generativeai module
with patch('main.genai') as mock_genai:
    mock_genai.upload_file = MagicMock(return_value="mock_file")
    mock_genai.GenerativeModel = MagicMock()
    mock_model = mock_genai.GenerativeModel.return_value
    mock_model.generate_content = MagicMock(return_value=MagicMock(candidates=[MagicMock(content=MagicMock(parts=[MagicMock(text='{"category": "Casual Wear", "items": ["hoodie", "sweatpants"], "cloth_image": "valid"}')]))]))

    def test_root():
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "Test Successful"}

    @pytest.mark.asyncio
    async def test_authenticate():
        credentials = HTTPBasicCredentials(username=test_user, password=test_password)
        await authenticate(credentials)

    @pytest.mark.asyncio
    async def test_authenticate_wrong_credentials():
        credentials = HTTPBasicCredentials(username="wronguser", password="wrongpassword")
        with pytest.raises(HTTPException) as excinfo:
            await authenticate(credentials)
        assert excinfo.value.status_code == 401

    def test_post_to_root():
        response = client.post("/", auth=("testuser", "testpassword"))
        assert response.status_code == 405  # Method Not Allowed

    @pytest.mark.asyncio
    async def test_calculate_carbon_footprint():
        input_data = CarbonFootprintInput(
            category="Casual Wear",
            items=["hoodie", "sweatpants"],
            image="valid"
        )
        output = calculate_carbon_footprint(input_data, "gemini-1.5-flash")
        assert isinstance(output, CarbonFootprintOutput)
        assert "hoodie" in output.carbonfootprint
        assert "sweatpants" in output.carbonfootprint
        assert output.total_footprint > 0
        assert output.ecosavings > 0
        assert len(output.coupons) > 0
        assert output.coupontotal is not None

    def test_image_validity():
        # Test case to check image validity
        input_data = CarbonFootprintInput(
            category="Casual Wear",
            items=["hoodie", "sweatpants"],
            image="valid"
        )
        output = calculate_carbon_footprint(input_data, "gemini-1.5-flash")
        assert output.image == "valid"

        # Test with an invalid image
        input_data_invalid = CarbonFootprintInput(
            category="Casual Wear",
            items=["hoodie", "sweatpants"],
            image="invalid"
        )
        output_invalid = calculate_carbon_footprint(input_data_invalid, "gemini-1.5-flash")
        assert output_invalid.image == "invalid"

    def test_response_fields():
        # Test case to ensure all fields are present in the response
        input_data = CarbonFootprintInput(
            category="Casual Wear",
            items=["hoodie", "sweatpants"],
            image="valid"
        )
        output = calculate_carbon_footprint(input_data, "gemini-1.5-flash")
        assert output.carbonfootprint is not None
        assert output.coupons is not None
        assert output.coupontotal is not None
        assert output.ecosavings is not None
        assert output.modelused is not None
        assert output.image is not None
        assert output.total_footprint is not None