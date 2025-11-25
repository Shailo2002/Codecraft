import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log("frame get endpoint check");
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const frameId = searchParams.get("frameId");

    const result = await prisma.frame.findUnique({
      where: { frameId: frameId ?? "" },
      include: {
        chatMessages: true,
      },
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { frameId, designCode } = data;

    const result = await prisma.frame.update({
      where: { frameId: frameId ?? "" },
      data: {
        designCode,
      },
    });
    return NextResponse.json({
      message: "code saved successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
