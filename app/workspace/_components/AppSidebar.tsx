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

export function AppSidebar({
  projects,
  user,
}: {
  projects: Project[];
  user: UserType;
}) {
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
          {projects.length === 0 ? 
          <Button className="w-full">
            <Plus />
            New Project
          </Button> : null}
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
                    <SidebarMenuItem key={item?.id}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={`/playground/${item?.id}?frameId=${item?.frames[0]?.frameId}`}
                        >
                          <span>
                            {
                              item?.frames[0]?.chatMessages[0]?.chatMessage[0]
                                .content
                            }
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
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
              <PaymentModel>
                <Button className="w-full">Upgrade for Unlimited</Button>
              </PaymentModel>
            ) : null}
          </div>

          <div className="flex px-2 items-center">
            {user?.plan === "PREMIUM" ? (
              <div
                className="relative flex justify-center items-center size-10 rounded-full 
                bg-gradient-to-br from-neutral-700 to-neutral-900
                ring-2 ring-amber-400 shadow-md"
              >
                <UserButton />
                <span className="absolute -bottom-1 -right-1 rounded-2xl px-1  bg-amber-400/90 border-2 border-neutral-900 text-[10px]">
                  pro
                </span>
              </div>
            ) : (
              <UserButton />
            )}

            <Button variant={"ghost"}>Settings</Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
