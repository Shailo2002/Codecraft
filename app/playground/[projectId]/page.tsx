import ClientPlayground from "./ClientPlayground";
import { redirect } from "next/navigation";
import { Frame, UserType } from "@/types";
import prisma from "@/lib/db";
import { getCurrentDbUser } from "@/lib/getCurrentDbUser";
import { getFrameData } from "@/lib/getFrameData";

type PageProps = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ frameId?: string }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const projectId = resolvedParams.projectId;
  const frameId = resolvedSearchParams.frameId;

  const user = (await getCurrentDbUser()) as UserType;
  if (!user) {
    redirect("/");
  }

  if (!frameId) {
    redirect("/workspace");
  }

  const frame = await getFrameData({ frameId: frameId });

  if (!frame) {
    redirect("/workspace");
  }

  return (
    <ClientPlayground
      projectId={projectId}
      frameId={frameId}
      initialFrame={frame?.data as unknown as Frame}
      user={user}
    />
  );
}
