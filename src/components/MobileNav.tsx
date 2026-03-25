import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Edit3, Terminal, Share2 } from 'lucide-react';
import { useProfileStore } from '@/store/useProfileStore';
import { cn } from '@/lib/utils';
export function MobileNav() {
  const activeView = useProfileStore(s => s.activeMobileView);
  const setView = useProfileStore(s => s.setMobileView);
  const tabs = [
    { id: 'sidebar', label: 'Taxonomy', icon: Layers, description: 'Navigate sections' },
    { id: 'engine', label: 'Engine', icon: Edit3, description: 'Edit context' },
    { id: 'preview', label: 'Output', icon: Terminal, description: 'View profile' },
    { id: 'export', label: 'Deploy', icon: Share2, description: 'Export options' },
  ] as const;
  return (
    <nav className="fixed bottom-4 left-4 right-4 h-16 bg-card/80 backdrop-blur-xl border border-border rounded-2xl flex items-center justify-around px-2 z-50 shadow-2xl overflow-hidden" role="navigation" aria-label="Mobile workspace navigation">
      {tabs.map((tab) => {
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            aria-label={`Switch to ${tab.label} view`}
            aria-pressed={isActive}
            className={cn(
              "relative flex flex-col items-center gap-1 flex-1 py-1 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabMobile"
                className="absolute inset-x-2 inset-y-0.5 bg-primary/10 rounded-xl"
                aria-hidden="true"
              />
            )}
            <tab.icon className={cn("w-5 h-5", isActive && "animate-pulse")} aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}