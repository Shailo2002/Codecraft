import React, { useEffect, useRef, useState } from "react";
import { Messages } from "../[projectId]/page";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  messages: Messages[];
  onSend: any;
  loading: boolean;
};

function ChatSection({ messages, onSend, loading }: Props) {
  const [input, setInput] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input?.trim()) return;
    onSend(input);
    setInput("");
  };

  useEffect(() => {
    if (!bottomRef.current) return;

    // small delay so DOM/layout is ready
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 0);
  }, [messages]);

  return (
    <div className="flex flex-col w-120 shadow h-[91.25vh]  p-2">
      {/* Message Section */}
      <ScrollArea className="flex-1 flex flex-col overflow-y-auto rounded-md border bg-white">
        <div className="  p-4 space-y-4 ">
          {messages?.length === 0 ? (
            <p className="text-gray-400 text-center">No Messages Yet</p>
          ) : (
            messages?.map((msg, index) => (
              <div
                className={`flex ${
                  msg?.chatMessage[0]?.role == "user"
                    ? "justify-end"
                    : "justify-start"
                } `}
                key={index}
              >
                <div
                  className={`p-2 rounded-lg max-w-[80%] ${
                    msg?.chatMessage[0]?.role == "user"
                      ? "bg-gray-100 text-black"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {msg?.chatMessage[0]?.content}
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Footer Section */}
      <div className="relative flex border rounded-md items-end mt-2 bg-white">
        <textarea
          className="w-full h-32 p-2 resize-none overflow-y-auto focus:outline-none"
          placeholder="Describe your page design"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <div className="absolute right-14 bottom-1.5">
          {" "}
          <select name="model" id="model">
            <option value="gpt-4o-mini">gpt-4o-mini</option>
            <option value="gpt-4o-mini">gpt-4o-mini</option>
          </select>
        </div>

        <Button className="m-2 absolute right-1 bottom-0" onClick={handleSend}>
          {loading ? <Spinner /> : <ArrowUp />}
        </Button>
      </div>
    </div>
  );
}

export default ChatSection;
