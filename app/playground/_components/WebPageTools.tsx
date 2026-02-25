import { Button } from "@/components/ui/button";
import {
  CodeXml,
  Download,
  MessageCircleMore,
  Monitor,
  Palette,
  SquareArrowOutUpRight,
  TabletSmartphone,
} from "lucide-react";
import { ViewCodeBlock } from "./ViewCodeBlock";
import { useEffect, useState } from "react";
import { watermarkHTML } from "@/app/constants/templateHtml";

function WebPageTools({
  selectedSize,
  setSelectedScreenSize,
  generatedCode,
  handleIsChat,
  isPremium,
  isEdit,
  ChangeEditState,
}: any) {
  const [finalCode, setFinalCode] = useState<string>("");

  useEffect(() => {
    const tempCode = ` <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="AI Website Builder - Modern TailWindCSS + Flowbite Template">
        <title>AI Website Builder</title>

        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>

        <!-- Flowbite CSS & JS -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

        <!-- Font Awesome / Lucide -->
        <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

        <!-- Chart.js -->
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

        <!-- AOS -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

        <!-- GSAP -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

        <!-- Lottie -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

        <!-- Swiper -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

        <!-- Tippy.js -->
        <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
        <script src="https://unpkg.com/@popperjs/core@2"></script>
        <script src="https://unpkg.com/tippy.js@6"></script>
      </head>
      <body id="root">
      ${generatedCode}</body>
      </html>`;

    const cleanCode = !isPremium
      ? tempCode.replace("</body>", `${watermarkHTML}</body>`)
      : tempCode;
    setFinalCode(cleanCode);
  }, [generatedCode]);

  const ViewInNewTab = () => {
    if (!finalCode) return;

    const blob = new Blob([finalCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleDownload = () => {
    const blob = new Blob([finalCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`p-3 w-full border shadow rounded-b-lg flex justify-between items-center h-[7vh] bg-white dark:bg-neutral-900`}
    >
      <div className="hidden md:flex items-center justify-center gap-2">
        <Button
          variant={"outline"}
          className={` ${
            selectedSize == "web"
              ? "border-primary dark:border-slate-100"
              : null
          }`}
          onClick={() => setSelectedScreenSize("web")}
        >
          <Monitor />
        </Button>
        <Button
          variant={"outline"}
          className={`${
            selectedSize == "mobile"
              ? "border-primary dark:border-slate-100"
              : null
          }`}
          onClick={() => setSelectedScreenSize("mobile")}
        >
          <TabletSmartphone />
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 md:hidden">
        <Button onClick={() => handleIsChat(true)}>
          <MessageCircleMore /> Chat
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button
          variant={isEdit ? "default" : "outline"}
          onClick={() => ChangeEditState()}
        >
          <span className="hidden md:inline">Design</span>
          <Palette />
        </Button>

        <Button variant={"outline"} onClick={() => ViewInNewTab()}>
          <span className="hidden md:inline">View</span>
          <SquareArrowOutUpRight />
        </Button>

        <ViewCodeBlock code={finalCode}>
          <Button>
            <span className="hidden md:inline">Code</span>
            <CodeXml />
          </Button>
        </ViewCodeBlock>

        <Button onClick={() => handleDownload()}>
          <span className="hidden md:inline">Download</span>
          <Download />
        </Button>
      </div>
    </div>
  );
}

export default WebPageTools;
