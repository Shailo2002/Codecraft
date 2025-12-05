import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  Image as ImageIcon,
  Crop,
  Expand,
  Image as ImageUpscale,
  ImageMinus,
} from "lucide-react";
import React, { useRef, useState } from "react";

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
  const imageUploadRef = useRef<HTMLInputElement | null>(null);

  const openFileDialog = () => {
    imageUploadRef?.current?.click();
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      selectedEl.src = result?.data?.url;

    } catch (error) {
      console.log("error : ", error);
    }
  };

  return (
    <div className="w-96 shadow p-4 space-y-4">
      <h2 className="flex gap-2 items-center font-bold">
        <ImageIcon /> Image Settings
      </h2>

      {/* image upload section */}
      <div className="flex justify-center">
        <img
          src={preview}
          alt={altText}
          className="max-h-40 object-contain border rounded cursor-pointer hover:opacity-80"
          onClick={() => openFileDialog()}
        />
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
        >
          Upload Image
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

      <Button className="w-full">Generate Ai Image</Button>

      {/* image tool area */}
      <div>
        <label className="text-sm">AI Transform</label>
        <div className="flex justify-start items-center gap-2 mt-1">
          <Button variant={"outline"}>
            <Crop />
          </Button>
          <Button variant={"outline"}>
            <Expand />
          </Button>
          <Button variant={"outline"}>
            <ImageIcon />
          </Button>
          <Button variant={"outline"}>
            <ImageMinus />
          </Button>
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
