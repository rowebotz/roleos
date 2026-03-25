import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Edit3, Terminal, Share2 } from 'lucide-react';
import { useProfileStore } from '@/store/useProfileStore';
import { cn } from '@/lib/utils';
export function MobileNav() {
  const activeView = useProfileStore(s => s.activeMobileView);
  const setView = useProfileStore(s => s.setMobileView);
  const tabs = [
    { id: 'sidebar', label: 'Taxonomies', icon: Layers },
    { id: 'engine', label: 'Engine', icon: Edit3 },
    { id: 'preview', label: 'Output', icon: Terminal },
    { id: 'export', label: 'Deploy', icon: Share2 },
  ] as const;
  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-4 left-4 right-4 h-16 bg-card/70 backdrop-blur-xl border-border rounded-2xl flex items-center justify-around px-2 z-50 shadow-2xl overflow-hidden"
    >
      {tabs.map((tab) => {
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={cn(
              "relative flex flex-col items-center gap-1 flex-1 py-1 transition-all duration-300",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-x-2 inset-y-0.5 bg-primary/20 rounded-xl"
              />
            )}
            <tab.icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              {tab.label}
            </span>
          </button>
        );
      })}
    </motion.nav>
  );
}