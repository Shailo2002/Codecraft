import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { frameId: string } }
) {
  try {
    const { frameId } = await params;
    const data = await req.json();
    const { chatMessage } = data;
    const userDetail = await currentUser();

    const dbUser = await prisma.user.findUnique({
      where: { email: userDetail?.primaryEmailAddress?.emailAddress },
    });

    const dbFrame = await prisma.frame.findUnique({
      where: { frameId },
    });
    const newChat = await prisma.chatMessage.create({
      data: {
        chatMessage,
        userId: dbUser?.id as string,
        frameId: dbFrame?.id,
      },
    });

    console.log("user : ", dbUser);
    console.log("chatMessage : ", chatMessage);
    console.log("frameId : ", frameId);
    console.log("newChat : ", newChat);

    return NextResponse.json({ status: 200, message: "chat added" });
  } catch (error) {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
