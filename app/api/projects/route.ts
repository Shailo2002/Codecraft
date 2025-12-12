import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userDetail = await currentUser();
    const {
      projectId,
      frameId,
      chatMessage,
    }: { projectId: string; frameId: string; chatMessage: string } =
      await req.json();

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

    const userId = dbUser?.id;

    const result = await prisma.$transaction(async (tx) => {
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

      return { newProject, newFrame, newChat };
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
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
