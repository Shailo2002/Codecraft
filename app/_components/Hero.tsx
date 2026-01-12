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
import { ShowcaseCard } from "./ShowcaseCardProps";
import { showCaseProjects } from "../constants/showCaseProjects";

function Hero({ user }: { user?: UserType }) {
  const [userInput, setUserInput] = useState<string>();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<string>("gemini-2.5-flash");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_HEIGHT = 200;
  const { openSignIn } = useClerk();

  const handleSetModel = (value: string) => {
    console.log("model : ", value);
    setModel(value);
  };

  const CreateNewProject = async () => {
    setLoading(true);
    try {
      console.log("project create handle : ", {
        role: "user",
        content: userInput,
      });
      const response = await createProject({
        chatMessage: [{ role: "user", content: userInput }],
      });

      if (!response?.ok) {
        toast.error(response?.error || "Failed to create project");
        return;
      }

      const data = response as { projectId: string; frameId: string };

      toast.success("Project created!");
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

  return (
    <div className="p-4 flex flex-col justify-center items-center w-full h-[92vh] md:h-[91.4vh]  ">
      {/* description */}
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-5xl text-center md:text-6xl font-extrabold tracking-tight text-balance">
          What should we{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            design?
          </span>
        </h1>

        <h4 className="text-lg text-center text-gray-500 mt-2 md:text-xl tracking-tight">
          Generate, Edit and Explore design with AI. Export to code.
        </h4>
      </div>

      {/* input */}
      <div className="not-only-of-type:relative w-full max-w-2xl p-4 mt-5 border rounded-2xl">
        <textarea
          ref={textareaRef}
          placeholder="Describe your page design"
          className="w-full h-24 focus:outline-none focus:ring-0 resize-none"
          onChange={(e) => handleInputChange(e)}
          value={userInput}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              if (!user) {
                openSignIn({
                  redirectUrl: "/workspace",
                });
                return;
              }

              CreateNewProject();
            }
          }}
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
          <SelectModel
            model={model}
            handleSetModel={handleSetModel}
            userSubscription={user?.plan}
          />
        </div>
      </div>

      {/* options */}
      <div className="flex flex-wrap md:flex-row justify-center items-center gap-3 mt-4">
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

      {/* Website showcase */}
      <div className="hidden lg:block">
        <div>
          <h4 className="text-lg text-center text-gray-500 mt-8 md:text-xl tracking-tight">
            ShowCase
          </h4>
        </div>

        <div className="mt-2 flex flex-wrap justify-center gap-4">
          {showCaseProjects.map((project) => (
            <div className="w-64">
              <ShowcaseCard
                title={project?.title}
                link={project?.link}
                previewImage={project?.previewImage}
                websitePrompt={project?.website_prompt}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hero;
