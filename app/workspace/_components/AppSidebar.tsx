"use client"
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";

export function AppSidebar() {
  const [projectList, setProjectList] = useState([])
  const {userDetail, setUserDetail} = useContext(UserDetailContext)
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
          <Button className="w-full">
            <Plus />
            New Project
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="p-2">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          {projectList.length == 0 && <h2 className="px-2 text-sm text-gray-500">No Project Found</h2>}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex flex-col gap-4">
          <div className="p-3 border rounded-xl space-y-4 bg-secondary">
            <h2 className="flex justify-between items-center">Remaining Credits <span className="font-semibold text-lg">{userDetail?.credits}</span></h2>
            <Progress value={33}/>
            <Button className="w-full">Upgrade for Unlimited</Button>
          </div>

          <div className="flex px-2 items-center">
            <UserButton /> 
            <Button variant={"ghost"}>Settings</Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
