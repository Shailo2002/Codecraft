import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import SelectModel from "@/app/_components/SelectModel";
import { ChatMessage, UserType } from "@/types";

type Props = {
  messages: ChatMessage[];
  user: UserType;
  onSend: any;
  loading: boolean;
  handleIsChat: (value: Boolean) => void;
};

function ChatSection({ messages, user, onSend, loading, handleIsChat }: Props) {
  const [input, setInput] = useState<string>("");
  const [model, setModel] = useState<string>("gemini-2.5-flash");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const MAX_HEIGHT = 200; // px (adjust as needed)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    setInput(el.value);
    el.style.height = "auto";

    const newHeight = Math.min(el.scrollHeight, MAX_HEIGHT);
    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
  };

  const handleSend = () => {
    if (!input?.trim()) return;
    onSend(input, model);
    setInput("");
    if (!textareaRef.current) return;
    textareaRef.current.style.height = `${96}px`;
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
    <div className="flex flex-col w-120 h-[89vh]">
      {/* Message Section */}
      <ScrollArea className="flex-1 flex flex-col overflow-y-auto rounded-lg border-2 dark:border-neutral-950 bg-white dark:bg-neutral-900">
        <div className="p-4 space-y-4 ">
          {messages?.length === 0 ? (
            <p className="text-gray-400 text-center">No Messages Yet</p>
          ) : (
            messages?.map((msg: ChatMessage, index) => (
              <div
                className={`flex ${
                  msg?.chatMessage[0]?.role == "user"
                    ? "justify-end"
                    : "justify-start"
                } `}
                key={index}
              >
                <div
                  className={`p-2 rounded-lg max-w-[80%] text-start overflow-hidden whitespace-pre-wrap ${
                    msg?.chatMessage[0]?.role == "user"
                      ? "bg-gray-100 dark:bg-neutral-800"
                      : "bg-gray-300 dark:bg-neutral-700 break-words break-all"
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
      <div className="relative flex border-2 dark:border-neutral-950 rounded-lg items-end mt-2 bg-white text-black dark:bg-neutral-900 dark:text-slate-100">
        <textarea
          ref={textareaRef}
          className="w-full min-h-24 p-2 mb-12 resize-none focus:outline-none overflow-y-hidden"
          placeholder="Describe your page design"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          style={{ maxHeight: `${MAX_HEIGHT}px` }}
        />

        <div className="absolute left-4 bottom-1.5 flex justify-center items-center gap-2 rounded-full">
          <div
            className="bg-background rounded-full hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 p-2 flex justify-center items-center gap-1 text-sm cursor-pointer md:hidden"
            onClick={() => handleIsChat(false)}
          >
            <Eye size={16} />
            Preview
          </div>

          <SelectModel
            model={model}
            handleSetModel={handleSetModel}
            userSubscription={user?.plan}
            className="bg-background rounded-full hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
          />
        </div>
        <Button
          className="m-2 absolute right-1 -bottom-0.5"
          onClick={handleSend}
        >
          {loading ? <Spinner /> : <ArrowUp />}
        </Button>
      </div>
    </div>
  );
}

export default ChatSection;
