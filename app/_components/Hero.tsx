"use client";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { ArrowUp, ImagePlus, Loader2Icon } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import SelectModel from "./SelectModel";
import { UserType } from "@/types";
import { suggestion } from "../constants/suggestion";
import createProject from "../actions/createProject";
import { useClerk } from "@clerk/nextjs";

function Hero({ user }: { user?: UserType }) {
  const [userInput, setUserInput] = useState<string>();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<string>("gemini-2.5-flash");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_HEIGHT = 200;
  const { openSignIn } = useClerk();

  const handleSetModel = (value: string) => {
    setModel(value);
  };

  const CreateNewProject = async () => {
    setLoading(true);
    try {

      if (!userInput || userInput?.trim() === "") {
        toast.error("no message found");
        return;
      }

      const response = await createProject({
        chatMessage: [{ role: "user", content: userInput }],
      });

      if (!response?.ok) {
        toast.error(response?.error || "Failed to create project");
        return;
      }

      const data = response as { projectId: string; frameId: string };

      toast.success("Project initiated!");
      router.push(
        `/playground/${data.projectId}?frameId=${encodeURIComponent(
          data.frameId
        )}&modelName=${encodeURIComponent(model)}`
      );
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    setUserInput(el.value);
    el.style.height = "auto";

    const newHeight = Math.min(el.scrollHeight, MAX_HEIGHT);
    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
  };

  const handleTextareaFocus = () => {
    if (!user) {
      openSignIn({
        redirectUrl: "/workspace",
      });
      textareaRef.current?.blur(); // prevent typing
    }
  };

  return (
    <div className="p-4 flex flex-col justify-center items-center overflow-hidden w-full h-[92.5vh] md:h-[92.5vh] text-black dark:text-slate-100">
      {/* description */}
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-5xl text-center md:text-6xl font-extrabold tracking-tight text-balance">
          What should we design?
          {/* <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            design?
          </span> */}
        </h1>

        <h4 className="text-lg text-center mt-2 md:text-xl tracking-tight">
          Generate, Edit and Explore design with AI. Export to code.
        </h4>
      </div>

      {/* input */}
      <div className="not-only-of-type:relative w-full max-w-2xl p-4 mt-5 border rounded-2xl bg-white  dark:bg-neutral-900 ">
        <textarea
          ref={textareaRef}
          placeholder="Describe your page design"
          className="w-full h-16 focus:outline-none focus:ring-0 resize-none"
          onChange={(e) => handleInputChange(e)}
          value={userInput}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();

              if (!user) {
                openSignIn({
                  redirectUrl: "/workspace",
                });
                return;
              }
              if (userInput && userInput?.trim() !== "") {
                CreateNewProject();
              } else {
                toast("Please type a message to continue.", { icon: "✏️" });
              }
            }
          }}
          onFocus={handleTextareaFocus}
          onClick={handleTextareaFocus}
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

        <div className="absolute right-16 bottom-4">
          <SelectModel
            model={model}
            handleSetModel={handleSetModel}
            userSubscription={user?.plan}
          />
        </div>
      </div>

      {/* options */}
      <div className="flex flex-wrap md:flex-row justify-center items-center gap-3 mt-4 ">
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
