import { getCurrentDbUser } from "@/lib/getCurrentDbUser";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import { UserType } from "@/types";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = (await getCurrentDbUser()) as UserType;
  if (user) {
    redirect("/workspace");
  }

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(125%_125%_at_50%_10%,var(--background)_40%,var(--primary)_100%)]">
      <Header user={user} />
      <Hero />
    </div>
  );
}
