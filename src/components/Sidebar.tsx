import React from 'react';
import { cn } from '@/lib/utils';
import { ROLE_OS_SECTIONS } from '@/data/schemas';
import { useProfileStore } from '@/store/useProfileStore';
import { CheckCircle2, Circle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
export function Sidebar() {
  const activeSectionId = useProfileStore(s => s.activeSectionId);
  const profile = useProfileStore(s => s.profile);
  const setActiveSection = useProfileStore(s => s.setActiveSection);
  return (
    <div className="flex flex-col h-full border-r bg-zinc-950/50 backdrop-blur-xl w-64">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-sm font-bold tracking-widest text-zinc-400 uppercase">Taxonomies</h2>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {ROLE_OS_SECTIONS.map((section) => {
            const isCompleted = section.fields.every(f => !!profile[f.id]);
            const isActive = activeSectionId === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 group",
                  isActive 
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_-3px_rgba(79,70,229,0.2)]" 
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Circle className="w-4 h-4 opacity-20" />
                )}
                <span className="truncate">{section.title}</span>
                {isActive && (
                  <div className="ml-auto w-1 h-4 bg-indigo-500 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t border-white/5 bg-zinc-950/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Overall Signal</span>
          <span className="text-[10px] font-mono text-indigo-400">
            {Math.round((Object.keys(profile).length / ROLE_OS_SECTIONS.reduce((acc, s) => acc + s.fields.length, 0)) * 100)}%
          </span>
        </div>
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${(Object.keys(profile).length / ROLE_OS_SECTIONS.reduce((acc, s) => acc + s.fields.length, 0)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}