"use server";
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";

export default async function createProject({
  chatMessage,
}: {
  chatMessage: any;
}) {
  const userDetail = await currentUser();
  if (!userDetail) {
    return { ok: false, error: "Unauthorized" };
  }

  try {
    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const dbUser = await tx.user.findUnique({
          where: { email: userDetail.primaryEmailAddress?.emailAddress },
        });

        if (!dbUser) {
          return { ok: false, error: "Unauthorized" };
        }

        if (dbUser.credits <= 0) {
          return { ok: false, error: "No credits remaining" };
        }

        const projectId = uuidv4();
        const frameId = crypto.randomUUID().slice(0, 8);
        const projectName =
          chatMessage.length > 50
            ? chatMessage.slice(0, 47) + "..."
            : chatMessage;

        const newProject = await tx.project.create({
          data: { projectId, userId: dbUser.id, projectName },
        });

        const newFrame = await tx.frame.create({
          data: {
            frameId,
            projectId: newProject.id,
            designCode: "<div> test code </div>",
          },
        });

        await tx.chatMessage.create({
          data: {
            chatMessage,
            userId: dbUser.id,
            frameId: newFrame.id,
          },
        });

        await tx.user.update({
          where: { id: dbUser.id },
          data: { credits: { decrement: 1 } },
        });

        return { ok: true, projectId, frameId };
      }
    );

    return result;
  } catch {
    return { ok: false, error: "Internal server error" };
  }
}
