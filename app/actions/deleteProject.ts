"use server";

import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export default async function deleteProject({
  projectId,
}: {
  projectId: string;
}) {
  console.log("delete project : ", projectId);
  const user = await currentUser();
  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const dbUser = await tx.user.findUnique({
        where: { email: user.primaryEmailAddress?.emailAddress },
      });

      if (!dbUser) {
        throw new Error("Unauthorized");
      }

      const project = await tx.project.findFirst({
        where: {
          id: projectId,
          userId: dbUser.id,
        },
        include: {
          frames: true,
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      const frameIds = project.frames.map((f) => f.id);

      await tx.chatMessage.deleteMany({
        where: {
          frameId: { in: frameIds },
        },
      });

      await tx.frame.deleteMany({
        where: {
          projectId: project.id,
        },
      });

      await tx.project.delete({
        where: {
          id: project.id,
        },
      });
    });

    return { ok: true };
  } catch (error) {
    return { ok: false, error: "Internal server error" };
  }
}
