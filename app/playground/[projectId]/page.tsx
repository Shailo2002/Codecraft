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

  useEffect(() => {
    GetFrameDetails();
  }, [frameId]);

  const GetFrameDetails = async () => {
    const result = await axios.get(
      `/api/frames?frameId=${frameId}&projectId=${projectId}`
    );
    setFrameDetail(result?.data);
    if (result.data?.chatMessages[0].chatMessage?.length == 1) {
      const userMessage = result.data?.chatMessages[0].chatMessage[0]?.content;
      SendMessage(userMessage);
    }
  };

  

  // chatgpt stream true code
  const SendMessage = async (userInput: string) => {
    setLoading(true);

    setMessages((prev: any) => [
      ...prev,
      { chatMessage: [{ role: "user", content: userInput }] },
    ]);

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

    let buffer = ""; // holds partial chunk text between reads
    let aiResponse = ""; // accumulated plain text (before a code fence)
    let codeBuffer = ""; // accumulating code while inside a fence
    let inCode = false;

    while (true) {
      // @ts-ignore
      const { done, value } = await reader?.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // split into lines, keep last partial line in buffer
      const lines = buffer.split("\n");
      for (let i = 0; i < lines.length - 1; i++) {
        let line = lines[i].trim();
        if (!line) continue;

        // If server sent SSE style, remove "data:" prefix
        if (line.startsWith("data:")) {
          line = line.replace(/^data:\s*/, "");
        }

        // Some servers may send "[DONE]" as raw line
        if (line === "[DONE]") continue;

        // Try parse JSON — supports both NDJSON and SSE JSON payloads
        try {
          const json = JSON.parse(line);
          const delta = json.choices?.[0]?.delta?.content || "";

          if (!delta) continue;

          // If not inside code fence, append to aiResponse and check for fence start
          if (!inCode) {
            aiResponse += delta;

            // detect start of a code fence (``` or ```lang)
            const startIdx = aiResponse.indexOf("```");
            if (startIdx !== -1) {
              // everything after the fence start moves to codeBuffer
              const afterFence = aiResponse.slice(startIdx + 3);
              // keep text before fence as final assistant text chunk so far
              const textBefore = aiResponse.slice(0, startIdx);

              // push/flush the non-code text to messages state (incremental)
              if (textBefore.trim()) {
                setMessages((prev: any) => [
                  ...prev,
                  { chatMessage: [{ role: "assistant", content: textBefore }] },
                ]);
              }

              // start collecting code
              inCode = true;
              codeBuffer = afterFence;
              aiResponse = ""; // reset text accumulator
              // also update generated code state with initial chunk
              setGeneratedCode((prev: any) => prev + afterFence);
            }
          } else {
            // inside code fence: append to codeBuffer and generatedCode
            codeBuffer += delta;
            setGeneratedCode((prev: any) => prev + delta);

            // detect fence close
            const endIdx = codeBuffer.indexOf("```");
            if (endIdx !== -1) {
              // found closing fence — split code and any trailing text
              const codePart = codeBuffer.slice(0, endIdx);
              const afterFence = codeBuffer.slice(endIdx + 3);

              // make sure setGeneratedCode already has codePart (we've been appending it incrementally).
              // Now clear flags and move trailing text into aiResponse (and into messages)
              inCode = false;
              codeBuffer = "";

              if (afterFence.trim()) {
                // any trailing content after closing fence becomes assistant text
                setMessages((prev: any) => [
                  ...prev,
                  { chatMessage: [{ role: "assistant", content: afterFence }] },
                ]);
              } else {
                // if nothing else, let the loop continue; final message may be set after stream ends
              }
            }
          }
        } catch (err) {
          // If JSON.parse fails, ignore this line for now (it might be partial) — parser will try again
          console.error("JSON parse error:", err, line);
        }
      }

      // keep only the last partial line in buffer for next read
      buffer = lines[lines.length - 1];
    }

    // Stream ended. If we have leftover buffer (a final json line) try parse it
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
            setGeneratedCode((prev: any) => prev + delta);
          }
        } catch (err) {
          console.error("Final JSON parse error:", err, line);
        }
      }
    }

    // Finalize: if still collecting code, we already appended it to setGeneratedCode as it arrived.
    if (!inCode && aiResponse.trim()) {
      setMessages((prev: any) => [
        ...prev,
        { chatMessage: [{ role: "assistant", content: aiResponse.trim() }] },
      ]);
    } else if (inCode) {
      // stream ended while still inside a fence — treat collected code as final
      setMessages((prev: any) => [
        ...prev,
        {
          chatMessage: [{ role: "assistant", content: "Your code is ready!" }],
        },
      ]);
    } else {
      // no content
      setMessages((prev: any) => [
        ...prev,
        {
          chatMessage: [{ role: "assistant", content: "Your code is ready!" }],
        },
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log("messages : ", messages);
    console.log("generated code : ", generatedCode);
  }, [generatedCode, messages]);

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
        <WebsiteDesign />

        {/* Element seting section */}
        <ElementSettingSection />
      </div>
    </div>
  );
}

export default page;
