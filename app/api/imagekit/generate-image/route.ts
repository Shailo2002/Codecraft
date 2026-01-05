import OpenAI from "openai";
import { NextResponse } from "next/server";
import { imagekit } from "@/lib/imagekit";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // ⚡️ USING DALL-E-2 (Fastest / Lightest)
    const response = await client.images.generate({
      model: "dall-e-2",
      prompt: prompt,
      n: 1,
      size: "512x512",
      response_format: "b64_json",
    });


    if (!response || !response.data) {
      return NextResponse.json(
        { error: "Image Generation Failed" },
        { status: 400 }
      );
    }

    const imageJson = response.data[0].b64_json;
    if (!imageJson) throw new Error("No image data received");

    const uploadResponse = await imagekit.upload({
      file: imageJson,
      fileName: `generated-${Date.now()}.png`,
      folder: "/Codecraft/ai-generated",
    });

    return NextResponse.json({
      url: uploadResponse?.url,
      thumbnail: uploadResponse?.thumbnailUrl,
      fileId: uploadResponse?.fileId,
      width: uploadResponse?.width,
      height: uploadResponse?.height,
    });
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed" },
      { status: 500 }
    );
  }
}
