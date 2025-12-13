import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function PlayGroundHeader({
  onSave,
  loading,
}: {
  onSave: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex justify-between items-center p-4 shadow">
      <Link href={"/workspace"}>
        {" "}
        <Image src={"/logo.svg"} alt="logo" width={140} height={140} />
      </Link>
      <Button onClick={() => onSave()} disabled={loading} className="min-w-16">
        {loading ? <Spinner /> : "Save"}
      </Button>
    </div>
  );
}

export default PlayGroundHeader;
