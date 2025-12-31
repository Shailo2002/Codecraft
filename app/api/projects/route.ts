import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
export async function POST(req: NextRequest) {
  try {
    const userDetail = await currentUser();
    if (!userDetail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const {
      chatMessage,
    }: { projectId: string; frameId: string; chatMessage: string } =
      await req.json();

    const projectId = await uuidv4();
    const frameId = await crypto.randomUUID().slice(0, 8);

    const result = await prisma.$transaction(async (tx) => {
      const dbUser = await tx.user.findUnique({
        where: { email: userDetail?.primaryEmailAddress?.emailAddress },
      });

      if (!dbUser) {
        throw new Error("USER_NOT_FOUND");
      }

      if (dbUser.credits <= 0) {
        throw new Error("CREDITS_EXHAUSTED");
      }
      const userId = dbUser?.id;
      //create Project table
      const newProject = await tx.project.create({
        data: {
          projectId,
          userId,
        },
      });
      const newProjectId = newProject?.id;

      //create frame
      const newFrame = await tx.frame.create({
        data: {
          frameId,
          projectId: newProjectId,
          designCode: "<div> test code </div>",
        },
      });
      const newFrameId = newFrame?.id;

      //create chatMessage
      const newChat = await tx.chatMessage.create({
        data: {
          chatMessage,
          userId,
          frameId: newFrameId,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } },
      });

      return { projectId, frameId, newProject, newFrame, newChat };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error.message === "CREDITS_EXHAUSTED") {
      return NextResponse.json(
        { error: "No credits remaining" },
        { status: 402 }
      );
    }

    if (error.message === "USER_NOT_FOUND") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("POST /api error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    console.log("project get endpoint check");
    const userDetail = await currentUser();

    const dbUser = await prisma.user.findUnique({
      where: { email: userDetail?.primaryEmailAddress?.emailAddress },
    });

    if (!dbUser) {
      return NextResponse.json(
        {
          error: "user not exist",
        },
        { status: 404 }
      );
    }

    const projects = await prisma.project.findMany({
      where: { userId: dbUser.id },
      include: {
        frames: { include: { chatMessages: true } },
      },
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
