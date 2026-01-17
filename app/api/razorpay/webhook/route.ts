import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") as string;
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

    const isValid = validateWebhookSignature(rawBody, signature, secret);

    if (!isValid) {
      return NextResponse.json(
        {
          message: "Invalid signature",
        },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);
    if (event.event === "subscription.charged") {
      const subscription = event.payload.subscription.entity;
      const payment = event.payload.payment.entity;

      const userId = subscription.notes.userId;

      if (userId) {
        await prisma.payment.create({
          data: {
            userId: userId,
            subscriptionId: subscription.id,
            paymentId: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            status: "captured",
            type: "subscription",
          },
        });

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: "PREMIUM",
            credits: { increment: 100 },
            premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
    } else if (event.event === "subscription.cancelled") {
      const subscription = event.payload.subscription.entity;
      const userId = subscription.notes.userId;

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            razorpaySubscriptionId: null,
          },
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
