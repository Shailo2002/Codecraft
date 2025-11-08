"use client";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    GetFrameDetails();
  }, [frameId]);

  const GetFrameDetails = async () => {
    const result = await axios.get(
      `/api/frames?frameId=${frameId}&projectId=${projectId}`
    );
    console.log("result : ", result?.data);
    setFrameDetail(result?.data);
  };

  const SendMessage = (userInput:string) => {
   console.log("sendMessage " ) 
  }

  return (
    <div>
      <PlayGroundHeader />

      <div className="flex">
        {/* chatSection */}
        <ChatSection messages={frameDetail?.chatMessages ?? []} onSend={(input:string) => SendMessage(input)}/>

        {/* websiteDesign */}
        <WebsiteDesign />

        {/* Element seting section */}
        <ElementSettingSection />
      </div>
    </div>
  );
}

export default page;
