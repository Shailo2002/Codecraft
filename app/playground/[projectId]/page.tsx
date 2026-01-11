import ClientPlayground from "./ClientPlayground";
import { redirect } from "next/navigation";
import { Frame, UserType } from "@/types";
import prisma from "@/lib/db";
import { getCurrentDbUser } from "@/lib/getCurrentDbUser";

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

  const frame = await prisma.frame.findUnique({
    where: { frameId: frameId ?? "" },
    include: {
      chatMessages: true,
    },
  });

  if (!frame) {
    redirect("/workspace");
  }

  return (
    <ClientPlayground
      projectId={projectId}
      frameId={frameId}
      initialFrame={frame as unknown as Frame}
      user={user}
    />
  );
}
