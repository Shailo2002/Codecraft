import { getCurrentDbUser } from "@/lib/getCurrentDbUser";
import { AppSidebar } from "./AppSidebar";
import { getProjects } from "@/lib/getProjects";
import { Project } from "@/types";
import { getPaymentDetails } from "@/lib/getPaymentDetails";
import { Payment } from "@/types/payment";

async function AppSidebarServer() {
  const [user, projects, payments] = await Promise.all([
    getCurrentDbUser(),
    getProjects(),
    getPaymentDetails(),
  ]);

  return (
    <AppSidebar
      user={user}
      projects={(projects || []) as unknown as Project[]}
      payments={(payments || []) as unknown as Payment[]}
    />
  );
}

export default AppSidebarServer;
