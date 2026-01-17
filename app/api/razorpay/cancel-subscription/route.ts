import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const dbUser = await prisma.user.findUnique({
      where: { email: user.primaryEmailAddress.emailAddress },
    });

    if (!dbUser || !dbUser.razorpaySubscriptionId) {
      return NextResponse.json(
        { message: "No active subscription found" },
        { status: 400 }
      );
    }
    const subscriptionId = dbUser.razorpaySubscriptionId;
    await razorpay.subscriptions.cancel(subscriptionId, false);

    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        razorpaySubscriptionId: null,
      },
    });

    return NextResponse.json({
      message: "Subscription cancelled successfully",
    });
  } catch (error: any) {
    console.error("Cancel Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
