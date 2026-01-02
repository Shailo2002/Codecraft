"use client";
import { useEffect, useRef, useState } from "react";
import PlayGroundHeader from "../_components/PlayGroundHeader";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Prompt } from "@/app/constants/prompt";

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
  const generatedCodeRef = useRef("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [codeSaveLoading, setCodeSaveLoading] = useState<Boolean>(false);
  const [model, setModel] = useState<string>("gpt-4o-mini");

  const getIframeHTML = async () => {
    setCodeSaveLoading(true);
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return "";

      const clone = doc.body.cloneNode(true) as HTMLElement;

      clone.querySelectorAll("*").forEach((el) => {
        const element = el as HTMLElement;

        // remove highlight
        element.style.outline = "";

        // remove empty style attribute
        if (element.getAttribute("style") === "") {
          element.removeAttribute("style");
        }

        // remove contenteditable
        if (element.getAttribute("contenteditable")) {
          element.removeAttribute("contenteditable");
        }
      });

      if (!clone.innerHTML) return;

      await axios.put(`/api/frames/`, {
        frameId,
        designCode: clone.innerHTML.replace(/html/g, "").replace(/```/g, ""),
      });
      toast.success("Code Saved!");
    } catch (error) {
      toast.error("error while saving code!");
      console.error("Failed to save message:", error);
    } finally {
      setCodeSaveLoading(false);
    }
  };

  useEffect(() => {
    frameId && GetFrameDetails();
  }, [frameId]);

  const GetFrameDetails = async () => {
    const result = await axios.get(
      `/api/frames?frameId=${frameId}&projectId=${projectId}`
    );

    setFrameDetail(result?.data);
    setMessages(result?.data?.chatMessages);
    setGeneratedCode(result?.data?.designCode);
    console.log("chatMessage : ", result?.data?.chatMessages?.length);
    if (result.data?.chatMessages?.length == 1) {
      const userMessage = result.data?.chatMessages[0].chatMessage[0]?.content;
      SendMessage(userMessage, model);
    }
  };

  const saveMsgToDb = async (msg: Message) => {
    try {
      await axios.post(`/api/chats/${frameId}`, {
        chatMessage: [msg],
      });
    } catch (error) {
      console.error("Failed to save message:", error);
    }
  };

  const saveGeneratedCode = async (code?: string) => {
    const tempCode = code || generatedCodeRef.current;
    try {
      console.log("saveGeneratedCode : ", generatedCodeRef.current);
      await axios.put(`/api/frames/`, {
        frameId,
        designCode: tempCode.replace(/html/g, "").replace(/```/g, ""),
      });
      toast.success("Website is Ready!");
    } catch (error) {
      toast.error("error while generating Website!");
      console.error("Failed to save message:", error);
    }
  };

  // chatgpt stream true code
  const handleGpt = async (userInput: string, model: string) => {
    setLoading(true);
    setGeneratedCode("");

    if (messages.length !== 1) {
      const userMsgObj = { role: "user", content: userInput };

      setMessages((prev: any) => [...prev, { chatMessage: [userMsgObj] }]);

      saveMsgToDb(userMsgObj);
    }

    const res = await fetch("/api/ai-model-openai", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          { role: "user", content: Prompt?.replace("{userInput}", userInput) },
        ],
        modelName: model,
      }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let aiResponse = "";
    let codeBuffer = "";
    let inCode = false;

    while (true) {
      // @ts-ignore
      const { done, value } = await reader?.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      for (let i = 0; i < lines.length - 1; i++) {
        let line = lines[i].trim();
        if (!line) continue;

        if (line.startsWith("data:")) {
          line = line.replace(/^data:\s*/, "");
        }

        if (line === "[DONE]") continue;

        try {
          const json = JSON.parse(line);
          const delta = json.choices?.[0]?.delta?.content || "";
          console.log("delta : ", delta);
          if (!delta) continue;

          if (!inCode) {
            aiResponse += delta;

            const startIdx = aiResponse.indexOf("```");
            if (startIdx !== -1) {
              const afterFence = aiResponse.slice(startIdx + 3);
              const textBefore = aiResponse.slice(0, startIdx);

              if (textBefore.trim()) {
                setMessages((prev: any) => [
                  ...prev,
                  { chatMessage: [{ role: "assistant", content: textBefore }] },
                ]);
              }

              inCode = true;
              codeBuffer = afterFence;
              aiResponse = "";
              setGeneratedCode((prev: any) => {
                const newVal = prev + afterFence;
                generatedCodeRef.current = newVal;
                return newVal;
              });
            }
          } else {
            codeBuffer += delta;
            setGeneratedCode((prev: any) => {
              const newVal = prev + delta;
              generatedCodeRef.current = newVal;
              return newVal;
            });

            const endIdx = codeBuffer.indexOf("```");
            if (endIdx !== -1) {
              const codePart = codeBuffer.slice(0, endIdx);
              const afterFence = codeBuffer.slice(endIdx + 3);

              inCode = false;
              codeBuffer = "";

              if (afterFence.trim()) {
                setMessages((prev: any) => [
                  ...prev,
                  { chatMessage: [{ role: "assistant", content: afterFence }] },
                ]);
              } else {
              }
            }
          }
        } catch (err) {
          console.error("JSON parse error:", err, line);
        }
      }

      buffer = lines[lines.length - 1];
    }

    if (buffer.trim()) {
      let line = buffer.trim();
      if (line.startsWith("data:")) line = line.replace(/^data:\s*/, "");
      if (line !== "[DONE]") {
        try {
          const json = JSON.parse(line);
          const delta = json.choices?.[0]?.delta?.content || "";
          if (!inCode) {
            aiResponse += delta;
          } else {
            codeBuffer += delta;
            setGeneratedCode((prev: any) => {
              const newVal = prev + delta;
              generatedCodeRef.current = newVal;
              return newVal;
            });
          }
        } catch (err) {
          console.error("Final JSON parse error:", err, line);
        }
      }
    }

    if (!inCode && aiResponse.trim()) {
      setMessages((prev: any) => [
        ...prev,
        { chatMessage: [{ role: "assistant", content: aiResponse.trim() }] },
      ]);

      await saveMsgToDb({ role: "assistant", content: aiResponse.trim() });
    } else if (inCode) {
      setMessages((prev: any) => [
        ...prev,
        {
          chatMessage: [{ role: "assistant", content: "Your code is ready!" }],
        },
      ]);
      await saveMsgToDb({
        role: "assistant",
        content: "Your code is ready!",
      });
    } else {
      setMessages((prev: any) => [
        ...prev,
        {
          chatMessage: [{ role: "assistant", content: "Your code is ready!" }],
        },
      ]);
      await saveMsgToDb({
        role: "assistant",
        content: "Your code is ready!",
      });
    }

    await saveGeneratedCode();
    setLoading(false);
  };

  const handleStreamGemini = async (userInput: string, model: string) => {
    if (!userInput) return;
    setLoading(true);
    setGeneratedCode("");

    const userMsgObj = { role: "user", content: userInput };
    setMessages((prev: any) => [...prev, { chatMessage: [userMsgObj] }]);
    saveMsgToDb(userMsgObj);

    try {
      // 1. Use fetch instead of axios to get the stream reader

      const res = await fetch("/api/ai-model-gemini-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userInput, modelName: model }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let aiResponse = "";

      // Variable to track if we are currently "inside" a code block (if Gemini sends markdown)
      // Note: In our system prompt, we told Gemini NOT to send markdown,
      // but it's good safety to keep this logic if you change prompts later.
      let inCode = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          // 2. Decode raw text (No JSON parsing needed!)
          const chunkValue = decoder.decode(value, { stream: true });

          // Logic to handle "Text" vs "Code" if Gemini mixes them
          // (Simplified version of your GPT logic)
          if (!inCode) {
            // Check if this chunk starts a code block
            if (chunkValue.includes("```")) {
              inCode = true;
              // If there was text before the ```, add it to chat
              // (This is a basic check; robust parsing requires more buffer logic like your GPT code
              // but for the specific "Code Only" prompt we set, this is usually sufficient)
            } else {
              // If it's just conversational text (like "Hello")
              // For now, let's assume if it looks like HTML tags, it is code
              if (chunkValue.trim().startsWith("<") || inCode) {
                inCode = true;
                setGeneratedCode((prev: any) => {
                  const newVal = prev + chunkValue;
                  generatedCodeRef.current = newVal;
                  return newVal;
                });
              } else {
                // Regular chat message
                // Note: Handling streaming chat text updates requires a state update
                // logic similar to your GPT 'aiResponse' buffer if you want the text to type out.
              }
            }
          }

          // If we are definitely in code mode (or simply appending raw output)
          // Since our prompt strictly asked for HTML code only, we can mostly just do this:
          setGeneratedCode((prev: any) => {
            const newVal = prev + chunkValue;
            generatedCodeRef.current = newVal;
            return newVal;
          });
        }
      }

      // Final save
      await saveMsgToDb({
        role: "assistant",
        content: "Your code is ready!",
      });
      await saveGeneratedCode(generatedCodeRef.current);
    } catch (error) {
      console.error("Gemini Stream Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const SendMessage = async (userInput: string, model: string) => {
    if (model.includes("gemini")) {
      console.log("gemini : ", model, userInput);
      await handleStreamGemini(userInput, model);
    } else {
      console.log("gpt : ", model, userInput);

      await handleGpt(userInput, model);
    }
  };

  return (
    <div>
      <PlayGroundHeader
        onSave={getIframeHTML}
        loading={codeSaveLoading}
        code={(generatedCode ?? "")
          .replace(/```/g, "")
          .replace(/(?<!<)html(?![>/])/g, "")}
        projectName={projectId}
      />

      <div className="flex">
        {/* chatSection */}
        <ChatSection
          messages={messages ?? []}
          onSend={(input: string, model: string) => SendMessage(input, model)}
          loading={loading}
        />

        {/* websiteDesign */}
        <WebsiteDesign
          iframeRef={iframeRef}
          generatedCode={(generatedCode ?? "")
            .replace(/```/g, "")
            .replace(/(?<!<)html(?![>/])/g, "")}
        />
      </div>
    </div>
  );
}

export default page;
