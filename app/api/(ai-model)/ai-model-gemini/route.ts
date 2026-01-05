// app/api/generate-code/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt,modelName } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Using gemini-1.5-pro for better code quality
    const model = genAI.getGenerativeModel({
      model:"gemini-2.5-flash",
      systemInstruction: `
        You are an AI website builder. Analyze the user input and follow these strict rules:

        1. If the user input is explicitly asking to generate code, design, or HTML/CSS/JS output (e.g., "Create a landing page", "Build a dashboard"), then:
           - Generate a complete HTML Tailwind CSS code using Flowbite UI components.
           - Use a modern design with **blue as the primary color theme**.
           - Only include the <body> content (do not add <head>, <html> or <title> tags).
           - Make it fully responsive for all screen sizes.
           - All primary components must match the theme color.
           - Components should be independent; do not connect them.
           - Use placeholders for images:
             * Light mode: https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg
             * Dark mode: https://www.cibaky.com/wp-content/uploads/2015/12/placeholder-3.jpg
           - Use FontAwesome (fa fa-), Flowbite UI components, Chart.js, Swiper.js, Tippy.js where appropriate.
           - Ensure charts are visually appealing and match the theme color.
           - Do NOT include markdown backticks (\`\`\`) or "html" labels. Just return the raw HTML code.
           - Do not add any extra text before or after the HTML code.

        2. If the user input is general text or greetings (e.g., "Hi", "Hello") or does not ask for code:
           - Respond with a simple, friendly text message. Do not generate code.
      `,
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = response.text();

    return NextResponse.json({ output });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate code" },
      { status: 500 }
    );
  }
}
