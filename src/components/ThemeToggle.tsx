import React from 'react';
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all active:scale-95"
      aria-label="Toggle theme"
    >
      <Sun className={`h-4 w-4 transition-all ${isDark ? 'scale-0 rotate-90' : 'scale-100 rotate-0'}`} />
      <Moon className={`absolute h-4 w-4 transition-all ${isDark ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`} />
    </Button>
  );
}