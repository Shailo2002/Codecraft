import React from "react";
import Hero from "../_components/Hero";
import { getCurrentDbUser } from "@/lib/getCurrentDbUser";
import { UserType } from "@/types";

async function page() {
  const user = (await getCurrentDbUser()) as UserType;

  return (
    <div>
      <Hero user={user} />
    </div>
  );
}

export default page;
