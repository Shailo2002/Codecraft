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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import deleteProject from "@/app/actions/deleteProject";

export function ProjectDialog({
  projectId,
  projectName,
  deploymentUrl,
}: {
  projectId: string;
  projectName?: string;
  deploymentUrl?: string;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newProjectName, setnewProjectName] = useState(
    projectName || "project 1"
  );
  const [shareUrl, setShareUrl] = useState(deploymentUrl || undefined);

  const handleDeleteProject = async (id: string) => {
    const response = await deleteProject(id);
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" aria-label="Open menu" size="icon-sm">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-30" align="center" side="right">
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setShowRenameDialog(true)}>
              <Pencil />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setShowShareDialog(true)}
              disabled
            >
              <Share /> Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => setShowDeleteDialog(true)}
              className="text-red-500"
            >
              <Trash2 className="text-red-500" /> Delete
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

            <Button
              variant="destructive"
              onClick={() => handleDeleteProject(projectId)}
            >
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
                value={newProjectName}
                onChange={(e) => setnewProjectName(e.target.value)}
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
              disabled={!projectName?.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* share project dialog */}
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
                <Input
                  id="share-link"
                  value={
                    shareUrl === undefined
                      ? "Project not deployed yet"
                      : shareUrl
                  }
                  readOnly
                />
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
