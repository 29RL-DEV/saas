/**
 * Stripe Webhook Handler
 * Processes payment events from Stripe
 *
 * Set your webhook URL in Stripe Dashboard to: https://yourdomain.com/api/webhooks
 */

import Stripe from "stripe";
import { supabase } from "../src/lib/supabase.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const signature = req.headers["stripe-signature"];
  const body = req.rawBody || JSON.stringify(req.body);

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).json({ error: "Invalid signature" });
  }

  try {
    // Handle specific event types
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionCanceled(event.data.object);
        break;

      case "charge.failed":
        await handleChargeFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}

/**
 * Handle successful payment
 */
async function handleCheckoutSessionCompleted(session) {
  console.log("✅ Payment successful:", session.id);

  const email = session.customer_email;
  const stripeCustomerId = session.customer;
  const amount = session.amount_total / 100; // Convert cents to dollars

  try {
    // Update user in Supabase
    const { error } = await supabase
      .from("users")
      .update({
        stripe_customer_id: stripeCustomerId,
        has_paid: true,
        paid_at: new Date(),
        amount_paid: amount,
      })
      .eq("email", email);

    if (error) {
      console.error("Failed to update user:", error);
    } else {
      console.log(`User ${email} marked as premium`);
    }
  } catch (err) {
    console.error("Database error:", err);
  }
}

/**
 * Handle subscription updates (renewal, plan changes)
 */
async function handleSubscriptionUpdated(subscription) {
  console.log("🔄 Subscription updated:", subscription.id);

  const email = subscription.metadata?.email;

  try {
    // Update subscription status
    const { error } = await supabase
      .from("subscriptions")
      .update({
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000),
      })
      .eq("email", email);

    if (error) {
      console.error("Failed to update subscription:", error);
    }
  } catch (err) {
    console.error("Database error:", err);
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCanceled(subscription) {
  console.log("❌ Subscription canceled:", subscription.id);

  const email = subscription.metadata?.email;

  try {
    // Remove access when subscription ends
    const { error } = await supabase
      .from("users")
      .update({
        has_paid: false,
        subscription_status: "canceled",
      })
      .eq("email", email);

    if (error) {
      console.error("Failed to cancel subscription:", error);
    } else {
      console.log(`User ${email} subscription canceled`);
    }
  } catch (err) {
    console.error("Database error:", err);
  }
}

/**
 * Handle failed payment
 */
async function handleChargeFailed(charge) {
  console.log("❌ Payment failed:", charge.id);

  const email = charge.metadata?.email;

  try {
    // Notify user of failed payment
    const { error } = await supabase.from("payment_failures").insert({
      email,
      stripe_charge_id: charge.id,
      failure_reason: charge.failure_message,
      failed_at: new Date(),
    });

    if (error) {
      console.error("Failed to log payment failure:", error);
    } else {
      console.log(`Payment failure logged for ${email}`);
    }

    // In production, send email notification to user
    // await sendPaymentFailedEmail(email, charge.failure_message);
  } catch (err) {
    console.error("Database error:", err);
  }
}
