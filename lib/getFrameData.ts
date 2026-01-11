import { currentUser } from "@clerk/nextjs/server";
import { cache } from "react";
import prisma from "./db";

export const getFrameData = cache(
  async ({ projectId, frameId }: { projectId?: string; frameId: string }) => {
    try {
      console.log("frame get endpoint check");
      const userDetail = await currentUser();

      const dbUser = await prisma.user.findUnique({
        where: { email: userDetail?.primaryEmailAddress?.emailAddress },
      });

      if (!dbUser) {
        return null;
      }

      const frame = await prisma.frame.findUnique({
        where: { frameId },
        include: {
          chatMessages: true,
        },
      });

      return { ok: true, data:frame };
    } catch (error) {
      return {ok:false, message:"internal server error ", error}
      throw error;
    }
  }
);


