"use server";
import { currentUser } from "@clerk/nextjs/server";
import { cache } from "react";
import prisma from "../../lib/db";
import { Message } from "@/types";

export const createChatMessage = cache(
  async ({
    frameId,
    chatMessage,
  }: {
    frameId: string;
    chatMessage: Message[];
  }) => {
    try {
      const userDetail = await currentUser();

      const dbUser = await prisma.user.findUnique({
        where: { email: userDetail?.primaryEmailAddress?.emailAddress },
      });

      if (!dbUser) {
        return { ok: false, error: "Unauthorized" };
      }

      const dbFrame = await prisma.frame.findUnique({
        where: { frameId },
      });

      const newChat = await prisma.chatMessage.create({
        data: {
          chatMessage,
          userId: dbUser?.id as string,
          frameId: dbFrame?.id,
        },
      });

      return { ok: true, message: "chat added" };
    } catch (error) {
      return { ok: false, message: "createChatMessage internal server error" };
    }
  }
);
