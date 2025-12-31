import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // body.type = "one_time" OR "subscription"
    const { type } = body;
    const userDetail = await currentUser();

    if (!userDetail?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ message: "Signin required" });
    }

    const checkUser = await prisma.user.findFirst({
      where: { email: userDetail?.primaryEmailAddress?.emailAddress },
    });

    if (!checkUser) {
      return NextResponse.json({ messag: "User not found" });
    }
    console.log("stripe url checkuser Id : ", checkUser.id);

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
        success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/payment-success`,
        cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/payment-cancel`,
        metadata: {
          userId: checkUser.id,
          type,
        },
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
        success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/payment-success`,
        cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/payment-cancel`,
        metadata: {
          userId: checkUser.id,
          type,
        },
      });
    }

    if (!session) {
      return NextResponse.json({ message: "Stripe Error" });
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
