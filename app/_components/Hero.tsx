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
import Link from "next/link";
import { useContext, useState } from "react";
import { UserDetailContext } from "../context/UserDetailContext";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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

function Hero() {
  const user = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState<string>();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false)

  const CreateNewProject = async () => {
        setLoading(true);
    const projectId = await uuidv4();
    const frameId = await crypto.randomUUID().slice(0, 8);
    try {
      const response = await axios.post("/api/projects", {
        projectId,
        frameId,
        chatMessage: userInput,
      });
      console.log("response : ", response);
      toast.success("Project created!");
      router.push(`/playground/${projectId}?frameId=${frameId}`);
    } catch (error) {
      toast.error("Internal server error!");
      console.log("error");
    } finally{
      setLoading(false)
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
      <div className="w-full max-w-2xl p-5 mt-5 border rounded-2xl">
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
            <Button onClick={CreateNewProject} disabled={!userInput || loading}>
              {loading ? <Loader2Icon className="animate-spin" /> : <ArrowUp />}
            </Button>
          )}
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
