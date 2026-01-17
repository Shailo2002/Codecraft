"use server";
import { currentUser } from "@clerk/nextjs/server";
import { cache } from "react";
import prisma from "../../lib/db";

export const renameProject = cache(
  async ({
    projectId,
    newProjectName,
  }: {
    projectId: string;
    newProjectName: string;
  }) => {

    if (!projectId || !newProjectName) {
      return { ok: false, error: "All fields are required" };
    }

    const user = await currentUser();
    if (!user) {
      return { ok: false, error: "Unauthorized" };
    }

    try {
      const projects = await prisma.project.update({
        where: { id: projectId },
        data: { projectName: newProjectName },
      });

      return { ok: true, data: projects?.projectName };
    } catch (error) {
      return { ok: false, error: "Internal server error" };
    }
  }
);
