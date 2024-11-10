"use server";

import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

export default async function createStripeCheckout() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-10-28.acacia",
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    success_url: `http://localhost:3000`,
    cancel_url: `http://localhost:3000`,
    line_items: [
      {
        price: process.env.STRIPE_PREMIUM_PLAN_PRICE_ID,
        quantity: 1,
      },
    ],
    subscription_data: {
      metadata: {
        clerk_user_id: userId,
      },
    },
  });

  return {
    sessionId: session.id,
  };
}
