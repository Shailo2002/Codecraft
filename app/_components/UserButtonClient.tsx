import dynamic from "next/dynamic";

export const UserButtonClient = dynamic(
  () => import("@clerk/nextjs").then((m) => m.UserButton),
  { ssr: false }
);
