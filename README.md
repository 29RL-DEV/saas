🚀 AI SaaS Platform – Stripe Subscriptions

This project is a learning-focused AI SaaS platform that demonstrates how a modern subscription-based application can be built using real payment processing and authentication.

The application is fully functional and uses real Stripe payments, but it should be considered an MVP, not a finished commercial product.

📌 What This Project Does

Provides an AI-powered chat interface

Allows users to sign up and log in

Protects access to a private dashboard

Uses Stripe Checkout for real subscription payments

Handles payments securely using serverless APIs

✨ Key Features

AI chat interface

User authentication with Supabase

Protected dashboard

Real Stripe payments (Checkout + Webhooks)

Subscription-ready SaaS structure

Serverless backend (Vercel)

🛠 Tech Stack
Frontend

React (Vite)

Context API

CSS Modules

Backend / Services

Stripe (Checkout & Webhooks)

Supabase (Auth & Database)

Vercel Serverless Functions

📂 Project Structure
saas/
├── api/
│   ├── create-checkout-session.js
│   └── webhooks.js
├── src/
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── pages/
│   └── App.jsx
├── public/
├── .env.example
├── .gitignore
├── vercel.json
├── package.json
└── README.md

🔐 Environment Variables

⚠️ Do not commit .env

Create a local .env file using `.env.example.

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

VITE_STRIPE_PUBLISHABLE_KEY=

💳 Stripe Payments (Real)
Checkout Flow

Frontend requests a checkout session

Server creates a Stripe Checkout session

User is redirected to Stripe to complete payment

Webhooks

Stripe events are handled via /api/webhooks

Used to confirm payments and activate subscriptions

Webhook secrets must be set in the Vercel dashboard.

⚙️ How It Works (High Level)

User signs up or logs in

User selects a subscription

Payment is handled by Stripe

Webhooks confirm the payment

User gains access to protected features

▶️ Run Locally
npm install
npm run dev


The app will be available at:

http://localhost:5173

☁️ Deployment (Vercel)

Push project to GitHub

Import repository into Vercel

Add environment variables

Deploy

Serverless API routes and webhooks are handled automatically.

📊 Project Status

Technically production-ready

Uses real Stripe payments

Built as an MVP for learning and portfolio purposes

Not a complete commercial product

🔒 Security Notes

.env is excluded via .gitignore

Stripe secret keys are never exposed client-side

Authentication is handled by Supabase

🚀 Possible Improvements

Subscription management UI

Usage limits per plan

Admin dashboard

Improved AI capabilities

📄 License

MIT License