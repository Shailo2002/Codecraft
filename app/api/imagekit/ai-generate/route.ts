// app/api/generate-image/route.ts
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Parse the prompt from the frontend request body
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // 2. Initialize Gemini Client
    // Make sure GEMINI_API_KEY is set in your .env.local file
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 3. Call the API
    // Note: We use 'responseModalities' to ensure we get an image
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
      config: {
        responseModalities: ["IMAGE"],
      },
    });

    // 4. Extract the Image Data
    // We look for the part that contains 'inlineData'
    const candidate = response.candidates?.[0];
    const imagePart = candidate?.content?.parts?.find(
      (part) => part.inlineData
    );

    if (!imagePart || !imagePart.inlineData) {
      throw new Error("No image data found in response");
    }

    const { mimeType, data } = imagePart.inlineData;

    // 5. Return the Base64 string to the frontend
    // We format it as a Data URL so the <img> tag can read it directly
    const base64Image = `data:${mimeType};base64,${data}`;

    return NextResponse.json({ image: base64Image });
  } catch (error) {
    console.error("Image Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
