"use client";
import { UserDetailContext } from "@/app/context/UserDetailContext";
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
import { Skeleton } from "@/components/ui/skeleton";
import { UserButton } from "@clerk/nextjs";
import axios from "axios";
import { Home, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { PaymentModel } from "./PaymentModel";

export function AppSidebar() {
  const [projectList, setProjectList] = useState([]);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);

  const handleGetProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/projects");
      console.log("response : ", response?.data);
      setProjectList(response?.data);
    } catch (error) {
      console.log("error : ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetProjects();
  }, []);

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
          {loading ? (
            <div className="space-y-2 mx-2">
              {" "}
              {Array.from({ length: 5 }).map((item) => (
                <Skeleton className="h-7 w-full bg-slate-200" />
              ))}
            </div>
          ) : projectList.length == 0 ? (
            <h2 className="px-2 text-sm text-gray-500">No Project Found</h2>
          ) : (
            <SidebarGroupContent>
              <SidebarMenu>
                {projectList?.map((item) => (
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
              <span className="font-semibold text-lg">
                {userDetail?.credits}
              </span>
            </h2>
            <Progress value={33} />
            <PaymentModel>
             
              <Button className="w-full">Upgrade for Unlimited</Button>
            </PaymentModel>
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
