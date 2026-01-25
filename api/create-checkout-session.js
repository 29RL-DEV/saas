import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// #payment
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { priceId, email, mode = "subscription" } = req.body;

    // #validate
    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }

    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    // #email_format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // #session
    const session = await stripe.checkout.sessions.create({
      mode: mode, // #mode
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${process.env.SITE_URL || "http://localhost:3000"}/dashboard?success=true`,
      cancel_url: `${process.env.SITE_URL || "http://localhost:3000"}?canceled=true`,
      metadata: {
        email: email,
        timestamp: new Date().toISOString(),
      },
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    // #error_handling
    console.error("Stripe error:", err);

    if (err.type === "StripeInvalidRequestError") {
      return res.status(400).json({
        error: "Invalid payment parameters",
        details: err.message,
      });
    }

    return res.status(500).json({
      error: "Failed to create checkout session",
      message: process.env.NODE_ENV === "development" ? err.message : null,
    });
  }
}
