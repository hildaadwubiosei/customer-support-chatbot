
---

# AI Customer Support Chatbot

## Overview

This project is an AI-powered customer support chatbot built using Next.js and the Vercel AI SDK. The chatbot can handle user queries, provide relevant responses, and can be integrated into any website.

## Features

- **AI-Powered Responses**: Uses the Vercel AI SDK to generate responses to user queries.
- **Contextual Responses**: Maintains context over multiple interactions.
- **Deployable**: Easy deployment to Vercel with CI/CD setup.

## Installation

### Development Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/Borngod/AI-Customer-Support.git
    cd chatbot
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Create a `.env.local` file**:

    Add your Vercel AI API key in the `.env.local` file:

    ```env
    NEXT_PUBLIC_VERCEL_AI_API_KEY=your-vercel-ai-api-key
    ```

4. **Run the development server**:

    ```bash
    npm run dev
    ```

5. **Open [http://localhost:3000](http://localhost:3000) to view it in your browser**.

## Project Structure

- **`/components`**: React components for the chatbot interface.
- **`/pages/api`**: API endpoints to handle user queries and interact with the Vercel AI SDK.
- **`/public`**: Static assets.
- **`/styles`**: CSS styles.
- **`/utils`**: Utility functions.



## Deployment

### Vercel

1. **Deploy to Vercel**:

    ```bash
    vercel deploy
    ```

2. **Set environment variables on Vercel**:

   Go to your Vercel dashboard, navigate to your project settings, and add the `NEXT_PUBLIC_VERCEL_AI_API_KEY` environment variable with your Vercel AI API key.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a Pull Request.

## License

This project is licensed under the MIT License.

---

