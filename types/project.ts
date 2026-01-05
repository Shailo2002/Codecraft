import { Frame } from "./frames";

export type Project = {
  id: string;
  projectId: string;
  userId: string;
  createdAt: Date;
  frames: Frame[];
};
