import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

function PlayGroundHeader({ onSave }: () => void) {
  return (
    <div className="flex justify-between items-center p-4 shadow">
      <Image src={"/logo.svg"} alt="logo" width={140} height={140} />
      <Button onClick={() => onSave()}>Save</Button>
    </div>
  );
}

export default PlayGroundHeader;
