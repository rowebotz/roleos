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
    const activeElement = document.activeElement;
    const isInput = activeElement instanceof HTMLTextAreaElement ||
                    activeElement instanceof HTMLInputElement;
    if (isInput) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const currentIndex = ROLE_OS_SECTIONS.findIndex(s => s.id === activeSectionId);
      const nextIndex = (currentIndex + 1) % ROLE_OS_SECTIONS.length;
      setActiveSection(ROLE_OS_SECTIONS[nextIndex].id);
      document.getElementById(`tab-${ROLE_OS_SECTIONS[nextIndex].id}`)?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const currentIndex = ROLE_OS_SECTIONS.findIndex(s => s.id === activeSectionId);
      const prevIndex = (currentIndex - 1 + ROLE_OS_SECTIONS.length) % ROLE_OS_SECTIONS.length;
      setActiveSection(ROLE_OS_SECTIONS[prevIndex].id);
      document.getElementById(`tab-${ROLE_OS_SECTIONS[prevIndex].id}`)?.focus();
    }
  }, [activeSectionId, setActiveSection]);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  const totalFields = ROLE_OS_SECTIONS.reduce((acc, s) => acc + s.fields.length, 0);
  const filledFields = ROLE_OS_SECTIONS.reduce((acc, section) => {
    const sectionFilledCount = section.fields.filter(f => !!profile[f.id]?.trim()).length;
    return acc + sectionFilledCount;
  }, 0);
  const progressPercent = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  return (
    <nav className="flex flex-col h-full border-r bg-sidebar backdrop-blur-xl w-64" aria-label="Taxonomy list">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Taxonomies</h2>
        <Settings2 className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1" role="tablist" aria-orientation="vertical">
          {ROLE_OS_SECTIONS.map((section) => {
            const isCompleted = section.fields.every(f => !!profile[f.id]?.trim());
            const isActive = activeSectionId === section.id;
            return (
              <button
                key={section.id}
                id={`tab-${section.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${section.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:ring-offset-2 focus:ring-offset-sidebar",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-border shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent border border-transparent"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-label="Completed" />
                ) : (
                  <Circle className="w-4 h-4 opacity-20" aria-hidden="true" />
                )}
                <span className="truncate">{section.title}</span>
                {isActive && (
                  <div className="ml-auto w-1 h-4 bg-sidebar-primary-foreground/30 rounded-full animate-pulse" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border bg-sidebar/70 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">System Signal</span>
            <span className="text-[10px] font-mono text-brand font-bold" aria-live="polite">
              {progressPercent}%
            </span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Overall profile completion">
            <div
              className="h-full bg-brand transition-all duration-500 shadow-[0_0_8px_rgba(48,67,180,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <ResetConfirmDialog onConfirm={resetProfile} />
      </div>
    </nav>
  );
}