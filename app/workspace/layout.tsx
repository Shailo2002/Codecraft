import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/AppSidebar";
import AppHeader from "./_components/AppHeader";
import { getCurrentDbUser } from "@/lib/getCurrentDbUser";
import type { UserType } from "@/types";
import { UserProvider } from "@/app/context/user-context";
import getProjects from "@/lib/getProjects";
import AppSidebarSkeleton from "./_components/AppSidebarSkeleton";
import { Suspense } from "react";
import AppSidebarServer from "./_components/AppSidebarServer";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = (await getCurrentDbUser()) as UserType;
  const projects = await getProjects();
  return (
    <UserProvider user={user}>
      <SidebarProvider>
        <Suspense fallback={<AppSidebarSkeleton />}>
          <AppSidebarServer />
        </Suspense>
        <main className="w-full">
          <AppHeader />
          {children}
        </main>
      </SidebarProvider>
    </UserProvider>
  );
}
