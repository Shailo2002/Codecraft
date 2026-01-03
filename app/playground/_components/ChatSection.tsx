import { useEffect, useRef, useState } from "react";
import { Messages } from "../[projectId]/page";
import { Button } from "@/components/ui/button";
import { ArrowUp, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import SelectModel from "@/app/_components/SelectModel";

type Props = {
  messages: Messages[];
  onSend: any;
  loading: boolean;
  handleIsChat: (value: Boolean) => void;
};

function ChatSection({
  messages,
  onSend,
  loading,
  handleIsChat,
}: Props) {
  const [input, setInput] = useState<string>("");
  const [model, setModel] = useState<string>("gpt-4o-mini");
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input?.trim()) return;
    onSend(input, model);
    setInput("");
  };

  const handleSetModel = (value: string) => {
    setModel(value);
  };

  useEffect(() => {
    if (!bottomRef.current) return;

    // small delay so DOM/layout is ready
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 0);
  }, [messages]);

  return (
    <div className="flex flex-col w-120 h-[87vh]">
      {/* Message Section */}
      <ScrollArea className="flex-1 flex flex-col overflow-y-auto rounded-lg border bg-white">
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
      <div className="relative flex border rounded-lg items-end mt-2 bg-white">
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

        <div
          className="absolute left-3 bottom-3 bg-slate-200 hover:bg-slate-300 p-1 rounded flex justify-center items-center gap-1 text-sm cursor-pointer md:hidden"
          onClick={() => handleIsChat(false)}
        >
          <Eye size={16} />
          Preview
        </div>

        <div className="absolute right-14 bottom-1.5">
          <SelectModel model={model} handleSetModel={handleSetModel} />
        </div>

        <Button className="m-2 absolute right-1 bottom-0" onClick={handleSend}>
          {loading ? <Spinner /> : <ArrowUp />}
        </Button>
      </div>
    </div>
  );
}

export default ChatSection;
