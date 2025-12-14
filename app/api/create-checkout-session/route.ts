import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    // body.type = "one_time" OR "subscription"
    const { type } = body;

    let session;

    if (type === "one_time") {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price: process.env.STRIPE_ONE_TIME_PRICE_ID,
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/workspace`,
        cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cancel`,
      });
    }

    if (type === "subscription") {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID,
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/workspace`,
        cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cancel`,
      });
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
