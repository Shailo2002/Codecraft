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
    console.log("create chat initiated");
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
        include: {
          chatMessages: true,
        },
      });

      console.log(
        "number of chatmessage in frame : ",
        dbFrame?.chatMessages?.length,
        " user type : ",
        dbUser?.plan
      );

      const numberOfMessage = dbFrame?.chatMessages?.length || 0;

      if (numberOfMessage >= 10 && dbUser?.plan !== "PREMIUM") {
        return {
          ok: false,
          error: "Chat limit reached. Upgrade to Premium to continue.",
        };
      }

      if (numberOfMessage >= 80 && dbUser?.plan === "PREMIUM") {
        return {
          ok: false,
          error:
            "Maximum chats reached for this project. Please switch to a new project.",
        };
      }

      const newChat = await prisma.chatMessage.create({
        data: {
          chatMessage,
          userId: dbUser?.id as string,
          frameId: dbFrame?.id,
        },
      });

      return { ok: true, message: "chat added" };
    } catch (error) {
      return { ok: false, error: "createChatMessage internal server error" };
    }
  }
);
