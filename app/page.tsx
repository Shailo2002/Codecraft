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
    <div>
      <Header user={user} />
      <Hero />
    </div>
  );
}
