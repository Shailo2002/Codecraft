import React, { RefObject, useEffect, useRef, useState } from "react";
import WebPageTools from "./WebPageTools";
import ElementSettingSection from "./ElementSettingSection";
import ImageSettingSection from "./ImageSettingSection";
import Image from "next/image";

type Props = {
  generatedCode: string;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  handleIsChat: (value: Boolean) => void;
};

function WebsiteDesign({ generatedCode, iframeRef, handleIsChat }: Props) {
  const [selectedSize, setSelectedSize] = useState("web");
  const [selectedElement, setSelectedElement] = useState<
    HTMLElement | HTMLImageElement | null
  >();
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  useEffect(() => {
    if (!isIframeLoaded || !iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    const root = doc?.getElementById("root");

    // Inject the code
    if (root) {
      root.innerHTML = generatedCode;

      // Re-attach listeners whenever the innerHTML changes
      // attachEventListeners(doc);
    }
  }, [generatedCode, isIframeLoaded]);

  // Update body only when code changes
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    const root = doc?.getElementById("root");
    if (root) root.innerHTML = generatedCode;
  }, [generatedCode]);

  // Initialize iframe shell once
  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    let hoverEl: HTMLElement | null = null;
    let selectedEl: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      if (selectedEl) return;
      const target = e.target as HTMLElement;
      if (hoverEl && hoverEl !== target) {
        hoverEl.style.outline = "";
      }
      hoverEl = target;
      hoverEl.style.outline = "2px dotted blue";
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (selectedEl) return;
      if (hoverEl) {
        hoverEl.style.outline = "";
        hoverEl = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;

      if (selectedEl && selectedEl !== target) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
      }

      selectedEl = target;
      setSelectedElement(selectedEl);
      selectedEl.style.outline = "2px solid red";
      selectedEl.setAttribute("contenteditable", "true");
      selectedEl.focus();
    };

    const handleBlur = () => {
      if (selectedEl) {
        console.log("Final edited element:", selectedEl.outerHTML);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedEl) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
        selectedEl.removeEventListener("blur", handleBlur);
        selectedEl = null;
      }
    };

    doc.body?.addEventListener("mouseover", handleMouseOver);
    doc.body?.addEventListener("mouseout", handleMouseOut);
    doc.body?.addEventListener("click", handleClick);
    doc?.addEventListener("keydown", handleKeyDown);

    // Cleanup on unmount
    return () => {
      doc.body?.removeEventListener("mouseover", handleMouseOver);
      doc.body?.removeEventListener("mouseout", handleMouseOut);
      doc.body?.removeEventListener("click", handleClick);
      doc?.removeEventListener("keydown", handleKeyDown);
    };
  }, [generatedCode]);

  return (
    <div className="flex gap-2 w-full h-[87vh]">
      <div className="flex flex-col items-center justify-center w-full border-t border-x rounded-lg">
        <div className="flex flex-col md:flex-row w-full h-full overflow-hidden">
          <div
            className="relative flex justify-center items-center
      h-1/2 md:h-auto
      flex-1 md:flex-1
      min-h-0 min-w-0
      border-b md:border-b-0 md:border-r"
          >
            <iframe
              ref={iframeRef}
              // 3. Add onLoad handler here
              onLoad={() => setIsIframeLoaded(true)}
              className={`${
                selectedSize === "web"
                  ? "w-full h-full md:h-[80vh] rounded-tl-lg"
                  : "w-full max-w-[360px] h-full md:h-[76vh] rounded-lg"
              } ${!selectedElement && "rounded-tr-lg"} border bg-white`}
              sandbox="allow-scripts allow-same-origin"
              srcDoc={`<!DOCTYPE html>
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
                        <body id="root"></body>
                        </html>`}
            />

            <div className="absolute flex justify-center items-center gap-1 bottom-4 right-4 border border-slate-100 bg-white shadow text-sm px-2 py-1 rounded">
              Made in{" "}
              <Image
                src={"/logosymbol.svg"}
                alt="codeCraft"
                width={20}
                height={20}
              />
            </div>
          </div>

          {selectedElement && (
            <div
              className="
        h-1/2 md:h-auto
        w-full md:w-72
        shrink-0
        min-h-0
        overflow-y-auto
        border-t md:border-t-0 md:border-l
      "
            >
              {selectedElement.tagName === "IMG" ? (
                <ImageSettingSection
                  selectedEl={selectedElement as HTMLImageElement}
                  clearSelection={() => setSelectedElement(null)}
                />
              ) : (
                <ElementSettingSection
                  selectedEl={selectedElement}
                  clearSelection={() => setSelectedElement(null)}
                />
              )}
            </div>
          )}
        </div>

        <WebPageTools
          selectedSize={selectedSize}
          setSelectedScreenSize={(v: string) => setSelectedSize(v)}
          generatedCode={generatedCode}
          handleIsChat={handleIsChat}
        />
      </div>
    </div>
  );
}

export default WebsiteDesign;
