# Eco-Scan Challenge Backend

This is the backend service for the Eco-Scan Challenge, built using [FastAPI](https://fastapi.tiangolo.com/). It provides endpoints for uploading images, calculating carbon footprints, and more.

## Getting Started

### Prerequisites

- [Python 3.8](https://www.python.org/downloads/release/python-380/) or higher
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd eco-scan-challenge/backend
   ```

2. **Create a virtual environment:**

   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**

   - On Windows:

     ```bash
     venv\Scripts\activate
     ```

   - On macOS and Linux:

     ```bash
     source venv/bin/activate
     ```

4. **Install the dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

### Environment Variables

Create a `.env` file in the `backend` directory and add the following variables:

```plaintext
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_prefered_gemini_model
USER=your_username
PASSWORD=your_password
```

Replace `your_gemini_api_key`, `your_username`, and `your_password` with your actual credentials.

### Running the Application

1. **Start the FastAPI server:**

   ```bash
   uvicorn main:app --reload
   ```

   The server will start on `http://127.0.0.1:8000`.

### Testing the Endpoint

To test the `/upload` endpoint, you can use the following `curl` command. Make sure to replace `USER` and `PASSWORD` with the values from your `.env` file:

```bash
curl -X POST "http://127.0.0.1:8000/upload" \
-u USER:PASSWORD \
-F "file=@/path/to/your/test.png"
```

### Running Tests

To run the tests, ensure your virtual environment is activated and execute:

```bash
pytest
```

### Deactivating the Virtual Environment

To deactivate the virtual environment, simply run:

```bash
deactivate
```

### Handling Module Import Errors

If you encounter module import errors even after installing the necessary packages, a `.pylintrc` file has been added to the project with the following configuration to resolve these issues:

```plaintext
[MASTER]
extension-pkg-allow-list=pydantic
```

This configuration allows [Pylint](https://pylint.org/) to recognize the `pydantic` module correctly.


## Additional Information

- **CORS Configuration:** The application currently allows all origins. Make sure to update the CORS settings in `main.py` before deploying to production.
- **Error Handling:** The application includes a general exception handler to return a 500 status code for unexpected errors.

For any issues or contributions, please open an issue or submit a pull request.

---

This README provides a comprehensive guide to setting up, running, and deploying your backend service. Make sure to replace placeholders with actual values and adjust any instructions specific to your environment or deployment process.
