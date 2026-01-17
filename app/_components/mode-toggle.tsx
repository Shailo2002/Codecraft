"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();

  const handleChangeTheme = () => {
    if (theme === "dark" || resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="
        relative 
        h-9 w-9 rounded-full 
        transition-all duration-500 ease-in-out
        focus:outline-none focus:ring-0
        
        /* Light Mode Styles: Semi-transparent white with a subtle white border */
        bg-white/40 border border-white/60 
        hover:bg-white/60 shadow-sm
        text-amber-500

        /* Dark Mode Styles: Deep semi-transparent navy (matches your #1a1a2e) */
        dark:bg-[#1a1a2e]/40 dark:border-white/10 
        dark:hover:bg-[#1a1a2e]/60 dark:shadow-md
        dark:text-[#fe49ab] 
      "
      onClick={handleChangeTheme}
    >
      <Sun
        className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0"
        strokeWidth={2}
      />

      <Moon
        className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100"
        strokeWidth={2}
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
