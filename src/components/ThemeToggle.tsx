import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      className="relative h-10 w-10 bg-card border-border hover:border-ring/40 text-muted-foreground hover:text-foreground transition-all active:scale-90 focus:ring-ring ring-offset-background ring-2 focus:ring-2"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Moon className="h-4 w-4 text-indigo-400" />
            <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Sun className="h-4 w-4 text-amber-500" />
            <div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}