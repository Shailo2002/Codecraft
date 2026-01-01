// app/context/user-context.tsx
"use client";

import { createContext, useContext } from "react";
import type { UserType } from "@/types";

const UserContext = createContext<UserType | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: UserType;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUserOptional() {
  return useContext(UserContext);
}
