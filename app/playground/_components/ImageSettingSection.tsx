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
    transformation: "e-dropshadow",
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
  const [preview, setPreview] = useState(selectedEl.src || "");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const imageUploadRef = useRef<HTMLInputElement | null>(null);
  const [selectedTool, setSelectedTool] = useState([]);

  const openFileDialog = () => {
    imageUploadRef?.current?.click();
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    try {
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
      selectedEl.setAttribute("src", result?.data?.url);
    } catch (error) {
      console.log("error : ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const url = `https://ik.imagekit.io/jvcgawwif/ik-genimg-prompt-${altText}/${Date.now()}.jpg`;
      console.log("generate image url : ", url);
      const result = await axios.post("/api/imagekit/ai-upload", { url });
      console.log("result : ", result);
      setPreview(result?.data?.url);
      selectedEl.setAttribute("src", result?.data?.url);
    } catch (error) {
      console.log("error : ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageEdit = (toolType: string) => {
    setLoading(true);
    try {
      if (!toolType && !preview) return;
      const url = `${preview}?tr=${toolType},`;
      console.log("image edit url : ", url);
      setPreview(url);
      selectedEl.setAttribute("src", url);
    } catch (error) {
      console.log("error : ", error);
    } finally {
      setLoading(false);
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
                  variant={"outline"}
                  onClick={() => handleImageEdit(item?.transformation)}
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
