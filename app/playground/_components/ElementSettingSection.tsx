import {
  SwatchBook,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
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
  const [classes, setClasses] = useState([...selectedEl.classList]);
  const [newClass, setNewClass] = useState("");

  const handleChange = (property: string, value: string) => {
    if (selectedEl) {
      selectedEl.style[property as any] = value;
    }
  };

  const handleRemoveCss = (styleText: string) => {
    if (!styleText) return;

    selectedEl.classList.remove(styleText);
    setClasses((prev) => prev.filter((i) => i !== styleText));
  };

  const handleAddClass = (styleText: string) => {
    if (!styleText) return;
    selectedEl.classList.add(styleText);
    setClasses((prev) => [...prev, styleText]);
  };

  useEffect(() => {
    if (!selectedEl) return;
    setClasses([...selectedEl.classList]);
  }, [selectedEl]);

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
        <div className="bg-neutral-200 flex justify-around items-center p-0.5 mt-1 rounded">
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

      <div className="mt-2 flex flex-col gap-1">
        <label className="text-sm">Padding</label>
        <Input
          placeholder="e.g. 8 px"
          onChange={(e) => handleChange("padding", `${e.target.value}px`)}
        />
      </div>

      <div className="mt-2 flex flex-col gap-1">
        <label className="text-sm">Margin</label>
        <Input
          placeholder="e.g. 8 px"
          onChange={(e) => handleChange("margin", `${e.target.value}px`)}
        />
      </div>

      <div className="mt-2 flex flex-col gap-1 border border-slate-200 rounded-lg p-2 ">
        <label className="text-sm">Classes</label>
        <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto border-t mt-2">
          {classes.map((value, key) => (
            <div
              key={key}
              className="flex items-center gap-2 bg-slate-200 px-3 py-1 rounded-2xl border border-slate-300 leading-none"
            >
              <span className="leading-none">{value}</span>
              <X
                size={12}
                className="text-red-500 leading-none"
                onClick={() => handleRemoveCss(value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center items-center gap-1">
        <Input
          placeholder="Add class..."
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
        />
        <Button onClick={() => handleAddClass(newClass)}>add</Button>
      </div>
    </div>
  );
}

export default ElementSettingSection;
