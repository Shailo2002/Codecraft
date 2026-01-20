import React, { RefObject, useEffect, useRef, useState } from "react";
import WebPageTools from "./WebPageTools";
import ElementSettingSection from "./ElementSettingSection";
import ImageSettingSection from "./ImageSettingSection";
import Image from "next/image";
import {
  loadingTemplateHtml,
  templateHtml,
} from "@/app/constants/templateHtml";

type Props = {
  generatedCode: string;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  handleIsChat: (value: Boolean) => void;
  isPremium?: boolean;
};

function WebsiteDesign({
  generatedCode,
  iframeRef,
  handleIsChat,
  isPremium = false,
}: Props) {
  const [selectedSize, setSelectedSize] = useState("web");
  const [selectedElement, setSelectedElement] = useState<
    HTMLElement | HTMLImageElement | null
  >();
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  useEffect(() => {
    if (!isIframeLoaded || !iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    const root = doc?.getElementById("root");

    if (root) {
      root.innerHTML = generatedCode;
    }
  }, [generatedCode, isIframeLoaded]);

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    const root = doc?.getElementById("root");
    let finalcode = generatedCode;
    if (generatedCode.trim() === "") {
      finalcode = loadingTemplateHtml;
    }
    if (root) root.innerHTML = finalcode;
  }, [generatedCode]);

  // useEffect(() => {
  //   if (!iframeRef.current) return;
  //   const doc = iframeRef.current.contentDocument;
  //   if (!doc) return;

  //   let hoverEl: HTMLElement | null = null;
  //   let selectedEl: HTMLElement | null = null;

  //   const handleMouseOver = (e: MouseEvent) => {
  //     if (selectedEl) return;
  //     const target = e.target as HTMLElement;
  //     if (hoverEl && hoverEl !== target) {
  //       hoverEl.style.outline = "";
  //     }
  //     hoverEl = target;
  //     hoverEl.style.outline = "2px dotted blue";
  //   };

  //   const handleMouseOut = (e: MouseEvent) => {
  //     if (selectedEl) return;
  //     if (hoverEl) {
  //       hoverEl.style.outline = "";
  //       hoverEl = null;
  //     }
  //   };

  //   const handleClick = (e: MouseEvent) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     const target = e.target as HTMLElement;

  //     if (selectedEl && selectedEl !== target) {
  //       selectedEl.style.outline = "";
  //       selectedEl.removeAttribute("contenteditable");
  //     }

  //     selectedEl = target;
  //     setSelectedElement(selectedEl);
  //     selectedEl.style.outline = "2px solid red";
  //     selectedEl.setAttribute("contenteditable", "true");
  //     selectedEl.focus();
  //   };

  //   const handleBlur = () => {
  //     if (selectedEl) {
  //       console.log("Final edited element:", selectedEl.outerHTML);
  //     }
  //   };

  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === "Escape" && selectedEl) {
  //       selectedEl.style.outline = "";
  //       selectedEl.removeAttribute("contenteditable");
  //       selectedEl.removeEventListener("blur", handleBlur);
  //       selectedEl = null;
  //     }
  //   };

  //   doc.body?.addEventListener("mouseover", handleMouseOver);
  //   doc.body?.addEventListener("mouseout", handleMouseOut);
  //   doc.body?.addEventListener("click", handleClick);
  //   doc?.addEventListener("keydown", handleKeyDown);

  //   // Cleanup on unmount
  //   return () => {
  //     doc.body?.removeEventListener("mouseover", handleMouseOver);
  //     doc.body?.removeEventListener("mouseout", handleMouseOut);
  //     doc.body?.removeEventListener("click", handleClick);
  //     doc?.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [generatedCode]);

  return (
    <div className="flex gap-2 w-full h-[89vh] ">
      <div className="flex flex-col items-center justify-center w-full border-t dark:border-t-neutral-950 border-x rounded-lg bg-slate-100 dark:bg-neutral-900">
        <div className="flex flex-col md:flex-row w-full h-full overflow-hidden">
          <div
            className="relative flex justify-center items-center
      h-1/2 md:h-auto
      flex-1 md:flex-1
      min-h-0 min-w-0
      border-b dark:border-neutral-950"
          >
            <iframe
              ref={iframeRef}
              onLoad={() => setIsIframeLoaded(true)}
              className={`${
                selectedSize === "web"
                  ? "w-full h-full md:h-[82vh] rounded-tl-lg"
                  : "w-full max-w-[360px] h-full md:h-[76vh] rounded-lg"
              } ${!selectedElement && "rounded-tr-lg"} bg-white`}
              sandbox="allow-scripts allow-same-origin"
              srcDoc={generatedCode}
            />

            {!isPremium && (
              <div className="absolute flex justify-center items-center gap-1 bottom-4 right-4 border border-slate-100 dark:border-neutral-950 dark:border-2 bg-white dark:bg-neutral-900 shadow text-sm px-2 py-1 rounded-lg">
                Made by{" "}
                <Image
                  src={"/logosymbol.svg"}
                  alt="codeCraft"
                  width={20}
                  height={20}
                />
              </div>
            )}
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
          isPremium={isPremium}
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
