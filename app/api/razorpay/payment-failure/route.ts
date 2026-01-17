import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { order_id, payment_id, reason } = await req.json();

    await prisma.payment.update({
      where: { orderId: order_id },
      data: {
        status: "failed",
        paymentId: payment_id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
