"use client";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { ArrowUp, ImagePlus, Loader2Icon } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import SelectModel from "./SelectModel";
import { UserType } from "@/types";
import { suggestion } from "../constants/suggestion";
import createProject from "../actions/createProject";

function Hero({ user }: { user: UserType }) {
  const [userInput, setUserInput] = useState<string>();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<string>("gpt-4o-mini");

  const handleSetModel = (value: string) => {
    setModel(value);
  };

  const CreateNewProject = async () => {
    setLoading(true);
    try {
      const response = await createProject({
        chatMessage: [{ role: "user", content: userInput }],
      });
      console.log("response : ", response);
      const projectId = response?.projectId;
      const frameId = response?.frameId;
      toast.success("Project created!");
      router.push(`/playground/${projectId}?frameId=${frameId}`);
    } catch (error) {
      const axiosError = error as any;
      toast.error(
        axiosError?.response?.data?.error || "Internal server error!"
      );
      console.log("error : ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[80vh]">
      {/* description */}
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-center text-6xl font-extrabold tracking-tight text-balance">
          What should we design?
        </h1>
        <h4 className="text-gray-500 mt-2 text-xl tracking-tight">
          Generate, Edit and Explore design with AI. Export to code.
        </h4>
      </div>

      {/* input */}
      <div className="relative w-full max-w-2xl p-5 mt-5 border rounded-2xl">
        <textarea
          placeholder="Describe your page design"
          className="w-full  h-24 focus:outline-none focus:ring-0 resize-none"
          onChange={(e) => setUserInput(e.target.value)}
          value={userInput}
        />
        <div className="flex justify-between items-center">
          <Button variant={"ghost"}>
            <ImagePlus />
          </Button>

          {!user ? (
            <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
              <Button size={"icon"} disabled={!userInput || loading}>
                <ArrowUp />
              </Button>
            </SignInButton>
          ) : (
            <Button
              onClick={() => CreateNewProject()}
              disabled={!userInput || loading}
            >
              {loading ? <Loader2Icon className="animate-spin" /> : <ArrowUp />}
            </Button>
          )}
        </div>

        <div className="absolute right-14 bottom-4">
          <SelectModel model={model} handleSetModel={handleSetModel} />
        </div>
      </div>

      {/* options */}
      <div className="flex gap-3 mt-4">
        {suggestion.map((value, index) => (
          <Button
            variant={"outline"}
            onClick={() => setUserInput(value.prompt)}
            key={index}
          >
            <value.icon />
            {value.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default Hero;
