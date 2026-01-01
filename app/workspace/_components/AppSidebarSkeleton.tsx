import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function AppSidebarSkeleton() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col gap-4 mx-2">
          <Image
            src="/logo.svg"
            alt="logo"
            width={140}
            height={140}
            className="m-1"
          />

          {/* New Project button */}
          <Skeleton className="h-10 w-full rounded-md bg-slate-200" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="p-2">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>

          <SidebarGroupContent>
            <div className="space-y-2 mx-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-7 w-full rounded-md bg-slate-200"
                />
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex flex-col gap-4">
          <div className="p-3 border rounded-xl space-y-4 bg-secondary">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32 bg-slate-200" />
              <Skeleton className="h-6 w-8 bg-slate-200" />
            </div>

            <Skeleton className="h-3 w-full rounded-full bg-slate-200" />

            <Skeleton className="h-10 w-full rounded-md bg-slate-200" />
          </div>

          <div className="flex px-2 items-center gap-3">
            <div className="relative">
              <Skeleton className="h-10 w-10 rounded-full bg-slate-200" />
            </div>

            <Skeleton className="h-6 w-20 bg-slate-200" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
