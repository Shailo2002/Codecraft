
"use server";
import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

async function createProject({ chatMessage }: { chatMessage: Prisma.JsonArray }) {
  try {
    const userDetail = await currentUser();
    if (!userDetail) {
      return null;
    }
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

      return { projectId, frameId};
    });

    return result;
  } catch (error: any) {
    if (error.message === "CREDITS_EXHAUSTED") {
      throw new Error("No credits remaining");
    }
    if (error.message === "USER_NOT_FOUND") {
      throw new Error("Unauthorized");
    }
    throw new Error(error.message || "INTERNAL_ERROR");
  }
}

export default createProject;
