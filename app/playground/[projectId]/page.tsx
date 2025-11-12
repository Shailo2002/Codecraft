"use client";
import { useEffect, useState } from "react";
import PlayGroundHeader from "../_components/PlayGroundHeader";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
import ElementSettingSection from "../_components/ElementSettingSection";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";

export type Frame = {
  id: String;
  projectId: String;
  frameId: String;
  designCode: String;
  chatMessages: Messages[];
};
export type Messages = {
  id: String;
  chatMessage: Message[];
  userId: String;
  createdAt: Date;
  frameId: String;
};

export type Message = {
  role: String;
  content: String;
};

function page() {
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get("frameId");
  const [frameDetail, setFrameDetail] = useState<Frame>();
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [generatedCode, setGeneratedCode] = useState<any>("");

  useEffect(() => {
    GetFrameDetails();
  }, [frameId]);

  const GetFrameDetails = async () => {
    const result = await axios.get(
      `/api/frames?frameId=${frameId}&projectId=${projectId}`
    );
    setFrameDetail(result?.data);
  };

  // for stream:true
  const SendMessage = async (userInput: string) => {
    setLoading(true);

    setMessages((prev: any) => [
      ...prev,
      { chatMessage: [{ role: "user", content: userInput }] },
    ]);

    const result = await fetch("/api/ai-testing", {
      method: "POST",
      body: JSON.stringify({
        messages: [{ role: "user", content: userInput }],
      }),
    });

    const reader = result.body?.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let aiResponse = "";
    let isCode = false;

    while (true) {
      //@ts-ignore
      const { done, value } = await reader?.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Split by newlines — each event may have multiple lines
      const lines = buffer.split("\n");

      for (const line of lines) {
        // Only process "data:" lines
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            console.log("chunk : ", delta);

            if (delta) {
              aiResponse += delta;

              // detect code start
              if (!isCode && aiResponse.includes("```html")) {
                isCode = true;
                const index = aiResponse.indexOf("```html") + 7;
                const initialCodeChunk = aiResponse.slice(index);
                setGeneratedCode((prev: any) => prev + initialCodeChunk);
              } else if (isCode) {
                setGeneratedCode((prev: any) => prev + delta);
              }
            }
          } catch (err) {
            console.error("JSON parse error:", err, line);
          }
        }
      }

      // keep only last partial line in buffer
      buffer = lines[lines.length - 1];
    }

    // After stream ends
    if (!isCode) {
      setMessages((prev: any) => [
        ...prev,
        { chatMessage: [{ role: "assistant", content: aiResponse.trim() }] },
      ]);
    } else {
      setMessages((prev: any) => [
        ...prev,
        {
          chatMessage: [{ role: "assistant", content: "Your code is ready!" }],
        },
      ]);
    }

    setLoading(false);
  };

  // for stream:false
  // const SendMessage = async (userInput: string) => {
  //   setLoading(true);

  //   setMessages((prev: any) => [
  //     ...prev,
  //     { chatMessage: [{ role: "user", content: userInput }] },
  //   ]);

  //   const result = await fetch("/api/ai-testing", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       messages: [{ role: "user", content: userInput }],
  //     }),
  //   });

  //   const data = await result.json();
  //   const message = data.message?.content || "";

  //   // Extract HTML code if enclosed in ```html ... ```
  //   const htmlMatch = message.match(/```html([\s\S]*?)```/i);

  //   if (htmlMatch) {
  //     const htmlCode = htmlMatch[1].trim();
  //     const textOnly = message.replace(/```html[\s\S]*?```/i, "").trim();

  //     setGeneratedCode(htmlCode);
  //     setMessages((prev: any) => [
  //       ...prev,
  //       {
  //         chatMessage: [
  //           { role: "assistant", content: textOnly || "Your code is ready!" },
  //         ],
  //       },
  //     ]);
  //   } else {
  //     setMessages((prev: any) => [
  //       ...prev,
  //       { chatMessage: [{ role: "assistant", content: message }] },
  //     ]);
  //   }

  //   setLoading(false);
  // };

  console.log("messages : ", messages);
  console.log("generated code : ", generatedCode);

  return (
    <div>
      <PlayGroundHeader />

      <div className="flex">
        {/* chatSection */}
        <ChatSection
          messages={messages ?? []}
          onSend={(input: string) => SendMessage(input)}
        />

        {/* websiteDesign */}
        <WebsiteDesign />

        {/* Element seting section */}
        <ElementSettingSection />
      </div>
    </div>
  );
}

export default page;
