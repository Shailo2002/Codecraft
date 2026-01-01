import { getCurrentDbUser } from "@/lib/getCurrentDbUser";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import { UserType } from "@/types";

export default async function Home() {
  const user = (await getCurrentDbUser()) as UserType;

  return (
    <div>
      <Header user={user} />
      <Hero />
    </div>
  );
}
