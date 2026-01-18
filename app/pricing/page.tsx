import { ArrowLeft, ShieldCheck } from "lucide-react";
import PricingDisplay from "../_components/PricingSection";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[100vh] w-full p-4">
      <div className="w-full justify-center items-center max-w-5xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full max-h-[85vh]">
        <div className="relative flex-1 justify-center items-center text-sm md:text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
          <div className="absolute right-6 top-6 bg-neutral-800 rounded">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <PricingDisplay />
        </div>
      </div>
    </div>
  );
}
