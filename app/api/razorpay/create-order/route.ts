import prisma from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import { currentUser } from "@clerk/nextjs/server";
import { PaymentType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const PRICING = {
  one_time: {
    testing: 1000,
    monthly: 9900,
  },
} as const;

export async function POST(req: NextRequest) {
  try {
    const { type, pricing_type } = (await req.json()) as {
      type: string;
      pricing_type: keyof typeof PRICING.one_time;
    };

    const userDetail = await currentUser();

    if (!userDetail) {
      return NextResponse.json(
        {
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        email: userDetail.primaryEmailAddress?.emailAddress,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (dbUser.plan === "PREMIUM") {
      return NextResponse.json(
        {
          message: "Already subscribed to premium plan",
        },
        { status: 403 }
      );
    }

    if (type === "one_time") {
      const amount = PRICING.one_time[pricing_type];

      const order = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: `rcpt_${crypto.randomUUID().slice(0, 30)}`,
      });

      await prisma.payment.create({
        data: {
          userId: dbUser.id,
          orderId: order.id,
          amount,
          currency: "INR",
          type: PaymentType.one_time,
        },
      });

      return NextResponse.json(
        {
          message: "Payment initiated",
          data: order,
          isSubscription: false,
        },
        { status: 201 }
      );
    } else if (type === "subscription") {
      const subscription = await razorpay.subscriptions.create({
        plan_id: process.env.RAZORPAY_SUBSCRIPTION_PLAN_ID!,
        customer_notify: 1,
        total_count: 120,
        quantity: 1,
        notes: {
          userId: dbUser.id,
        },
      });

      await prisma.payment.create({
        data: {
          userId: dbUser.id,
          subscriptionId: subscription?.id,
          amount: 9900,
          currency: "INR",
          type: PaymentType.subscription,
        },
      });

      return NextResponse.json(
        {
          message: "subscription initiated",
          data: subscription,
          isSubscription: true,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
