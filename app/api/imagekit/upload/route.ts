import { imagekit } from "@/lib/imagekit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const response = await imagekit.upload({
      file: buffer,
      fileName: file.name,
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
