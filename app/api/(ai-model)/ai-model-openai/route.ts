import { gptPrompt } from "@/app/constants/prompt";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, modelName } = await req.json();
    console.log("openai route check ", modelName);

    const completion = await openai.chat.completions.create({
      model: modelName || "gpt-4o-mini",
      messages: [{ role: "system", content: gptPrompt }, ...messages],
      stream: true,
    });

    const stream = completion?.toReadableStream();

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } catch (err) {
    console.error("OpenAI error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
