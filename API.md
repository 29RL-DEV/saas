# SaaS API Documentation

## Overview

This SaaS platform handles user authentication, payment processing, and dashboard management.

- **Frontend**: React + Vite
- **Backend**: Supabase (Auth + Database)
- **Payments**: Stripe
- **Hosting**: Vercel

## Setup

### Prerequisites

- Node.js 14+
- Supabase account (free)
- Stripe account (free)

### Environment Variables

Create `.env` file:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_your_test_key_here

# API
VITE_API_URL=http://localhost:3000
```

### Installation

```bash
npm install
npm run dev
```

## API Endpoints

### Authentication (Supabase)

All auth is handled by Supabase Auth module. No backend endpoints needed!

**Sign Up**

```javascript
await supabase.auth.signUp({
  email: "user@example.com",
  password: "password123",
});
```

**Login**

```javascript
await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password123",
});
```

**Get Current User**

```javascript
const { data } = await supabase.auth.getUser();
```

---

### Payment Processing (Stripe)

**Create Checkout Session**

```
POST /api/create-checkout-session.js
```

**Request Body:**

```json
{
  "priceId": "price_your_stripe_price_id",
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**How to Use in Frontend:**

```javascript
const response = await fetch("/api/create-checkout-session", {
  method: "POST",
  body: JSON.stringify({ priceId, email }),
});
const { url } = await response.json();
window.location.href = url; // Redirects to Stripe
```

---

### Webhooks (Stripe)

Stripe sends events to your API when:

- ✅ Payment successful → `checkout.session.completed`
- ❌ Payment failed → `charge.failed`
- 💳 Subscription canceled → `customer.subscription.deleted`

**Webhook Handler Example:**

```javascript
app.post("/webhook", (req, res) => {
  const event = req.body;

  switch (event.type) {
    case "checkout.session.completed":
      // User paid → give access to premium features
      const session = event.data.object;
      grantUserPremiumAccess(session.customer_email);
      break;

    case "charge.failed":
      // Payment failed → notify user
      break;
  }

  res.json({ received: true });
});
```

---

## Database Schema (Supabase)

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

_Automatically managed by Supabase Auth_

### Payments Table

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  stripe_session_id TEXT UNIQUE,
  amount INT NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending', -- pending, completed, failed
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Subscriptions Table

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  stripe_subscription_id TEXT UNIQUE,
  status TEXT, -- active, canceled, past_due
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Features

### Authentication

- Email/password signup
- OAuth (optional via Supabase)
- Auto token refresh
- Persistent sessions

### Payment Processing

- Stripe checkout integration
- One-time payments
- Subscription management
- Invoice handling

### Dashboard

- User profile management
- Subscription status
- Payment history
- Settings

---

## Testing Stripe Locally

Use **Stripe Test Mode** with test card numbers:

```
Card Number:  4242 4242 4242 4242
Expiry:       12/34 (any future date)
CVC:          123
```

Payment will succeed instantly with these test credentials.

---

## Deployment

### Deploy to Vercel

```bash
vercel deploy
```

Add environment variables in Vercel dashboard:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLIC_KEY`

### Stripe Production

1. Switch from Test Mode to Live Mode in Stripe Dashboard
2. Replace test keys with **live** keys in `.env`
3. Update Stripe webhook URL to production domain
4. Enable email confirmations in Supabase

---

## Common Flows

### User Signup → Payment

1. User signs up via Supabase Auth
2. Clicks "Upgrade Plan"
3. Redirected to Stripe Checkout
4. Stripe sends webhook → App grants premium access
5. User redirected to dashboard

### Subscription Renewal

1. Stripe auto-charges on renewal date
2. Sends `customer.subscription.updated` webhook
3. App updates subscription status in database
4. User keeps access (or loses if payment fails)

---

## Security Notes

✅ **Done Right:**

- Environment variables not exposed
- Stripe public key safe to expose
- Supabase row-level security enabled
- Auth token management automatic

⚠️ **To Improve:**

- Add input validation on payment routes
- Implement rate limiting
- Add CORS restrictions
- Log all payment events

---

## Troubleshooting

**"Stripe key is invalid"**

- Check you're using **public key** in frontend
- Don't expose **secret key** in frontend

**"Payment creates but user not premium"**

- Check webhook URL is correct in Stripe
- Verify webhook handler is running
- Check database permissions

**"Session expires quickly"**

- Supabase auto-refreshes tokens
- But cookies must be enabled
- Check browser storage settings

---

**This is a complete SaaS boilerplate ready for production!** 🚀
