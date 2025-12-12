import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import {
  Image as ImageIcon,
  Crop,
  Expand,
  Image as ImageUpscale,
  ImageMinus,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
const transformOptions = [
  {
    label: "Smart Crop",
    value: "smartcrop",
    icon: <Crop />,
    transformation: "fo-auto",
  },
  {
    label: "Resize",
    value: "resize",
    icon: <Expand />,
    transformation: "resize-trigger",
  },
  {
    label: "Upscale",
    value: "upscale",
    icon: <ImageUpscale />,
    transformation: "e-upscale",
  },
  {
    label: "BG Remove",
    value: "bgremove",
    icon: <ImageMinus />,
    transformation: "e-bgremove",
  },
];

type Props = {
  selectedEl: HTMLImageElement;
};
function ImageSettingSection({ selectedEl }: Props) {
  const [altText, setAltText] = useState(selectedEl.alt || "");
  const [width, setWidth] = useState<number>(selectedEl.width || 300);
  const [height, setHeight] = useState<number>(selectedEl.height || 200);
  const [borderRadius, setBorderRadius] = useState(
    selectedEl.style.borderRadius || "0px"
  );
  const [baseUrl, setBaseUrl] = useState(selectedEl.src || "");
  const [preview, setPreview] = useState(selectedEl.src || "");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const imageUploadRef = useRef<HTMLInputElement | null>(null);
  const [selectedTool, setSelectedTool] = useState<string[]>([]);

  const openFileDialog = () => {
    imageUploadRef?.current?.click();
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    try {
      if (!e.target.files) return;
      const file = e.target.files[0];
      if (!file) {
        return;
      }

      const form = new FormData();
      form.append("file", file);

      const result = await axios.post("/api/imagekit/upload", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPreview(result?.data?.url);
      setBaseUrl(result?.data?.url);
      selectedEl.setAttribute("src", result?.data?.url);
      console.log("upload image url : ", result?.data?.url);
    } catch (error) {
      console.log("error : ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/imagekit/generate-image", {
        prompt: altText,
      });
      setPreview(res?.data?.url);
      setBaseUrl(res?.data?.url);
      selectedEl.setAttribute("src", res?.data?.url);
      console.log("generated image url : ", res?.data?.url);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageEdit = (toolType: string) => {
    setLoading(true);
    try {
      if (!toolType && !preview) return;

      if (selectedTool.includes(toolType)) {
        const tempTool = selectedTool.filter((t) => t !== toolType);

        setSelectedTool(tempTool);
        editImageUrl({ baseUrl, selectedTool: tempTool });
      } else {
        selectedTool.push(toolType);
        editImageUrl({
          baseUrl,
          selectedTool,
        });
      }
    } catch (error) {
      console.log("error : ", error);
    } finally {
      setLoading(false);
    }
  };

  const editImageUrl = ({
    baseUrl,
    selectedTool,
    h,
    w,
  }: {
    baseUrl: string;
    selectedTool: string[];
    h?: number;
    w?: number;
  }) => {
    const currentW = w || width;
    const currentH = h || height;
    let trParts = [];
    console.log("selected tools :  ", selectedTool)

    if (
      selectedTool.includes("resize-trigger") ||
      selectedTool.includes("fo-auto")
    ) {
      trParts.push(`w-${currentW}`);
      trParts.push(`h-${currentH}`);
    }

    selectedTool?.map((t) => {
      if (t !== "resize-trigger") {
        trParts.push(t);
      }
    });

    console.log("trParts : ", trParts);
    const trString = trParts.length > 0 ? `?tr=${trParts.join(",")}` : "";
    const finalUrl = baseUrl + trString;
    setPreview(finalUrl);
    selectedEl.setAttribute("src", finalUrl);
    console.log("imageEdit Url : ", finalUrl);
  };

  const handleDimensionChange = ({
    type,
    value,
  }: {
    type: string;
    value: number;
  }) => {
    if (type === "h") {
      setHeight(value);
      editImageUrl({ baseUrl, selectedTool, h: value });
    } else if (type === "w") {
      setWidth(value);
      editImageUrl({ baseUrl, selectedTool, w: value });
    }
  };

  useEffect(() => {
    setAltText(selectedEl.alt);
    setPreview(selectedEl.src);
    setBorderRadius(selectedEl.style.borderRadius);
  }, [selectedEl]);

  return (
    <div className="w-96 shadow p-4 space-y-4">
      <h2 className="flex gap-2 items-center font-bold">
        <ImageIcon /> Image Settings
      </h2>

      {/* image upload section */}
      <div className="flex justify-center">
        <div className="relative max-h-40">
          <img
            src={preview}
            alt={altText}
            className="max-h-40 object-contain border rounded cursor-pointer hover:opacity-80"
            onClick={() => openFileDialog()}
          />
        </div>
      </div>
      <div className="grid w-full max-w-sm items-center gap-3">
        <input
          id="picture"
          type="file"
          className="hidden"
          ref={imageUploadRef}
          onChange={(e) => {
            handleUploadImage(e);
          }}
        />
        <Button
          variant="outline"
          className="w-full"
          onClick={() => openFileDialog()}
          disabled={loading}
        >
          {loading ? <Spinner /> : "Upload Image"}
        </Button>
      </div>

      {/* prompt area */}
      <div>
        <label className="text-sm">Prompt</label>
        <Input
          type="text"
          placeholder="Enter alt text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="mt-1"
        />
      </div>

      <Button
        className="w-full"
        onClick={() => handleGenerateImage()}
        disabled={loading}
      >
        {loading ? <Spinner /> : "Generate Ai Image"}
      </Button>

      {/* image tool area */}
      <div>
        <label className="text-sm">AI Transform</label>
        <div className="flex justify-start items-center gap-2 mt-1">
          {transformOptions?.map((item, key) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <Button
                  variant={
                    selectedTool.includes(item.transformation)
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleImageEdit(item.transformation)}
                >
                  {item.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {selectedTool.includes("resize-trigger") ||
        selectedTool.includes("fo-auto") ? (
          <div className="grid grid-cols-2 mt-3 p-2 gap-2 border rounded-lg">
            <div>
              <Label className="text-sm">Height</Label>
              <Input
                type="number"
                id="height"
                placeholder="Height"
                value={height}
                onChange={(e) =>
                  handleDimensionChange({
                    type: "h",
                    value: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label className="text-sm">Width</Label>
              <Input
                type="number"
                id="width"
                placeholder="Width"
                value={width}
                onChange={(e) =>
                  handleDimensionChange({
                    type: "w",
                    value: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        ) : null}
      </div>

      <div>
        <label className="text-sm">Border Radius</label>
        <Input
          placeholder="e.g. 8"
          onChange={(e) => {
            setBorderRadius(e.target.value);
          }}
          value={borderRadius}
        />
      </div>
    </div>
  );
}

export default ImageSettingSection;
