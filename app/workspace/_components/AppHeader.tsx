import { SidebarTrigger } from "@/components/ui/sidebar";
import { getCurrentDbUser } from "@/lib/getCurrentDbUser";
import { UserButton } from "@clerk/nextjs";

async function AppHeader() {
  const user = await getCurrentDbUser();
  return (
    <div className="flex justify-between items-center p-4 shadow w-full">
      <SidebarTrigger />
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
    </div>
  );
}

export default AppHeader;
