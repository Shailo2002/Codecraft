import { prisma } from "./db";

async function getFrameDetail() {
    try {
      console.log("frame get endpoint check");
      const { searchParams } = new URL(req.url);
      const projectId = searchParams.get("projectId");
      const frameId = searchParams.get("frameId");
  
      const result = await prisma.frame.findUnique({
        where: { frameId: frameId ?? "" },
        include: {
          chatMessages: true,
        },
      });
      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "internal error" }, { status: 500 });
    }
}

export default getFrameDetail