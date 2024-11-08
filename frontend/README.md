# Eco Scan Frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Steps to Run the Application

After cloning the repository, follow these steps to set up and run the application:

1. **Install Dependencies**:
   Navigate to the project directory and install the required dependencies:

   ```bash
   npm install
   ```
2. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the necessary environment variables. Refer to the `.env.example` file if provided. Example:

   ```plaintext
   # Example environment variables
   NEXT_PUBLIC_API_USERNAME=<your_api_name>
   NEXT_PUBLIC_API_PASSWORD=<your_api_key>
   NEXT_PUBLIC_API_URI=YOUR_API_URI
   ```
3. **Run the Development Server**:
   Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Running Unit Tests

This project uses the `vite` testing framework from Next.js, with test files located in the `__tests__` folder.

To run tests, use the following command:

```bash
npm run test
```

Ensure that the `.env` file is correctly set up before running tests.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
