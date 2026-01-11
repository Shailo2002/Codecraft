import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock } from "lucide-react";
import { useState } from "react";

type Props = {
  model: string;
  handleSetModel: (value: string) => void;
  userSubscription: string | undefined;
  width?: string | "130px";
  className?:string;
};

function SelectModel({
  model,
  handleSetModel,
  userSubscription,
  width,
  className,
}: Props) {
  return (
    <Select value={model} onValueChange={(value) => handleSetModel(value)}>
      <SelectTrigger
        className={`w-[${width}] border-none shadow-none ring-0 outline-none ${className}`}
      >
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>model</SelectLabel>
          <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
          <SelectItem value="gemini-2.5-flash">gemini-2.5-flash</SelectItem>
          <SelectItem
            value="gpt-5-mini"
            disabled={userSubscription !== "PREMIUM"}
          >
            {userSubscription !== "PREMIUM" && <Lock />} gpt-5-mini
          </SelectItem>
          <SelectItem
            value="gemini-3-flash-preview"
            disabled={userSubscription !== "PREMIUM"}
          >
            {userSubscription !== "PREMIUM" && <Lock />} gemini-3-flash-preview
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectModel;
