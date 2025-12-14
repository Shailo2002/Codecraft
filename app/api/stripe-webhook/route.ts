import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

export const dynamic = "force-dynamic"; // VERY IMPORTANT

// This disables body parsing (App Router version)
export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("Webhook event received:", event.type);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    console.log("Payment success:", event.data.object.id);
  } else if (event.type === "customer.subscription.created") {
    console.log("Payment success:", event.data.object.id);
  } else if (event.type === "invoice.payment_succeeded") {
    console.log("Payment success:", event.data.object.id);
  } else if (event.type === "customer.subscription.deleted") {
    console.log("Payment success:", event.data.object.id);
  }

  return NextResponse.json({ received: true });
}
