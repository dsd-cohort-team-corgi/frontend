import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import convertToSubcurrency from "@/utils/stripe/convertToSubcurrency";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY in environment variables");
}

const stripe = new Stripe(secretKey, {
  apiVersion: "2025-06-30.basil",
});

// disabling because default exports don't work in api routes in Next.js
/* eslint-disable import/prefer-default-export */
export async function POST(request: NextRequest) {
  try {
    // const { serviceId } = await request.json();

    // const amount = await (response from supabase backend. I'd pass it the service id, then wait for it to send back the price for that service)
    const rawAmountFromServer = 25;
    const amount = convertToSubcurrency(rawAmountFromServer);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      // since we're only using the card element, we don't need to specify need automatic_payment_methods: { enabled: false } or payment_method_types: ["card"]
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 },
    );
  }
}
