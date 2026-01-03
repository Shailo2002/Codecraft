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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-[90vw] max-h-[70vh] lg:min-w-4xl lg:max-w-5xl overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-start items-center gap-2">
            Source Code
            <Button onClick={handleCopy} variant="secondary">
              <Copy size={12} />
            </Button>
          </DialogTitle>
          <DialogDescription>
            <div className="max-w-[86vw] pr-6 lg:max-w-[1000px] overflow-auto rounded-lg">
              <SyntaxHighlighter>{code}</SyntaxHighlighter>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
