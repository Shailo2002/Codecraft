import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

function CopyTextButton({text}:{text:string}) {
    const handleCopy = async () => {
      try {
        const copyPromise = navigator.clipboard.writeText(text);

        await toast.promise(copyPromise, {
          loading: "Copying…",
          success: "Code copied",
          error: "Failed to copy code",
        });
      } catch (error) {
        console.error("Copy error:", error);
        toast.error("Unexpected error while copying");
      }
    };
  return (
    <Button onClick={handleCopy} variant="secondary">
      <Copy size={12} />
    </Button>
  );
}

export default CopyTextButton