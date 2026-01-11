"use server";
import prisma from "@/lib/db";

export async function saveFrameCode({
  frameId,
  designCode,
}: {
  frameId: string;
  designCode: string;
}) {
  try {
    if (!designCode || designCode.trim().length === 0) {
      return { ok: false, error: "no designCode" };
    }
    if (!frameId) {
      return { ok: false, error: "frameId required" };
    }
    const result = await prisma.frame.update({
      where: { frameId: frameId ?? "" },
      data: {
        designCode,
      },
    });
    return { ok: true };
  } catch (error) {
    return { ok: false , message:"internal server error"};
  }
}

export default saveFrameCode;
