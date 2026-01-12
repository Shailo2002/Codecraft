"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PaymentModel } from "./PaymentModel";
import { Project, UserType } from "@/types";
import { useState } from "react";
import { ProjectDialog } from "./ProjectDialog";
import { UserButtonClient } from "@/app/_components/UserButtonClient";
import { useUpgradeModal } from "../../../hooks/useUpgradeModal";

export function AppSidebar({
  projects,
  user,
}: {
  projects: Project[];
  user: UserType | null;
}) {
  const [currentHoverProject, setCurrentHoverProject] = useState<string | null>(
    null
  );
  const [position, setPosition] = useState("bottom");
  const upgrade = useUpgradeModal();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col gap-4 mx-2">
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={140}
            height={140}
            className="m-1"
          />
          {projects.length === 0 ? (
            <Button className="w-full">
              <Plus />
              New Project
            </Button>
          ) : null}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="p-2">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          {projects.length == 0 ? (
            <h2 className="px-2 text-sm text-gray-500">No Project Found</h2>
          ) : (
            <SidebarGroupContent>
              <SidebarMenu>
                {projects &&
                  projects?.map((item) => (
                    <div
                      key={item?.id}
                      onMouseEnter={() => setCurrentHoverProject(item?.id)}
                      onMouseLeave={() => setCurrentHoverProject(null)}
                      className="relative"
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link
                            href={`/playground/${item?.id}?frameId=${item?.frames[0]?.frameId}`}
                          >
                            <div className="flex items-center justify-between w-full">
                              {/* Project name */}
                              <span className="truncate max-w-[90%]">
                                {item?.projectName
                                  ? item?.projectName
                                  : item.frames[0]?.chatMessages[0]
                                      ?.chatMessage[0]?.content}
                              </span>

                              {/* Actions (right side) */}
                              <div
                                className="shrink-0 flex justify-end"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                              >
                                {item.id === currentHoverProject && (
                                  <ProjectDialog
                                    projectId={item?.id}
                                    projectName={
                                      item?.projectName ||
                                      item.frames[0]?.chatMessages[0]
                                        ?.chatMessage[0]?.content
                                    }
                                    deploymentUrl={item?.deploymentUrl}
                                  />
                                )}
                              </div>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </div>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex flex-col gap-4">
          <div className="p-3 border rounded-xl space-y-4 bg-secondary">
            <h2 className="flex justify-between items-center">
              Remaining Credits{" "}
              <span className="font-semibold text-lg">{user?.credits}</span>
            </h2>
            <Progress value={user?.credits} />
            {user?.plan === "FREE" ? (
              <Button className="w-full" onClick={upgrade.show}>
                Upgrade for Unlimited
              </Button>
            ) : null}
            {upgrade.modal}
          </div>

          <div className="flex px-2 items-center">
            <div
              className={`relative flex justify-center items-center size-10 rounded-full 
                ${
                  user?.plan === "PREMIUM"
                    ? "bg-linear-to-br from-neutral-700 to-neutral-900 ring-2 ring-amber-400 shadow-md"
                    : ""
                }`}
            >
              {/* WRAPPER DIV: Keeps the DOM structure stable */}
              <div className="flex items-center justify-center h-full w-full ">
                <UserButtonClient />
              </div>

              {user?.plan === "PREMIUM" && (
                <span className="absolute -bottom-1 -right-1 rounded-2xl px-1 bg-amber-400/90 border-2 border-neutral-900 text-[10px] pointer-events-none">
                  pro
                </span>
              )}
            </div>

            <Button variant={"ghost"}>Settings</Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
