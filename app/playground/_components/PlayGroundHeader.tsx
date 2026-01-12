"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getDeploymentUrl } from "@/app/actions/getDeploymentUrl";
import axios, { AxiosError } from "axios";
import { Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { UserType } from "@/types";
import { useUpgradeModal } from "@/hooks/useUpgradeModal";

function PlayGroundHeader({
  onSave,
  loading,
  code,
  projectName,
  projectId,
  user,
}: {
  onSave: () => void;
  loading: boolean;
  code: string;
  projectName: string;
  projectId: string;
  user: UserType;
}) {
  const [deploying, setDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const upgrade = useUpgradeModal();

  const handleDeploy = async () => {
    console.log("project deployment initiated");
    if (!code) {
      alert("Please generate some code first!");
      return;
    }

    if (user?.plan !== "PREMIUM") {
      toast.error("Upgrade to the Premium plan to enable project deployment.");
      upgrade.show();
      return;
    }

    const url = await getDeploymentUrl(projectId);

    if (url) {
      console.log("inside url if : ", url);
      setDeployedUrl(url);
    } else {
      const finalCode = `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                          <meta charset="UTF-8" />
                          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                          <title>AI Website Builder</title>
                         <script src="https://cdn.tailwindcss.com"></script>
                        <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
                        
                        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
                        <script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js"></script>
                        
                        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
                        <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"></script>
                        
                        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
                        <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
                        <script src="https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js"></script>
                        <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
                        <link
                          rel="stylesheet"
                          href="https://cdnjs.cloudflare.com/ajax/libs/hover.css/2.3.1/css/hover-min.css"
                        />
                        <script src="https://unpkg.com/@studio-freight/lenis@1.0.42/bundled/lenis.min.js"></script>

                        </head>
                        <body id="root">
                        ${code}</body>
                        </html>
                      `;

      setDeploying(true);
      setDeployedUrl(null);

      try {
        const uniqueName = `${projectName}-${Date.now()}`
          .toLowerCase()
          .replace(/\s+/g, "-");

        const response = await axios.post("/api/deploy", {
          htmlCode: finalCode,
          projectName: uniqueName,
          projectId,
        });

        if (response.data && response.data.url) {
          setDeployedUrl(response.data.url);
        }
      } catch (error: any) {
        const deployError = error as AxiosError;
        console.log("error : ", deployError);
        toast.error(
          (deployError?.response?.data as any)?.message ||
            "Deployment failed. Check console."
        );
      } finally {
        setDeploying(false);
      }
    }
  };

  return (
    <div className="relative flex justify-between items-center p-4 shadow h-[8.75vh]">
      <Link href={"/workspace"}>
        <Image src={"/logo.svg"} alt="logo" width={140} height={140} />
      </Link>

      <div className="flex justify-center items-center gap-4">
        <Button
          onClick={handleDeploy}
          disabled={deploying}
          className="min-w-16 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {deploying ? (
            <>
              <Spinner className="mr-2 h-4 w-4" /> Deploying...
            </>
          ) : (
            <>
              <Globe /> Deploy
            </>
          )}
        </Button>

        <Button
          onClick={() => onSave()}
          disabled={loading}
          className="min-w-16"
        >
          {loading ? <Spinner /> : "Save"}
        </Button>
        {upgrade.modal}
      </div>

      {/* SUCCESS POPUP: Shows absolute positioned below the header when deployed */}
      {deployedUrl && (
        <div className="absolute top-20 right-4 z-50 w-96 p-4 bg-white border border-green-200 rounded-lg shadow-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold text-green-700">
              🚀 Website Deployed!
            </h3>
            <button
              onClick={() => setDeployedUrl(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-500">Your site is live at:</p>
            <a
              href={deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline truncate hover:text-blue-800 flex items-center gap-1"
            >
              {deployedUrl}
              {/* If you don't have lucide-react, remove the icon below */}
              <span className="text-xs">↗</span>
            </a>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 w-full"
              onClick={() => window.open(deployedUrl, "_blank")}
            >
              Visit Website
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayGroundHeader;
