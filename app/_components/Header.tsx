"use client";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { UserType } from "@/types";
import { ModeToggle } from "./mode-toggle";

const menuOptions = [
  { name: "terms", path: "/terms" },
  { name: "privacy", path: "/privacy" },
  { name: "refund", path: "/refund" },
  {
    name: "Contact Us",
    path: "/contact",
  },
];

function Header({ user }: { user: UserType }) {
  return (
    <div className="top-0 left-0 flex justify-between items-center p-4 shadow-lg h-[8vh] bg-opacity-0 ">
      {/* logo  */}
      <Image
        src={"/logo_dark.svg"}
        alt="logo"
        width={140}
        height={140}
        className="hidden dark:block"
      />
      <Image
        src={"/logo.svg"}
        alt="logo"
        width={140}
        height={140}
        className="block dark:hidden"
      />

      {/* menu options */}
      <div className="hidden md:block flex gap-2">
        {menuOptions.map((menu, key) => (
          <Button variant="ghost" key={key} asChild>
            <Link href={menu?.path}>{menu?.name}</Link>
          </Button>
        ))}
      </div>

      {/* get started button */}
      <div className="flex justify-center items-center gap-4">
        {" "}
        <div>
          <ModeToggle />
        </div>
        {!user ? (
          <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
            <Button className="hover:cursor-pointer" variant={"default"}>
              Get Started
            </Button>
          </SignInButton>
        ) : (
          <Link href={"/workspace"}>
            <Button className="hover:cursor-pointer">Get Started</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
