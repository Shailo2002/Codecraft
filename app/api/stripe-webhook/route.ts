import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

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
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    console.log("Payment success webhook ");

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const type = session.metadata?.type;

    if (!userId || !type) {
      return NextResponse.json(
        {
          error: "error occur while transaction happen",
        },
        { status: 404 }
      );
    }

    await prisma.payment.create({
      data: {
        userId,
        stripeSessionId: session.id,
        paymentIntentId: session.payment_intent as string,
        subscriptionId: session.subscription as string | null,
        amount: session.amount_total!,
        currency: session.currency!,
        status: session.payment_status!,
        type,
      },
    });

    if (type === "one_time") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: "PREMIUM",
          credits: 100,
          premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    if (type === "subscription") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: "PREMIUM",
          credits: 100,
          stripeSubscriptionId: session.subscription as string,
        },
      });
    }
  } else if (event.type === "customer.subscription.created") {
  } else if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as any;
    const subscriptionId = (invoice.subscription as string) || "";

    const user = await prisma.user.findFirst({
      where: { stripeSubscriptionId: subscriptionId },
    });

    if (!user) {
      console.warn("User not found for subscription:", subscriptionId);
      return NextResponse.json({ received: true });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: 100, // reset monthly
        plan: "PREMIUM",
      },
    });
  } else if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    const user = await prisma.user.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (!user) {
      console.warn("User not found for subscription:", subscription.id);
      return NextResponse.json({ received: true });
    }


    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: "FREE",
        credits: 2,
        stripeSubscriptionId: null,
      },
    });
  }

  return NextResponse.json({ received: true });
}
