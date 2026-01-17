import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
      type,
      pricing_type,
    } = body;

    const user = await currentUser();
    // ... Add user check logic here similar to before ...
    const userId = user?.id; // Assuming you fetch the db ID

    // --- VERIFY SIGNATURE ---
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    let generated_signature = "";

    if (type === "subscription") {
      // Subscription verification formula
      const data = razorpay_payment_id + "|" + razorpay_subscription_id;
      generated_signature = crypto
        .createHmac("sha256", secret)
        .update(data)
        .digest("hex");
    } else {
      // One-time order verification formula
      const data = razorpay_order_id + "|" + razorpay_payment_id;
      generated_signature = crypto
        .createHmac("sha256", secret)
        .update(data)
        .digest("hex");
    }

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    // --- UPDATE DATABASE ---
    // Perform the exact same DB updates you had in your Stripe Webhook here.
    // This gives immediate feedback to the user without waiting for the webhook.

    // Example:
    // if (type === "one_time") {
    //   await prisma.payment.create({
    //     data: {
    //       userId: userId,
    //       stripeSessionId: razorpay_order_id, // You might rename this field to razorpayOrderId in Schema
    //       amount: 0, // Fetch real amount if needed
    //       currency: "INR",
    //       status: "completed",
    //       type,
    //     },
    //   });

    //   // Update User Credits...
    // }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
