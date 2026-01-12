"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import CopyTextButton from "@/app/playground/_components/CopyTextButton";
import { DialogTrigger } from "@radix-ui/react-dialog";

export function PromptDialog({ websitePrompt }: { websitePrompt: string }) {
  const [showShareDialog, setShowShareDialog] = useState(false);

  return (
    <>
      {/* share project dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogTrigger asChild>
          <Button
            variant={"default"}
            aria-label="Open menu"
            onSelect={() => setShowShareDialog(true)}
          >
            <MessageCircle className="mr-2 h-4 w-4" /> prompt
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Copy Website Prompt</DialogTitle>
            <DialogDescription>
              Anyone with this prompt can generate simillar project.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="pb-3">
            <Field>
              <FieldLabel htmlFor="share-link">Project link</FieldLabel>
              <div className="flex gap-2">
                <textarea
                  id="share-link"
                  value={websitePrompt}
                  readOnly
                  className="w-full h-32 md:h-56 p-4 border rounded-2xl focus:outline-none focus:ring-0 resize-none"
                />
              </div>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <CopyTextButton
              text={websitePrompt || "website prompt"}
              ButtonName={"Copy"}
              toastMessage={"prompt"}
            />

            <DialogClose asChild>
              <Button variant="default">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
