"use client";
import { useEffect, useRef, useState } from "react";
import PlayGroundHeader from "../_components/PlayGroundHeader";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
import toast from "react-hot-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Frame, Message, UserType } from "@/types";
import saveFrameCode from "@/app/actions/saveFrameCode";
import { createChatMessage } from "@/app/actions/createChatMessage";
import {
  loadingTemplateHtml,
  templateHtml,
} from "@/app/constants/templateHtml";
import { useUpgradeModal } from "@/hooks/useUpgradeModal";

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
  const [model, setModel] = useState<string>("gemini-2.5-flash");
  const [isChat, setIsChat] = useState<Boolean>(false);
  const isMobile = useIsMobile();
  const upgrade = useUpgradeModal();

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
        designCode: clone.innerHTML.replace(/```/g, ""),
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
      return response;
    } catch (error) {
      console.error("Failed to save message:", error);
      toast.error("error while saving chat message");
    }
  };

  const saveGeneratedCode = async () => {
    const tempCode = generatedCodeRef.current;
    try {
      if (!tempCode || tempCode.trim().length === 0) {
        toast("Text only — no code generated.", { icon: "⚠️" });
        return;
      } else {
        await saveFrameCode({
          frameId,
          designCode: tempCode.replace(/```/g, ""),
        });
        toast.success("Website is Ready!");
      }
    } catch (error) {
      toast.error("error while generating Website!");
      console.error("Failed to save message:", error);
    }
  };

  const handleGpt = async (userInput: string, model: string) => {
    try {
      setLoading(true);
      const tempCode = generatedCode.includes(templateHtml)
        ? ""
        : generatedCode;
      setGeneratedCode("");

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
          generatedCode: tempCode,
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
                const afterFence = aiResponse.slice(startIdx + 8);
                const textBefore = aiResponse
                  .slice(0, startIdx)
                  .replace(/^AI\s*:\s*/i, "");

                console.log("afterFence : ", afterFence);
                console.log("beforeFence : ", textBefore);

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

      if (!codeBuffer || codeBuffer.trim() == "") {
        console.log("no code generated");
        setGeneratedCode(initialFrame?.designCode);
      }
      await saveGeneratedCode();
    } catch (error) {
      console.log("error while building website");
    } finally {
      setLoading(false);
    }
  };

  const handleGptNonStream = async (userInput: string, model: string) => {
    try {
      setLoading(true);
      const tempCode = generatedCode.includes(templateHtml)
        ? ""
        : generatedCode;
      setGeneratedCode(loadingTemplateHtml);

      const res = await fetch("/api/ai-model-testing-gpt", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user", content: userInput }],
          modelName: model,
          generatedCode: tempCode,
        }),
      });

      const data = await res.json();
      const fullContent = data.choices?.[0]?.message?.content || "";

      console.log("OpenAI response:", fullContent);

      let aiResponse = "";
      let codeBuffer = "";

      const startIdx = fullContent.indexOf("AICODE :");

      if (startIdx !== -1) {
        aiResponse = fullContent
          .slice(0, startIdx)
          .replace(/^AI\s*:\s*/i, "")
          .trim();
        codeBuffer = fullContent.slice(startIdx + 8);

        setGeneratedCode(codeBuffer);
        generatedCodeRef.current = codeBuffer;
      } else {
        aiResponse = fullContent;
      }

      const finalMsg = aiResponse || "Your code is ready!";
      if (finalMsg.trim() !== "") {
        setLoading(false);
      }

      setMessages((prev: any) => [
        ...prev,
        { chatMessage: [{ role: "assistant", content: finalMsg }] },
      ]);

      await saveMsgToDb({ role: "assistant", content: finalMsg });

      if (!codeBuffer || codeBuffer.trim() === "") {
        setGeneratedCode(initialFrame?.designCode);
      }

      await saveGeneratedCode();
    } catch (error) {
      console.error("error while building website", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStreamGemini = async (userInput: string, model: string) => {
    if (!userInput) return;
    setLoading(true);
    const tempCode = generatedCode.includes(templateHtml) ? "" : generatedCode;
    setGeneratedCode("");

    try {
      const res = await fetch("/api/ai-model-gemini-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userInput,
          modelName: model,
          generatedCode: tempCode,
          messages,
        }),
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
          if (!inCode) {
            console.log("chunkValue : ", chunkValue);
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

      if (!codeBuffer || codeBuffer.trim() == "") {
        console.log("no code generated");
        setGeneratedCode(initialFrame?.designCode);
      }
      await saveGeneratedCode();
    } catch (error) {
      console.error("Gemini Stream Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGeminiNonStream = async (userInput: string, model: string) => {
    if (!userInput) return;
    setLoading(true);
    const tempCode = generatedCode.includes(templateHtml) ? "" : generatedCode;
    setGeneratedCode(loadingTemplateHtml);

    try {
      const res = await fetch("/api/ai-model-testing-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userInput,
          modelName: model,
          generatedCode: tempCode,
          messages,
        }),
      });

      const data = await res.json();
      console.log("Gemini full response:", data);
      const fullText = data.text || "";

      console.log("Gemini response:", fullText);
      let aiResponse = "";
      let codeBuffer = "";

      const startIdx = fullText.indexOf("AICODE :");
      if (startIdx !== -1) {
        aiResponse = fullText
          .slice(0, startIdx)
          .replace(/^AI\s*:\s*/i, "")
          .trim();
        codeBuffer = fullText.slice(startIdx + 8);

        setGeneratedCode(codeBuffer);
        generatedCodeRef.current = codeBuffer;
      } else {
        aiResponse = fullText.replace(/^AI\s*:\s*/i, "").trim();
      }

      const finalMsg = aiResponse || "Your code is ready!";

      if (finalMsg.trim() !== "") {
        setLoading(false);
      }
      console.log("loading after response : ", loading);

      setMessages((prev: any) => [
        ...prev,
        { chatMessage: [{ role: "assistant", content: finalMsg }] },
      ]);

      await saveMsgToDb({ role: "assistant", content: finalMsg });

      if (!codeBuffer || codeBuffer.trim() === "") {
        setGeneratedCode(initialFrame?.designCode);
      }
      await saveGeneratedCode();
    } catch (error) {
      console.error("Gemini Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const SendMessage = async (userInput: string, model: string) => {
    setLoading(true);
    try {
      if (frameDetail?.chatMessages?.length !== 1) {
        const userMsgObj = { role: "user", content: userInput };
        const response:
          | { ok: boolean; message?: string; error?: string }
          | undefined = await saveMsgToDb(userMsgObj);

        if (!response?.ok) {
          setLoading(false);
          toast.error(
            response?.error ||
              "Chat limit reached. Upgrade to Premium to continue.",
          );
          upgrade?.show();
          console.log(response?.error);
          return response?.error;
        } else {
          setMessages((prev: any) => [...prev, { chatMessage: [userMsgObj] }]);

          toast.success(response?.message || "chat saved");
        }
      }

      if (model.includes("gemini")) {
        await handleGeminiNonStream(userInput, model);
      } else {
        await handleGptNonStream(userInput, model);
      }
    } catch (error) {
      console.log("error while generating website");
    } finally {
      setLoading(false);
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
        code={(generatedCode ?? "").replace(/```/g, "")}
        projectName={projectId}
        projectId={projectId}
        user={user}
      />

      <div className="flex justify-center dark:bg-transparent gap-4 px-2">
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
            generatedCode={(generatedCode ?? "").replace(/```/g, "")}
            handleIsChat={handleIsChat}
            isPremium={user?.plan === "PREMIUM"}
            loading={loading}
          />
        )}
      </div>

      {upgrade?.modal}
    </div>
  );
}

export default ClientPlayground;
