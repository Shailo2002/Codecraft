import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/AppSidebar";
import AppHeader from "./_components/AppHeader";
import AppSidebarSkeleton from "./_components/AppSidebarSkeleton";
import { Suspense } from "react";
import AppSidebarServer from "./_components/AppSidebarServer";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Suspense fallback={<AppSidebarSkeleton />}>
        <AppSidebarServer />
      </Suspense>
      <main className="w-full">
        <AppHeader />
        {children}
      </main>
    </SidebarProvider>
  );
}
