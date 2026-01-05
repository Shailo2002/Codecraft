import { imagekit } from "@/lib/imagekit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("check ai-upload route");
    const { url } = await req.json();

    const response = await imagekit.upload({
      file: url,
      fileName: "saved_ai_image.jpg",
      tags: ["ai-generated"],
      folder: "/Codecraft/images",
    });
    return NextResponse.json({
      url: response.url,
      thumbnail: response.thumbnailUrl,
      fileId: response.fileId,
      width: response.width,
      height: response.height,
    });
  } catch (error) {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
