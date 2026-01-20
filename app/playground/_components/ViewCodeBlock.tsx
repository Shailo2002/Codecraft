import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CopyTextButton from "./CopyTextButton";

import dynamic from "next/dynamic";

const SyntaxHighlighter = dynamic(() => import("@/lib/syntax-highlighter"), {
  ssr: false,
});

export function ViewCodeBlock({ children, code }: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-[90vw] max-h-[70vh] lg:min-w-4xl lg:max-w-5xl overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-start items-center gap-2">
            Source Code
            <CopyTextButton text={code} />
          </DialogTitle>
          <DialogDescription>
            <div className="max-w-[86vw] pr-6 lg:max-w-[1000px] overflow-auto rounded-lg ">
              <SyntaxHighlighter language="html" wrapLongLines>
                {code}
              </SyntaxHighlighter>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
