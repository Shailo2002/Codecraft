import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

const menuOptions = [
    {name: "Pricing", path:"/pricing"},{
        name:"Contact Us", path:"/contact-us"
    }
]

function Header() {
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
      <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
        <Button>Get Started</Button>
      </SignInButton>
    </div>
  );
}

export default Header;
