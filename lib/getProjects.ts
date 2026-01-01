import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./db";
import { cache } from "react";

export const getProjects = cache(async  () => {
  try {
    console.log("project get endpoint check");
    const userDetail = await currentUser();

    const dbUser = await prisma.user.findUnique({
      where: { email: userDetail?.primaryEmailAddress?.emailAddress },
    });

    if (!dbUser) {
      return null;
    }

    const projects = await prisma.project.findMany({
      where: { userId: dbUser.id },
      include: {
        frames: { include: { chatMessages: true } },
      },
    });

    console.log("projects : ", projects);

    return projects;
  } catch (error) {
    return console.error("getOrCreateCurrentUser failed:", error);
    throw error;
  }
}
)