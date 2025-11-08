import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
        console.log("check 1");

    const userDetail = await currentUser();
    const {
      projectId,
      frameId,
      chatMessage,
    }: { projectId: string; frameId: string; chatMessage: string } =
      await req.json();
    console.log("check 2 : ", projectId, frameId, chatMessage);

    const dbUser = await prisma.user.findUnique({
      where: { email: userDetail?.primaryEmailAddress?.emailAddress },
    });
    console.log("check 3 : ", dbUser);

    if (!dbUser) {
      return NextResponse.json(
        {
          error: "user not exist",
        },
        { status: 404 }
      );
    }

    const userId = dbUser?.id;
    console.log("check 4");

    const result = await prisma.$transaction(async (tx) => {
      //create Project table
      const newProject = await tx.project.create({
        data: {
          projectId,
          userId,
        },
      });
      const newProjectId = newProject?.id;
    console.log("check 5");

      //create frame
      const newFrame = await tx.frame.create({
        data: {
          frameId,
          projectId: newProjectId,
        },
      });
    console.log("check 6");

      //create chatMessage
      const newChat = await tx.chatMessage.create({
        data: {
          chatMessage,
          userId,
        },
      });
    console.log("check 7");

      return { newProject, newFrame, newChat };
    });
    console.log("check 8");

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
