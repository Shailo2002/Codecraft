import Hero from "../_components/Hero";
import { getCurrentDbUser } from "@/lib/getCurrentDbUser";
import { UserType } from "@/types";

async function page() {
  const user = (await getCurrentDbUser()) as UserType;

  return (
    <div className="relative overflow-hidden w-full">
      <Hero user={user} />
    </div>
  );
}

export default page;
