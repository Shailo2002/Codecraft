"use client";

import { useState } from "react";
import {
  EllipsisVertical,
  MoreHorizontalIcon,
  Pencil,
  Share,
  Trash2,
} from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProjectDialog() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [projectName, setProjectName] = useState("project 1");
  const [shareUrl, setShareUrl] = useState("https://lucide.dev/icons/share");

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" aria-label="Open menu" size="icon-sm">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-30" align="center">
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)}>
              <Trash2 /> Delete
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowRenameDialog(true)}>
              <Pencil />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowShareDialog(true)}>
              <Share /> Share
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this
              project and all of its data.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button variant="destructive" onClick={() => console.log("delete")}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>
              Enter a new name for this project.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="pb-3">
            <Field>
              <FieldLabel htmlFor="project-name">Project name</FieldLabel>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="My project"
                autoFocus
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button
              onClick={() => console.log("handle rename")}
              disabled={!projectName.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share project</DialogTitle>
            <DialogDescription>
              Anyone with this link can view the project.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="pb-3">
            <Field>
              <FieldLabel htmlFor="share-link">Project link</FieldLabel>
              <div className="flex gap-2">
                <Input id="share-link" value={shareUrl} readOnly />
                <Button
                  variant="outline"
                  onClick={() => console.log("handle copy link")}
                >
                  Copy
                </Button>
              </div>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
