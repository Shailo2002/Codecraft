import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

export function ViewCodeBlock({ children, code }: any) {
  const handleCopy = async () => {
    try {
      const copyPromise = navigator.clipboard.writeText(code);

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
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="min-w-5xl max-h-[600px] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-start items-center gap-2">
            Source Code{" "}
            <Button onClick={() => handleCopy()} variant={"secondary"}>
              <Copy size={16} />
            </Button>
          </DialogTitle>
          <DialogDescription>
            <div>
              <SyntaxHighlighter>{code}</SyntaxHighlighter>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
