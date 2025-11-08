import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

function PlayGroundHeader() {
  return (
    <div className="flex justify-between items-center p-4 shadow">
      <Image src={"/logosymbol.svg"} alt="logo" width={36} height={36} />
      <Button>Save</Button>
    </div>
  );
}

export default PlayGroundHeader;
