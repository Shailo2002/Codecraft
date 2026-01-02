import { getCurrentDbUser } from "@/lib/getCurrentDbUser";
import { AppSidebar } from "./AppSidebar";
import { getProjects } from "@/lib/getProjects";

async function AppSidebarServer() {
  const user = await getCurrentDbUser();
  const projects = await getProjects();
  return (
      <AppSidebar user={user} projects={projects} />
  );
}

export default AppSidebarServer;
