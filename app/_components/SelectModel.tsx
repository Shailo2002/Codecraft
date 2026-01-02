import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  model: string;
  handleSetModel: (value: string) => void;
};

function SelectModel({ model, handleSetModel }: Props) {
  return (
    <Select value={model} onValueChange={(value) => handleSetModel(value)}>
      <SelectTrigger
        className="w-[120px]  border-none shadow-none ring-0 outline-none
    focus:border-none focus:shadow-none focus:ring-0 focus:outline-none
    hover:border-none hover:shadow-none hover:ring-0 hover:outline-none
    active:border-none active:shadow-none active:ring-0 active:outline-none"
      >
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>model</SelectLabel>
          <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
          <SelectItem value="gemini-2.5-flash">gemini-2.5-flash</SelectItem>
          <SelectItem value="gpt-5.2">gpt-5.2</SelectItem>
          <SelectItem value="gemini-3-pro-preview">
            gemini-3-pro-preview
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectModel;
