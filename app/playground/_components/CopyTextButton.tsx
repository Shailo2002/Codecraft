import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

function CopyTextButton({
  text,
  ButtonName,
  toastMessage,
}: {
  text: string;
  ButtonName?: string;
  toastMessage?: string;
}) {
  const handleCopy = async () => {
    try {
      const copyPromise = navigator.clipboard.writeText(text);

      await toast.promise(copyPromise, {
        loading: "Copying…",
        success: toastMessage ? `${toastMessage} copied` : "Code copied",
        error: toastMessage
          ? `Failed to copy ${toastMessage}`
          : "Failed to copy code",
      });
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Unexpected error while copying");
    }
  };
  return (
    <Button onClick={handleCopy} variant="secondary">
      <Copy size={12} /> {ButtonName}
    </Button>
  );
}

export default CopyTextButton;
