// export type ChatMessage = {
//   id: string;
//   chatMessage: Prisma.JsonValue;
//   userId: string;
//   createdAt: Date;
//   frameId: string;
// };

export type ChatMessage = {
  id: string;
  chatMessage: Message[];
  userId: string;
  createdAt: Date;
  frameId: string;
};

export type Message = {
  role: string;
  content: string;
};
