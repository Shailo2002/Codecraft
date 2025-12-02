"use client";
import { useEffect, useRef, useState } from "react";
import PlayGroundHeader from "../_components/PlayGroundHeader";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
import ElementSettingSection from "../_components/ElementSettingSection";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

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

const Prompt = `userInput: {userInput}
Instructions:
1. If the user input is explicitly asking to generate
   code, design, or HTML/CSS/JS output (e.g., "Create a
   landing page", "Build a dashboard", "Generate HTML
   Tailwind CSS code"), then:

   - Generate a complete HTML Tailwind CSS code using
     Flowbite UI components.
   - Use a modern design with **blue as the primary
     color theme**.
   - Only include the <body> content (do not add
     <head> or <title>).
   - Make it fully responsive for all screen sizes.
   - All primary components must match the theme
     color.
   - Add proper padding and margin for each element.
   - Components should be independent; do not connect
     them.
   - Use placeholders for all images:
     - Light mode:
       httpsa://community.softr.io/uploads/db9110/original/2X/
       7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg
     - Dark mode: https://www.cibaky.com/wp-
       content/uploads/2015/12/placeholder-3.jpg
     - Add alt tag describing the image prompt.
   - Use the following libraries/components where
     appropriate:
     - FontAwesome icons (fa fa-)
     - Flowbite UI components: buttons, modals,
       forms, tables, tabs, alerts, cards, dialogs,
       dropdowns, accordions, etc.
     - Chart.js for charts & graphs
     - Swiper.js for sliders/carousels
     - Tippy.js for tooltips & popovers
   - Include interactive components like modals,
     dropdowns, and accordions.
   - Ensure proper spacing, alignment, hierarchy, and
     theme consistency.
   - Ensure charts are visually appealing and match
     the theme color.
   - Header menu options should be spread out and not
     connected.
   - Do not include broken links.
   - Do not add any extra text before or after the
     HTML code.

2. If the user input is **general text or greetings**
   (e.g., "Hi", "Hello", "How are you?") **or does not
   explicitly ask to generate code**, then:

   - Respond with a simple, friendly text message
     instead of generating any code.

Example:
- User: "Hi" -> Response: "Hello! How can I help you
  today?"
- User: "Build a responsive landing page with Tailwind
  CSS" -> Response: [Generate full HTML code as per
  instructions above]`;

function page() {
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get("frameId");
  const [frameDetail, setFrameDetail] = useState<Frame>();
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [generatedCode, setGeneratedCode] = useState<any>("");
  const generatedCodeRef = useRef("");

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
    if (result.data?.chatMessages?.length == 1) {
      const userMessage = result.data?.chatMessages[0].chatMessage[0]?.content;
      SendMessage(userMessage);
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

  const saveGeneratedCode = async () => {
    try {
      await axios.put(`/api/frames/`, {
        frameId,
        designCode: generatedCodeRef.current
          .replace(/html/g, "")
          .replace(/```/g, ""),
      });
      toast.success("Website is Ready!");
    } catch (error) {
      toast.error("error while generating Website!");
      console.error("Failed to save message:", error);
    }
  };

  // chatgpt stream true code
  const SendMessage = async (userInput: string) => {
    setLoading(true);
    setGeneratedCode("");

    const userMsgObj = { role: "user", content: userInput };

    setMessages((prev: any) => [...prev, { chatMessage: [userMsgObj] }]);

    saveMsgToDb(userMsgObj);

    const res = await fetch("/api/ai-model-openai", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          { role: "user", content: Prompt.replace("{userInput}", userInput) },
        ],
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

  useEffect(() => {
    console.log("generatedCode check : ", generatedCode);
  }, [generatedCode]);

  return (
    <div>
      <PlayGroundHeader />

      <div className="flex">
        {/* chatSection */}
        <ChatSection
          messages={messages ?? []}
          onSend={(input: string) => SendMessage(input)}
          loading={loading}
        />

        {/* websiteDesign */}
        <WebsiteDesign
          generatedCode={generatedCode.replace(/html/g, "").replace(/```/g, "")}
        />

        {/* Element seting section */}
        {/* <ElementSettingSection /> */}
      </div>
    </div>
  );
}

export default page;
