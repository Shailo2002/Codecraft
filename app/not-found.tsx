"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        404 – Page Not Found
      </h1>

      <p className="mt-3 text-muted-foreground">
        The route you entered is invalid or does not exist.
      </p>

      <Button className="mt-6" onClick={() => router.push("/")}>
        Go to Home
      </Button>
    </div>
  );
}
