import { Prisma } from "@/lib/generated/prisma/client";

export type ChatMessage = {
  id: string;
  chatMessage: Prisma.JsonValue;
  userId: string;
  createdAt: Date;
  frameId: string;
};
