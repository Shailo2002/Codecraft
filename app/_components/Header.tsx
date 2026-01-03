"use client";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { UserType } from "@/types";

const menuOptions = [
  { name: "Pricing", path: "/pricing" },
  {
    name: "Contact Us",
    path: "/contact-us",
  },
];

function Header({user}: {user: UserType}) {
  return (
    <div className="flex justify-between items-center p-4 shadow-lg h-[10vh] ">
      {/* logo  */}
      <Image src={"/logo.svg"} alt="logo" width={140} height={140} />

      {/* menu options */}
      <div className="hidden md:block flex gap-2">
        {menuOptions.map((menu, key) => (
          <Button variant={"ghost"} key={key}>
            {menu?.name}
          </Button>
        ))}
      </div>

      {/* get started button */}
      {!user ? (
        <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
          <Button className="hover:cursor-pointer">Get Started</Button>
        </SignInButton>
      ) : (
        <Link href={"/workspace"}>
          <Button className="hover:cursor-pointer">Get Started</Button>
        </Link>
      )}
    </div>
  );
}

export default Header;
