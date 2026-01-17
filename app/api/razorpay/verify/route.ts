import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";

const instance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const res = await req.json();

    const razorpay_payment_id = res?.razorpay_payment_id;
    const razorpay_order_id = res?.razorpay_order_id;
    const razorpay_signature = res?.razorpay_signature;
    const razorpay_subscription_id = res?.razorpay_subscription_id;
    const type = res?.type;
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

    if (
      !razorpay_payment_id ||
      !(razorpay_order_id || razorpay_subscription_id) ||
      !razorpay_signature
    ) {
      return NextResponse.json({
        status: 401,
        message: "All fields required",
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      throw new Error("RAZORPAY_KEY_SECRET is not defined");
    }

    if (type === "one_time") {
      const existingPayment = await prisma.payment.findUnique({
        where: { orderId: razorpay_order_id },
      });

      if (!existingPayment) {
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }

      if (existingPayment.userId !== dbUser.id) {
        return NextResponse.json(
          { message: "Unauthorized: Payment does not belong to user" },
          { status: 403 }
        );
      }

      if (existingPayment.status === "captured") {
        return NextResponse.json(
          {
            message: "Payment already processed",
          },
          { status: 200 }
        );
      }

      const isValid = validatePaymentVerification(
        { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
        razorpay_signature,
        secret
      );

      if (!isValid) {
        return NextResponse.json(
          {
            message: "Invalid signature",
          },
          { status: 400 }
        );
      }

      const payment = await prisma.payment.update({
        where: { orderId: razorpay_order_id },
        data: { paymentId: razorpay_payment_id, status: "captured" },
      });

      if (payment?.amount === 1000) {
        await prisma.user.update({
          where: { id: dbUser?.id },
          data: {
            credits: { increment: 10 },
            premiumExpiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            plan: "PREMIUM",
          },
        });
      } else if (payment?.amount === 9900) {
        await prisma.user.update({
          where: { id: dbUser?.id },
          data: {
            credits: { increment: 100 },
            premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            plan: "PREMIUM",
          },
        });
      }

      return NextResponse.json({
        status: 200,
        message: "Payment verified and user updated",
      });
    } else if (type === "subscription") {
      const existingPayment = await prisma.payment.findFirst({
        where: { subscriptionId: razorpay_subscription_id, userId: dbUser?.id },
      });

      if (!existingPayment) {
        return NextResponse.json(
          { message: "Subscription not found" },
          { status: 404 }
        );
      }

      if (existingPayment.userId !== dbUser.id) {
        return NextResponse.json(
          { message: "Unauthorized: Payment does not belong to user" },
          { status: 403 }
        );
      }

      if (existingPayment.status === "captured") {
        return NextResponse.json(
          {
            message: "Payment already processed",
          },
          { status: 200 }
        );
      }
      const isValid = validatePaymentVerification(
        {
          subscription_id: razorpay_subscription_id,
          payment_id: razorpay_payment_id,
        },
        razorpay_signature,
        secret
      );

      if (!isValid) {
        return NextResponse.json(
          {
            message: "Invalid signature",
          },
          { status: 400 }
        );
      }

      await prisma.payment.update({
        where: { id: existingPayment?.id },
        data: {
          status: "captured",
          paymentId: razorpay_payment_id,
        },
      });

      await prisma.user.update({
        where: { id: existingPayment?.userId },
        data: {
          plan: "PREMIUM",
          razorpaySubscriptionId: razorpay_subscription_id,
          credits: { increment: 100 },
          premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      return NextResponse.json({
        status: 200,
        message: "Payment verified and user updated",
      });
    }
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
