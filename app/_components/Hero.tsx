"use client"

import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import {
  ArrowUp,
  HomeIcon,
  ImagePlus,
  Key,
  LayoutDashboard,
  User,
} from "lucide-react";
import { useState } from "react";

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
    const [userInput, setUserInput] = useState<string>();
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

          <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
            <Button size={"icon"} disabled={!userInput}>
              <ArrowUp />
            </Button>
          </SignInButton>
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
