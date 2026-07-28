import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ROLE_OS_SECTIONS, CORE_SECTIONS, BONUS_SECTIONS, Section } from '@/data/schemas';
import { useProfileStore } from '@/store/useProfileStore';
import { CheckCircle2, Circle, Settings2, ChevronDown, Sprout, Zap, Brain, Trophy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResetConfirmDialog } from './ResetConfirmDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const LEVELS = [
  { name: "Rookie", Icon: Sprout, color: "text-muted-foreground" },
  { name: "Operator", Icon: Zap, color: "text-brand" },
  { name: "Strategist", Icon: Brain, color: "text-amber-500" },
  { name: "Master Architect", Icon: Trophy, color: "text-emerald-500" },
] as const;

function countFilled(sections: Section[], profile: Record<string, string>) {
  return sections.reduce((acc, section) => acc + section.fields.filter(f => !!profile[f.id]?.trim()).length, 0);
}

function SectionRow({ section, isActive, onSelect }: { section: Section; isActive: boolean; onSelect: (id: string) => void }) {
  const profile = useProfileStore(s => s.profile);
  const filledCount = section.fields.filter(f => !!profile[f.id]?.trim()).length;
  const totalCount = section.fields.length;
  const isCompleted = filledCount === totalCount;
  const isPartial = filledCount > 0 && filledCount < totalCount;

  return (
    <button
      id={`tab-${section.id}`}
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${section.id}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => onSelect(section.id)}
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
}

export function Sidebar() {
  const activeSectionId = useProfileStore(s => s.activeSectionId);
  const profile = useProfileStore(s => s.profile);
  const setActiveSection = useProfileStore(s => s.setActiveSection);
  const resetProfile = useProfileStore(s => s.resetProfile);
  const [bonusOpen, setBonusOpen] = useState(false);

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

  // Auto-expand the bonus list once someone opens a bonus section directly (e.g. via resume banner or hotkeys).
  useEffect(() => {
    if (BONUS_SECTIONS.some(s => s.id === activeSectionId)) {
      setBonusOpen(true);
    }
  }, [activeSectionId]);

  const totalFields = ROLE_OS_SECTIONS.reduce((acc, s) => acc + s.fields.length, 0);
  const coreTotal = CORE_SECTIONS.reduce((acc, s) => acc + s.fields.length, 0);
  const coreFilled = countFilled(CORE_SECTIONS, profile);
  const bonusFilled = countFilled(BONUS_SECTIONS, profile);
  const filledFields = coreFilled + bonusFilled;
  const progressPercent = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

  const levelIndex = filledFields === totalFields ? 3 : bonusFilled > 0 ? 2 : coreFilled >= coreTotal ? 1 : 0;
  const level = LEVELS[levelIndex];

  const prevLevelIndex = useRef(levelIndex);
  useEffect(() => {
    if (levelIndex > prevLevelIndex.current) {
      if (levelIndex === 1) {
        toast.success("⚡ Quick Start complete!", { description: "Your core profile is ready — deploy it now, or keep going to level up." });
      } else if (levelIndex === 2) {
        toast.success("🧠 Leveled up: Strategist", { description: "Nice — extra depth makes your AI profile sharper." });
      } else if (levelIndex === 3) {
        toast.success("🏆 Master Architect unlocked!", { description: "Every section filled. This is as good as it gets." });
      }
    }
    prevLevelIndex.current = levelIndex;
  }, [levelIndex]);

  return (
    <nav className="flex flex-col h-full w-full md:w-64 md:border-r border-border bg-sidebar backdrop-blur-xl" aria-label="Taxonomy list">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Sections</h2>
        <Settings2 className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4" role="tablist" aria-orientation="vertical">
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 pt-1 pb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand/80">Quick Start</span>
              <span className="text-[10px] font-mono text-muted-foreground">{coreFilled}/{coreTotal}</span>
            </div>
            {CORE_SECTIONS.map(section => (
              <SectionRow key={section.id} section={section} isActive={activeSectionId === section.id} onSelect={setActiveSection} />
            ))}
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setBonusOpen(v => !v)}
              className="w-full flex items-center justify-between px-3 pt-1 pb-1 text-left"
              aria-expanded={bonusOpen}
              aria-controls="bonus-sections"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Level Up <span className="opacity-60 normal-case font-medium">(optional)</span>
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                {bonusFilled}/{BONUS_SECTIONS.length}
                <ChevronDown className={cn("w-3 h-3 transition-transform", bonusOpen && "rotate-180")} aria-hidden="true" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {bonusOpen && (
                <motion.div
                  id="bonus-sections"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  {BONUS_SECTIONS.map(section => (
                    <SectionRow key={section.id} section={section} isActive={activeSectionId === section.id} onSelect={setActiveSection} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border bg-sidebar/70 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-bold" aria-live="polite">
              <level.Icon className={cn("w-3.5 h-3.5", level.color)} aria-hidden="true" />
              <span className={level.color}>{level.name}</span>
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
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
            {coreFilled < coreTotal
              ? `${coreTotal - coreFilled} quick question${coreTotal - coreFilled === 1 ? '' : 's'} left to reach Operator`
              : progressPercent === 100
              ? "Full profile complete — nothing left to add"
              : "Core done — add bonus sections anytime to level up"}
          </p>
        </div>
        <ResetConfirmDialog onConfirm={resetProfile} />
      </div>
    </nav>
  );
}
