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
    <nav className="flex flex-col h-full w-full md:w-64 md:border-r border-border bg-sidebar backdrop-blur-xl" aria-label="Taxonomy list">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Sections</h2>
        <Settings2 className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1" role="tablist" aria-orientation="vertical">
          {ROLE_OS_SECTIONS.map((section) => {
            const filledCount = section.fields.filter(f => !!profile[f.id]?.trim()).length;
            const totalCount = section.fields.length;
            const isCompleted = filledCount === totalCount;
            const isPartial = filledCount > 0 && filledCount < totalCount;
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
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-label="Completed" />
                ) : isPartial ? (
                  <div className="w-4 h-4 shrink-0 relative flex items-center justify-center" aria-label="In progress">
                    <Circle className="w-4 h-4 text-amber-400" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    </div>
                  </div>
                ) : (
                  <Circle className="w-4 h-4 opacity-20 shrink-0" aria-hidden="true" />
                )}
                <span className="truncate flex-1">{section.title}</span>
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
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Profile Completion</span>
            <span className="text-[10px] font-mono text-brand font-bold" aria-live="polite">
              {filledFields}/{totalFields} filled
            </span>
          </div>
          <div
            className="h-2 bg-muted rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall profile completion"
          >
            <div
              className={cn(
                "h-full transition-all duration-500",
                progressPercent === 100
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  : progressPercent > 50
                  ? "bg-brand shadow-[0_0_8px_rgba(48,67,180,0.5)]"
                  : "bg-brand/70"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {progressPercent === 0
              ? "Start filling sections to build your profile"
              : progressPercent === 100
              ? "Profile complete — ready to deploy!"
              : `${progressPercent}% complete`}
          </p>
        </div>
        <ResetConfirmDialog onConfirm={resetProfile} />
      </div>
    </nav>
  );
}
