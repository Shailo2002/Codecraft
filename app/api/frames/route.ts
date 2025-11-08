import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
 try {
   const { searchParams } = new URL(req.url);
   const projectId = searchParams.get("projectId");
   const frameId = searchParams.get("frameId");
   

   const result = await prisma.frame.findUnique({
     where: { frameId: frameId },
     include: {
       chatMessages: true,
     },
   });
   return NextResponse.json(result, {status:200});
 } catch (error) {
   return NextResponse.json({ error: "internal error" }, { status: 500 });
 }
}
