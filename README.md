# 🌍 EcoScan - Clothing Carbon Footprint Scanner

## 📜 Overview

EcoScan is a web application designed to help users understand the environmental impact of their clothing. By uploading images of clothing items, users can see estimated carbon scores, earn eco-reward points, and redeem sustainability-focused offers. This project demonstrates a full-stack solution for a green initiative product.

## 🔧 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (React framework) with [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Image Recognition**: Gemini-1.5-Flash vision model
- **Deployment**: [Vercel](https://vercel.com/) and [Koyeb](https://www.koyeb.com/)

---

## 🚀 Setup Instructions

### Frontend

1. **Clone the Repository**First, clone the repository and navigate into the project directory:

   ```bash
   git clone https://github.com/yakkshit/eco-scan-challenge.git
   cd eco-scan-challenge/frontend
   ```
2. **Install Dependencies**

   ```bash
   npm install
   ```
3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and add the necessary environment variables. Refer to the `.env.example` file if provided. Example:

   ```plaintext
   # Example environment variables
   API_USERNAME=<your_api_name>
   API_PASSWORD=<your_api_key>
   ```
4. **Run the Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

   For more detailed backend setup instructions, please refer to the [frontend README file](https://github.com/yakkshit/eco-scan-challenge/blob/main/frontend/README.md).

### Backend

1. **Clone the Repository**First, clone the repository and navigate into the project directory:

   ```bash
   git clone https://github.com/yakkshit/eco-scan-challenge.git
   cd eco-scan-challenge/backend
   ```
2. **Create and Activate Virtual Environment (Recommended)**
   It's recommended to use a virtual environment to manage your dependencies. You can create and activate a virtual environment using the following commands:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```
4. **Run the Development Server**

   ```bash
   python main.py
   ```

   The backend will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000). If you like to check swagger docs visit at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

For more detailed backend setup instructions, please refer to the [backend README file](./backend/README.md).

### Testing

To run tests, use the following command:

```bash
npm run test  # for frontend tests
pytest        # for backend tests
```

Ensure that the `.env` file is correctly set up before running tests.

---

Okay, here is the updated "Carbon Score Assumptions" section with the additional details you provided about the backend implementation:

## 🌱 Carbon Score Assumptions (**Carbon Score & Reward Logic**).

To calculate the environmental impact of each clothing item, we have assigned approximate carbon scores based on item type. These scores are stored in an in-memory dictionary for quick access.

In the backend, we have created the following data structures:

1. **Valid Users**: A dictionary that stores valid usernames and their corresponding passwords. This is used to authenticate users before allowing them to access the endpoint.
2. **Coupons**: A dictionary of randomly generated coupons, each with the following fields:

   - `title`: The title of the coupon
   - `price`: The price of the coupon
   - `link`: A link to redeem the coupon
3. **Carbon Footprint**: A dictionary that stores the estimated carbon footprint for various clothing items. If an item is not present in this dictionary, a random carbon footprint value between 1 and 5 kg CO₂ is generated and assigned.

The backend endpoint checks if the requested items are present in the carbon footprint dictionary. If an item is not found, it is assigned a value of "0kg". The total carbon footprint is calculated by summing the non-zero values in the dictionary.

The eco-savings points are calculated as twice the total carbon footprint in the scan. The available coupons are then filtered based on the user's total eco-savings points, and the filtered coupons are returned in the response.

| 👕 Item | 🌍 Estimated Carbon Score (kg CO₂) |
| ------- | ----------------------------------- |
| T-shirt | 5                                   |
| Jeans   | 10                                  |
| Jacket  | 15                                  |
| ....    | ...                                 |

Relevant context:

default_carbonfootprints = {
    "t-shirt": "5kg",
    "jeans": "10kg",
    "jacket": "15kg",
    "shoes": "8kg"
}

valid_users = {
    "user1": "password1",
    "user2": "password2"
}

company_coupons = [
    {"title": "20% off sustainable t-shirts", "price": "$10", "link": "/redeem-coupon-1"},
    {"title": "Free shipping on eco-friendly jeans", "price": "$0", "link": "/redeem-coupon-2"},
    {"title": "Buy one, get one 50% off on recycled jackets", "price": "$20", "link": "/redeem-coupon-3"},
    {"title": "15% discount on sustainable shoes", "price": "$5", "link": "/redeem-coupon-4"}
]

## 🌟 Product & Technical Enhancements.

In this section, we suggest possible improvements that could make **EcoScan** a more effective and scalable solution.

1. **Scaling the Backend**: To handle larger user loads, we could consider integrating a database to store user information, transaction history, and item details. This would allow us to offload the in-memory storage and scale the backend horizontally as needed.
2. **Enhanced Eco-Score Model**: By incorporating more detailed data from sources like industry reports, material databases, and brand sustainability information, we could improve the accuracy of the carbon scoring model. This could involve developing a [machine learning](https://en.wikipedia.org/wiki/Machine_learning)-based model to provide more personalized and dynamic eco-scores.
3. **User Experience Improvements**: To enhance the user experience, we could add features like:

   - Sustainability comparisons: Allow users to compare the carbon footprint of their clothing items to industry averages or sustainable alternatives.
   - Interactive visualizations: Provide interactive graphs and charts to help users better understand their environmental impact and eco-rewards.
   - Personalized recommendations: Suggest sustainable clothing options or brands based on the user's purchase history and eco-scores.
4. **API Integrations**: To further improve the accuracy and dynamism of the eco-scoring, we could integrate with external APIs that provide real-time data on material production, transportation, and manufacturing impacts. This would allow us to keep the carbon scoring up-to-date and tailored to the latest industry trends.
5. **Video Analysis Capability**: The [Gemini vision model](https://gemini.google.com/) used in the application has the capability of video analysis, which could be leveraged to provide a more comprehensive and dynamic assessment of a user's wardrobe.
6. **Internationalization and Localization**: The entire text content of the web app is stored in a `data.json` file, making it easy to add support for internationalization and localization. This would allow the application to be easily customized and deployed in different regions or languages.
7. **Improved Backend Security**: While the current implementation uses basic username and password authentication, we could enhance the security by implementing a [JWT (JSON Web Token)](https://www.sitepoint.com/using-json-web-tokens-node-js/) authentication system. This would provide a more robust and scalable solution for user authentication and authorization.
8. **Modular and Extensible Backend**: By adding more endpoints to the backend, we can easily expand the functionality of the EcoScan application. The current implementation leverages the benefits of [Next.js](https://nextjs.org/) and [FastAPI](https://fastapi.tiangolo.com/), which are both known for their performance and scalability. Additionally, the Gemini vision model used in the application is a cost-effective solution compared to [GPT](https://en.wikipedia.org/wiki/Generative_pre-trained_transformer), while still providing reliable image recognition capabilities.

---

## 📲 Deployment

The frontend of EcoScan is deployed on [Vercel](https://vercel.com/), while the backend is deployed on [Koyeb](https://www.koyeb.com/).

- **Frontend URL**: [https://eco-scan-challenge.vercel.app/](https://eco-scan-challenge.vercel.app/)
- **Backend URL**: [https://surviving-condor-cedz-dfdfcde1.koyeb.app/](https://surviving-condor-cedz-dfdfcde1.koyeb.app/)

---

### Thank you for building a greener future with EcoScan! 🌍💚
