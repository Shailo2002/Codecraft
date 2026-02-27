import { geminiPrompt, testingPrompt } from "@/app/constants/prompt";
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Force Next.js to not cache this route (essential for streaming)
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { prompt, modelName, generatedCode, messages } = await req.json();
    const userDetail = await currentUser();

    if (!userDetail)
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );

    const dbUser = await prisma.user.findUnique({
      where: { email: userDetail.primaryEmailAddress?.emailAddress },
    });

    if (!dbUser)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    let modelCheck = dbUser.plan !== "PREMIUM" ? "gemini-2.5-flash" : modelName;

    const codeContext = generatedCode
      ? `\n\nCode context:\n\`\`\`\n${generatedCode}\n\`\`\``
      : "";
    const finalSystemInstruction = `${testingPrompt}${codeContext}`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: modelCheck || "gemini-2.5-flash",
      systemInstruction: finalSystemInstruction,
    });

    const chatHistory = (messages || []).map((msg: any) => ({
      role: msg.chatMessage[0]?.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.chatMessage[0]?.content || "" }],
    }));

    const chat = model.startChat({ history: chatHistory });

    // Switch to non-stream method
    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
