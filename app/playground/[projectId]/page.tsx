import { prisma } from "@/lib/db";
import ClientPlayground from "./ClientPlayground";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ frameId?: string }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const projectId = resolvedParams.projectId;
  const frameId = resolvedSearchParams.frameId;

  if (!frameId) {
    redirect("/workspace");
  }

  const frame = await prisma.frame.findUnique({
    where: { frameId: frameId ?? "" },
    include: {
      chatMessages: true,
    },
  });


  console.log("frame : ", frame);

  if (!frame) {
    redirect("/workspace");
  }

  return (
    <ClientPlayground
      projectId={projectId}
      frameId={frameId}
      initialFrame={frame}
    />
  );
}
