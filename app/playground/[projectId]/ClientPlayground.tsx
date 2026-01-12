"use client";
import { useEffect, useRef, useState } from "react";
import PlayGroundHeader from "../_components/PlayGroundHeader";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
import axios from "axios";
import toast from "react-hot-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Frame, Message, UserType } from "@/types";
import saveFrameCode from "@/app/actions/saveFrameCode";
import { createChatMessage } from "@/app/actions/createChatMessage";

function ClientPlayground({
  projectId,
  frameId,
  initialFrame,
  user,
}: {
  projectId: string;
  frameId: string;
  initialFrame: Frame;
  user: UserType;
}) {
  const [frameDetail, setFrameDetail] = useState(initialFrame);
  const [messages, setMessages] = useState(initialFrame.chatMessages);
  const [generatedCode, setGeneratedCode] = useState(initialFrame.designCode);
  const [loading, setLoading] = useState<boolean>(false);
  const generatedCodeRef = useRef("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [codeSaveLoading, setCodeSaveLoading] = useState<boolean>(false);
  const [model, setModel] = useState<string>("gpt-4o-mini");
  const [isChat, setIsChat] = useState<Boolean>(false);
  const isMobile = useIsMobile();

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

      if (!clone.innerHTML) {
        console.log("cloen innerhtml if");
        return;
      }

      if (!clone?.innerHTML || clone?.innerHTML?.trim().length === 0) {
        toast("Text only — no code present.", { icon: "⚠️" });
        return;
      }
      await saveFrameCode({
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

  const saveMsgToDb = async (msg: Message) => {
    try {
      const response = await createChatMessage({ frameId, chatMessage: [msg] });
    } catch (error) {
      console.error("Failed to save message:", error);
      toast.error("error while saving chat message");
    }
  };

  const saveGeneratedCode = async (code?: string) => {
    const tempCode = code || generatedCodeRef.current;
    try {
      if (!tempCode || tempCode.trim().length === 0) {
        toast("Text only — no code generated.", { icon: "⚠️" });
        return;
      }
      await saveFrameCode({
        frameId,
        designCode: tempCode.replace(/html/g, "").replace(/```/g, ""),
      });

      toast.success("Website is Ready!");
    } catch (error) {
      toast.error("error while generating Website!");
      console.error("Failed to save message:", error);
    }
  };

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
          {
            role: "user",
            content: userInput,
          },
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
          if (!delta) continue;
          if (!inCode) {
            aiResponse += delta;

            const startIdx = aiResponse.indexOf("AICODE :");
            if (startIdx !== -1) {
              const afterFence = aiResponse.slice(startIdx + 9);
              const textBefore = aiResponse
                .slice(0, startIdx)
                .replace(/^AI\s*:\s*/i, "");

              inCode = true;
              codeBuffer = afterFence;
              aiResponse = textBefore.trim();
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
          }
        } catch (err) {
          console.error("JSON parse error:", err, line);
        }
      }

      buffer = lines[lines.length - 1];
    }

    if (aiResponse.trim()) {
      setMessages((prev: any) => [
        ...prev,
        {
          chatMessage: [{ role: "assistant", content: aiResponse.trim() }],
        },
      ]);
      await saveMsgToDb({ role: "assistant", content: aiResponse.trim() });
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
      let inCode = false;
      let codeBuffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          const chunkValue = decoder.decode(value, { stream: true });
          console.log("chunkValue : ", chunkValue);
          if (!inCode) {
            aiResponse += chunkValue;
            const startIdx = aiResponse.indexOf("AICODE :");
            if (startIdx !== -1) {
              const afterFence = aiResponse.slice(startIdx + 9);
              const textBefore = aiResponse
                .slice(0, startIdx)
                .replace(/^AI\s*:\s*/i, "");

              inCode = true;
              codeBuffer = afterFence;
              aiResponse = textBefore.trim();

              if (afterFence && afterFence.trim()) {
                setGeneratedCode((prev: any) => {
                  const newVal = prev + afterFence;
                  generatedCodeRef.current = newVal;
                  return newVal;
                });
              }
            }
          } else {
            codeBuffer += chunkValue;
            if (chunkValue && chunkValue.trim()) {
              setGeneratedCode((prev: any) => {
                const newVal = prev + chunkValue;
                generatedCodeRef.current = newVal;
                return newVal;
              });
            }
          }
        }
      }

      console.log("aiResponse : ", aiResponse);
      console.log("generatedCode : ", codeBuffer);
      if (aiResponse.trim()) {
        setMessages((prev: any) => [
          ...prev,
          {
            chatMessage: [
              {
                role: "assistant",
                content: aiResponse.trim().replace(/^AI\s*:\s*/i, ""),
              },
            ],
          },
        ]);
        await saveMsgToDb({
          role: "assistant",
          content: aiResponse.trim().replace(/^AI\s*:\s*/i, ""),
        });
      } else {
        setMessages((prev: any) => [
          ...prev,
          {
            chatMessage: [
              { role: "assistant", content: "Your code is ready!" },
            ],
          },
        ]);
        await saveMsgToDb({
          role: "assistant",
          content: "Your code is ready!",
        });
      }
      if (codeBuffer && codeBuffer.trim()) {
        await saveGeneratedCode();
      }
    } catch (error) {
      console.error("Gemini Stream Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const SendMessage = async (userInput: string, model: string) => {
    if (model.includes("gemini")) {
      await handleStreamGemini(userInput, model);
    } else {
      await handleGpt(userInput, model);
    }
  };

  //use to make responsive ui
  const handleIsChat = (value: Boolean) => {
    setIsChat(value);
  };

  useEffect(() => {
    if (!frameId) return;

    if (frameDetail?.chatMessages?.length == 1) {
      //@ts-ignore
      const userMessage = frameDetail?.chatMessages[0].chatMessage[0]?.content;
      SendMessage(userMessage, model);
    }
  }, [frameId]);

  return (
    <div>
      <PlayGroundHeader
        onSave={getIframeHTML}
        loading={codeSaveLoading}
        code={(generatedCode ?? "")
          .replace(/```/g, "")
          .replace(/(?<!<)html(?![>/])/g, "")}
        projectName={projectId}
        projectId={projectId}
      />

      <div className="flex justify-center bg-zinc-50 p-4 gap-4">
        {/* chatSection */}

        {(isChat || !isMobile) && (
          <ChatSection
            messages={messages ?? []}
            user={user}
            onSend={(input: string, model: string) => SendMessage(input, model)}
            loading={loading}
            handleIsChat={handleIsChat}
          />
        )}

        {/* websiteDesign */}
        {(!isChat || !isMobile) && (
          <WebsiteDesign
            key="desktop-iframe"
            iframeRef={iframeRef}
            generatedCode={(generatedCode ?? "")
              .replace(/```/g, "")
              .replace(/(?<!<)html(?![>/])/g, "")}
            handleIsChat={handleIsChat}
            isPremium={user?.plan === "PREMIUM"}
          />
        )}
      </div>
    </div>
  );
}

export default ClientPlayground;
