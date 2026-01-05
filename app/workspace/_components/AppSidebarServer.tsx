import { getCurrentDbUser } from "@/lib/getCurrentDbUser";
import { AppSidebar } from "./AppSidebar";
import { getProjects } from "@/lib/getProjects";

async function AppSidebarServer() {
const [user, projects] = await Promise.all([getCurrentDbUser(), getProjects()]);
  return (
      <AppSidebar user={user} projects={projects} />
  );
}

export default AppSidebarServer;
