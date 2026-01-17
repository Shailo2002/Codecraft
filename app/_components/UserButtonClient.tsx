import dynamic from "next/dynamic";

export const UserButtonClient = dynamic(
  () => import("./MyUserButton"),
  { ssr: false }
);
