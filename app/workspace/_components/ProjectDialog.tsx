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
import CopyTextButton from "@/app/playground/_components/CopyTextButton";
import { renameProject } from "@/app/actions/renameProject";
import toast from "react-hot-toast";
import deleteProject from "@/app/actions/deleteProject";
import { Spinner } from "@/components/ui/spinner";

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
    projectName || "projectName"
  );
  const [shareUrl, setShareUrl] = useState(deploymentUrl || undefined);
  const [loading, setLoading] = useState(false);

  const handleDeleteProject = async (id: string) => {
    setLoading(true);
    try {
      const response = await deleteProject({ projectId: id });
      if (response?.ok) {
        toast.success("Project deleted");
        setShowDeleteDialog(false);
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
      toast.error("Delete failed");
      console.log("error while deleting project : ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRenameProject = async ({
    projectId,
    newProjectName,
  }: {
    projectId: string;
    newProjectName: string;
  }) => {
    setLoading(true);
    try {
      const response = await renameProject({
        projectId: projectId,
        newProjectName: newProjectName,
      });
      if (response?.ok) {
        toast.success("Project renamed");
        setShowRenameDialog(false);
      }
    } catch (error) {
      toast.error("Rename failed");
      console.log("error while renaming project : ", error);
    } finally {
      setLoading(false);
    }
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
              disabled={!shareUrl}
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
              disabled={loading}
            >
              {loading ? <Spinner className="w-12.5" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* rename project dialog */}
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
                onFocus={(e) => e.target.select()}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button
              onClick={() => handleRenameProject({ projectId, newProjectName })}
              disabled={
                projectName?.trim() === newProjectName.trim() || loading
              }
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
                <CopyTextButton text={shareUrl || "Project not deployed yet"} />
              </div>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="default">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
