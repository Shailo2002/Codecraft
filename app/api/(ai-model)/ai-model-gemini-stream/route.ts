import { GoogleGenerativeAI } from "@google/generative-ai";

// Force Next.js to not cache this route (essential for streaming)
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { prompt, modelName } = await req.json();
console.log("gemini-stream route : ",prompt, modelName)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response("API Key not found", { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName || "gemini-2.5-flash",
      systemInstruction: `
         You are an AI website builder.
        1. If the user asks for code/design:
           - Return ONLY raw HTML code with Tailwind classes.
           - Do NOT wrap in markdown \`\`\` code blocks.
           - Do NOT add explanations.
           - Do NOT add <head> or <html> tags, just the body content.
        2. If the user says "Hi" or general chat:
           - Reply with simple text.
      `,
    });

    // 4. Start the Stream
    const result = await model.generateContentStream(prompt);

    // 5. Create a readable stream to pipe data to your frontend
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            // Send the raw text chunk directly to your frontend reader
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

    // 6. Return the stream
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
