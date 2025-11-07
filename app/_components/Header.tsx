"use client"
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import React, { useContext } from "react";
import { UserDetailContext } from "../context/UserDetailContext";

const menuOptions = [
    {name: "Pricing", path:"/pricing"},{
        name:"Contact Us", path:"/contact-us"
    }
]

function Header() {
  const user = useContext(UserDetailContext);
  return (
    <div className="flex justify-between items-center p-4 shadow-lg">
      {/* logo  */}
      <Image src={"/logo.svg"} alt="logo" width={140} height={140} />

      {/* menu options */}
      <div className="flex gap-2">
        {menuOptions.map((menu, key) => (
          <Button variant={"ghost"} key={key}>
            {menu?.name}
          </Button>
        ))}
      </div>

      {/* get started button */}
      {!user ? (
        <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
          <Button>Get Started</Button>
        </SignInButton>
      ) : (
        <Link href={"/workspace"}>
          <Button>Get Started</Button>
        </Link>
      )}
    </div>
  );
}

export default Header;
