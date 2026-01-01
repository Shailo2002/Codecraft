import { ChatMessage } from "./chatMessage";

export type Frame = {
  id: string;
  frameId: string;
  projectId: string;
  designCode: string;
  chatMessages: ChatMessage[];
};
