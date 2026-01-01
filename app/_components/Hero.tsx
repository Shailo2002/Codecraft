"use client";

import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import {
  ArrowUp,
  HomeIcon,
  ImagePlus,
  Key,
  LayoutDashboard,
  Loader2Icon,
  User,
} from "lucide-react";
import { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import SelectModel from "./SelectModel";
import { useUserOptional } from "../context/user-context";
import { UserType } from "@/types";

type HeroProps = {
  user?: UserType;
};

const suggestion = [
  {
    label: "Dashboard",
    prompt:
      "Create an analytics dashboard to track customers and revenue data for a SaaS",
    icon: LayoutDashboard,
  },
  {
    label: "SignUp Form",
    prompt:
      "Create a modern sign up form with email/password fields, Google and Github login options, and terms checkbox",
    icon: Key,
  },
  {
    label: "Hero",
    prompt:
      "Create a modern header and centered hero section for a productivity SaaS. Include a badge for feature announcement, a title with a subtle gradient effect, subtitle, CTA, small social proof and an image.",
    icon: HomeIcon,
  },
  {
    label: "User Profile Card",
    prompt:
      "Create a modern user profile card component for a social media website",
    icon: User,
  },
];

function Hero({ user }: HeroProps) {
  const contextUser = useUserOptional();
  const resolvedUser = user ?? contextUser;
 
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
      const response = await axios.post("/api/projects", {
        chatMessage: [{ role: "user", content: userInput }],
      });
      console.log("response : ", response);
      const projectId = response?.data?.projectId;
      const frameId = response?.data?.frameId;
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
