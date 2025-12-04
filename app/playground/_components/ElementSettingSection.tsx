import {
  SwatchBook,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
} from "lucide-react";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  selectedEl: HTMLElement;
  clearSelection: () => void;
};

function ElementSettingSection({ selectedEl, clearSelection }: Props) {
  console.log("selected Element : ", selectedEl);

  const handleChange = (property: string, value: string) => {
    if (selectedEl) {
      selectedEl.style[property as any] = value;
    }
  };

  return (
    <div className="w-96 shadow p-4">
      <h2 className="flex gap-1 font-semibold m-2">
        <SwatchBook />
        Settings
      </h2>

      <div className="flex gap-6 items-start mt-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm">Font Size</label>

          <Select
            defaultValue={selectedEl?.style?.fontSize || "12px"}
            onValueChange={(value) => handleChange("fontSize", value)}
          >
            <SelectTrigger className="w-[180px] ">
              <SelectValue placeholder="Select a Font Size" />
            </SelectTrigger>
            <SelectContent className="h-[400px]">
              {[...Array(53)].map((key, index) => (
                <SelectItem value={index + 12 + "px"} key={index}>
                  {index + 12}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1 -space-y-1">
          <label className="text-sm">Color</label>
          <div>
            <input
              type="color"
              className="w-11 h-11 rounded-2xl"
              onChange={(e) => handleChange("color", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-2">
        <label className="text-sm">Text Alignment</label>
        <div className="bg-neutral-200 flex justify-around items-center p-1 mt-1 rounded">
          <Button
            variant={"ghost"}
            onClick={(e) => handleChange("text-align", "start")}
          >
            <TextAlignStart />
          </Button>
          <Button
            variant={"ghost"}
            onClick={(e) => handleChange("text-align", "center")}
          >
            <TextAlignCenter />
          </Button>
          <Button
            variant={"ghost"}
            onClick={(e) => handleChange("text-align", "end")}
          >
            <TextAlignEnd />
          </Button>
        </div>
      </div>

      <div className="flex justify-start gap-4 items-start mt-4">
        <div className="flex flex-col gap-1 -space-y-1">
          <label className="text-sm">Background</label>
          <div>
            <input
              type="color"
              className="w-11 h-11 rounded-2xl"
              onChange={(e) => handleChange("background-color", e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 ">
          <label className="text-sm"> Border Radius</label>
          <Input
            placeholder="e.g. 8"
            onChange={(e) =>
              handleChange("border-radius", `${e.target.value}px`)
            }
          />
        </div>
      </div>
    </div>
  );
}

export default ElementSettingSection;
