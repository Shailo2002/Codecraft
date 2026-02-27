import React, { RefObject, useEffect, useRef, useState } from "react";
import WebPageTools from "./WebPageTools";
import ElementSettingSection from "./ElementSettingSection";
import ImageSettingSection from "./ImageSettingSection";
import Image from "next/image";
import { loadingTemplateHtml } from "@/app/constants/templateHtml";

type Props = {
  generatedCode: string;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  handleIsChat: (value: Boolean) => void;
  isPremium?: boolean;
  loading: boolean;
};

function WebsiteDesign({
  generatedCode,
  iframeRef,
  handleIsChat,
  isPremium = false,
  loading = false,
}: Props) {
  const [selectedSize, setSelectedSize] = useState("web");
  const [selectedElement, setSelectedElement] = useState<
    HTMLElement | HTMLImageElement | null
  >();
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const hoverRef = useRef<HTMLElement | HTMLImageElement | null>(null);
  const selectedRef = useRef<HTMLElement | HTMLImageElement | null>(null);

  const ChangeEditState = () => {
    setIsEdit((prev) => !prev);
  };

  useEffect(() => {
    if (!isIframeLoaded || !iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    const root = doc?.getElementById("root");

    if (root) {
      root.innerHTML = generatedCode;
    }
  }, [generatedCode, isIframeLoaded]);

  // useEffect(() => {
  //   console.log("inside useeffect for check", iframeRef.current);
  //   const doc = iframeRef.current?.contentDocument;
  //   const root = doc?.getElementById("root");
  //   console.log("root element in iframe: ", root);
  //   let finalcode = generatedCode;
  //   if (generatedCode.trim() === "") {
  //     console.log("generated code is empty, using loading template");
  //     finalcode = loadingTemplateHtml;
  //   }
  //   if (root) root.innerHTML = finalcode;
  // }, [generatedCode]);

  

  useEffect(() => {
    if (isEdit) return;

    // Clear hover
    if (hoverRef.current) {
      hoverRef.current.style.outline = "";
      hoverRef.current = null;
    }

    // Clear selected
    if (selectedRef.current) {
      selectedRef.current.style.outline = "";
      selectedRef.current.removeAttribute("contenteditable");
      selectedRef.current = null;
    }

    setSelectedElement(null);
  }, [isEdit]);

  useEffect(() => {
    if (loading || !isEdit) return;
    if (!iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target === selectedRef.current) return;

      if (hoverRef.current && hoverRef.current !== target) {
        hoverRef.current.style.outline = "";
      }

      hoverRef.current = target;
      hoverRef.current.style.outline = "2px dotted blue";
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target === selectedRef.current) return;

      if (hoverRef.current === target) {
        hoverRef.current.style.outline = "";
        hoverRef.current = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;

      if (selectedRef.current && selectedRef.current !== target) {
        selectedRef.current.style.outline = "";
        selectedRef.current.removeAttribute("contenteditable");
      }

      if (hoverRef.current === target) {
        hoverRef.current = null;
      }

      selectedRef.current = target;
      setSelectedElement(target);

      target.style.outline = "2px solid blue";
      target.setAttribute("contenteditable", "true");
      target.focus();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedRef.current) {
        selectedRef.current.style.outline = "";
        selectedRef.current.removeAttribute("contenteditable");
        selectedRef.current = null;
      }
    };

    doc.body.addEventListener("mouseover", handleMouseOver);
    doc.body.addEventListener("mouseout", handleMouseOut);
    doc.body.addEventListener("click", handleClick);
    doc.addEventListener("keydown", handleKeyDown);

    return () => {
      doc.body.removeEventListener("mouseover", handleMouseOver);
      doc.body.removeEventListener("mouseout", handleMouseOut);
      doc.body.removeEventListener("click", handleClick);
      doc.removeEventListener("keydown", handleKeyDown);
    };
  }, [generatedCode, loading, isEdit]);

  useEffect(() => {
    if (isEdit) return;

    // Clear hover
    if (hoverRef.current) {
      hoverRef.current.style.outline = "";
      hoverRef.current = null;
    }

    // Clear selected
    if (selectedRef.current) {
      selectedRef.current.style.outline = "";
      selectedRef.current.removeAttribute("contenteditable");
      selectedRef.current = null;
    }

    setSelectedElement(null);
  }, [isEdit]);

  useEffect(() => {
    const iframe = iframeRef.current;

    const handleLoad = () => {
      const iframeDoc = iframe.contentDocument;

      iframeDoc.addEventListener("click", (e) => {
        const a = e.target.closest("a");
        if (a && a.href) {
          e.preventDefault();
        }
      });
    };

    iframe.addEventListener("load", handleLoad);

    return () => iframe.removeEventListener("load", handleLoad);
  }, []);

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
              className={`${loading ? "pointer-events-none opacity-70" : ""} 
              ${
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
          isEdit={isEdit}
          ChangeEditState={ChangeEditState}
        />
      </div>
    </div>
  );
}

export default WebsiteDesign;
