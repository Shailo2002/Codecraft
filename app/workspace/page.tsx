import React from "react";
import Hero from "../_components/Hero";
import { getCurrentDbUser } from "@/lib/getCurrentDbUser";
import { UserType } from "@/types";

async function page() {
  const user = (await getCurrentDbUser()) as UserType;

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(125%_125%_at_50%_10%,var(--background)_40%,var(--primary)_100%)]">
      <Hero user={user} />
    </div>
  );
}

export default page;
