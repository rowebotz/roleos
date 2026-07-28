import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Edit3, Eye, Share2 } from 'lucide-react';
import { useProfileStore } from '@/store/useProfileStore';
import { cn } from '@/lib/utils';
export function MobileNav() {
  const activeView = useProfileStore(s => s.activeMobileView);
  const setView = useProfileStore(s => s.setMobileView);
  const tabs = [
    { id: 'sidebar', label: 'Sections', icon: Layers, description: 'Navigate sections' },
    { id: 'engine', label: 'Edit', icon: Edit3, description: 'Edit context' },
    { id: 'preview', label: 'Preview', icon: Eye, description: 'View profile' },
    { id: 'export', label: 'Export', icon: Share2, description: 'Export options' },
  ] as const;
  return (
    <nav className="fixed bottom-4 left-4 right-4 h-16 bg-card/90 backdrop-blur-xl border border-border rounded-2xl flex items-center justify-around px-2 z-50 shadow-soft overflow-hidden" role="navigation" aria-label="Mobile workspace navigation">
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
              isActive ? "text-brand" : "text-muted-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabMobile"
                className="absolute inset-x-2 inset-y-0.5 bg-brand/10 rounded-xl"
                aria-hidden="true"
              />
            )}
            <tab.icon className="w-5 h-5" aria-hidden="true" />
            <span className="text-[11px] font-medium">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}