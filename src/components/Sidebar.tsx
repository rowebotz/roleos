import React, { useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ROLE_OS_SECTIONS } from '@/data/schemas';
import { useProfileStore } from '@/store/useProfileStore';
import { CheckCircle2, Circle, Settings2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResetConfirmDialog } from './ResetConfirmDialog';
export function Sidebar() {
  const activeSectionId = useProfileStore(s => s.activeSectionId);
  const profile = useProfileStore(s => s.profile);
  const setActiveSection = useProfileStore(s => s.setActiveSection);
  const resetProfile = useProfileStore(s => s.resetProfile);
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const currentIndex = ROLE_OS_SECTIONS.findIndex(s => s.id === activeSectionId);
      const nextIndex = (currentIndex + 1) % ROLE_OS_SECTIONS.length;
      setActiveSection(ROLE_OS_SECTIONS[nextIndex].id);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const currentIndex = ROLE_OS_SECTIONS.findIndex(s => s.id === activeSectionId);
      const prevIndex = (currentIndex - 1 + ROLE_OS_SECTIONS.length) % ROLE_OS_SECTIONS.length;
      setActiveSection(ROLE_OS_SECTIONS[prevIndex].id);
    }
  }, [activeSectionId, setActiveSection]);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  return (
    <div className="flex flex-col h-full border-r bg-sidebar backdrop-blur-xl w-64" role="tablist" aria-label="Context Taxonomies">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Taxonomies</h2>
        <Settings2 className="w-3 h-3 text-muted-foreground" />
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {ROLE_OS_SECTIONS.map((section) => {
            const isCompleted = section.fields.every(f => !!profile[f.id]);
            const isActive = activeSectionId === section.id;
            return (
              <button
                key={section.id}
                id={`tab-${section.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${section.id}`}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 group focus:outline-none focus:ring-1 focus:ring-sidebar-ring/50",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-border shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent border border-transparent"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Circle className="w-4 h-4 opacity-20" />
                )}
                <span className="truncate">{section.title}</span>
                {isActive && (
                  <div className="ml-auto w-1 h-4 bg-sidebar-primary rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t border-border bg-sidebar/70 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Overall Signal</span>
            <span className="text-[10px] font-mono text-indigo-400">
              {Math.round((Object.keys(profile).length / ROLE_OS_SECTIONS.reduce((acc, s) => acc + s.fields.length, 0)) * 100)}%
            </span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-sidebar-primary transition-all duration-500"
              style={{ width: `${(Object.keys(profile).length / ROLE_OS_SECTIONS.reduce((acc, s) => acc + s.fields.length, 0)) * 100}%` }}
            />
          </div>
        </div>
        <ResetConfirmDialog onConfirm={resetProfile} />
      </div>
    </div>
  );
}