"use server";
import { currentUser } from "@clerk/nextjs/server";
import { cache } from "react";
import prisma from "../../lib/db";

export const getDeploymentUrl = cache(async (projectId: string) => {
  try {
    console.log("project get deploymenturl route : ", projectId);

    const projects = await prisma.project.findFirst({
      where: { id: projectId },
    });

    return projects?.deploymentUrl;
  } catch (error) {
    return console.error("getDeploymentUrl failed:", error);
    throw error;
  }
});
