import { getCurrentDbUser } from "@/lib/getCurrentDbUser";
import { AppSidebar } from "./AppSidebar";
import getProjects from "@/lib/getProjects";

async function AppSidebarServer() {
  const user = await getCurrentDbUser();
  const projects = await getProjects();
  console.log("sideBar user : ", user);
  console.log("sideBar project list : ", projects);
  return (
      <AppSidebar user={user} projects={projects} />
  );
}

export default AppSidebarServer;
