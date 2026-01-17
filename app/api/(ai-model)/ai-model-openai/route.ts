import { gptPrompt } from "@/app/constants/prompt";
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, modelName } = await req.json();

    const userDetail = await currentUser();

    if (!userDetail) {
      return NextResponse.json(
        {
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        email: userDetail.primaryEmailAddress?.emailAddress,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    let modelCheck = modelName;

    if (dbUser.plan !== "PREMIUM") {
      if (modelName !== "gpt-4o-mini") {
        modelCheck = "gpt-4o-mini";
      }
    }

    const completion = await openai.chat.completions.create({
      model: modelCheck || "gpt-4o-mini",
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
