import React from "react";
import { Messages } from "../[projectId]/page";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

type Props = {
  messages: Messages[];
};

function ChatSection({ messages }: Props) {
  console.log("chatSection : ", messages);
  return (
    <div className="w-96 shadow h-[92.75vh] p-4 ">
      {/* Message Section */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4 ">
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
      </div>

      {/* Footere Section */}
      <div className="flex border rounded-xl items-end">
        <textarea
          placeholder="Describe your page design"
          className="w-full h-24 p-2 focus:outline-none focus:ring-0 resize-none"
        />
        <Button className="m-2">
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
}

export default ChatSection;
