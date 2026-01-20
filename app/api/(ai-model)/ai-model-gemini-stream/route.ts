import { geminiPrompt, testingPrompt } from "@/app/constants/prompt";
import { templateHtml } from "@/app/constants/templateHtml";
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { prompt, modelName, generatedCode, messages } = await req.json();

    const userDetail = await currentUser();

    if (!userDetail) {
      return NextResponse.json(
        {
          message: "Authentication required",
        },
        { status: 401 },
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
        { status: 404 },
      );
    }

    let modelCheck = modelName;

    if (dbUser.plan !== "PREMIUM") {
      if (modelName !== "gemini-2.5-flash") {
        modelCheck = "gemini-2.5-flash";
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response("API Key not found", { status: 500 });
    }

    const codeContext = (generatedCode || generatedCode === templateHtml)
      ? `\n\nHere is the current code context the user is working on:\n\`\`\`\n${generatedCode}\n\`\`\``
      : "";

    const finalSystemInstruction = `${testingPrompt}${codeContext}`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelCheck || "gemini-2.5-flash",
      systemInstruction: finalSystemInstruction,
    });

    const chatHistory = (messages || []).map((msg: any) => ({
      role: msg.chatMessage[0]?.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.chatMessage[0]?.content || "" }],
    }));

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await model.generateContentStream(prompt);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText));
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
