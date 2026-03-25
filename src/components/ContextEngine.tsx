import React, { useState, useEffect, useCallback } from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { ROLE_OS_SECTIONS, Section, Field } from '@/data/schemas';
import { useContextDensity } from '@/hooks/useContextDensity';
import { expandThought } from '@/data/expansionTemplates';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertTriangle, ChevronRight, History, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntroHero } from '@/components/IntroHero';
import { useHotkeys } from 'react-hotkeys-hook';
export function ContextEngine() {
  const activeId = useProfileStore(s => s.activeSectionId);
  const profile = useProfileStore(s => s.profile);
  const hasDismissedIntro = useProfileStore(s => s.hasDismissedIntro);
  const hasDismissedResumeBanner = useProfileStore(s => s.hasDismissedResumeBanner);
  const updateField = useProfileStore(s => s.updateField);
  const dismissIntro = useProfileStore(s => s.dismissIntro);
  const setDismissedResumeBanner = useProfileStore(s => s.setDismissedResumeBanner);
  const setActiveSection = useProfileStore(s => s.setActiveSection);
  const section = ROLE_OS_SECTIONS.find(s => s.id === activeId);
  const [expandingField, setExpandingField] = useState<string | null>(null);
  const profileSize = Object.keys(profile).length;
  const totalFields = ROLE_OS_SECTIONS.reduce((acc, s) => acc + s.fields.length, 0);
  const isProfilePartial = profileSize > 0 && profileSize < totalFields;
  const showIntro = !hasDismissedIntro && profileSize === 0;
  const showResumeBanner = isProfilePartial && !hasDismissedResumeBanner;
  useHotkeys('esc', () => setExpandingField(null), { enableOnFormTags: true });
  const handleResume = useCallback(() => {
    const firstIncomplete = ROLE_OS_SECTIONS.find(s =>
      s.fields.some(f => !profile[f.id])
    );
    if (firstIncomplete) {
      setActiveSection(firstIncomplete.id);
    }
    setDismissedResumeBanner(true);
  }, [profile, setActiveSection, setDismissedResumeBanner]);
  if (!section) return null;
  return (
    <div className="max-w-2xl mx-auto space-y-10 py-10" id={`panel-${activeId}`} role="tabpanel" aria-labelledby={`tab-${activeId}`}>
      <AnimatePresence>
        {showIntro && <IntroHero onDismiss={dismissIntro} />}
        {showResumeBanner && !showIntro && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 border border-white/20 shadow-glow text-white"
            role="alert"
          >
            <div className="flex items-center gap-3">
              <History className="w-4 h-4 text-white" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-widest">Resume session?</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                onClick={handleResume} 
                className="h-7 px-3 text-[10px] bg-white/20 hover:bg-white/30 text-white border border-white/20 font-bold uppercase tracking-widest transition-colors"
              >
                Jump to task
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setDismissedResumeBanner(true)} 
                className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Dismiss banner</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{section.title}</h1>
        <p className="text-muted-foreground leading-relaxed">{section.description}</p>
      </header>
      <div className="space-y-12 pb-20">
        {section.fields.map((field, index) => (
          <FieldGroup
            key={field.id}
            field={field}
            initialValue={profile[field.id] || ''}
            patterns={section.lowSignalPatterns}
            onUpdate={(val: string) => updateField(field.id, val)}
            isExpanding={expandingField === field.id}
            setExpanding={(val: boolean) => setExpandingField(val ? field.id : null)}
            isLast={index === section.fields.length - 1}
            section={section}
          />
        ))}
      </div>
    </div>
  );
}
interface FieldGroupProps {
  field: Field;
  initialValue: string;
  patterns: string[];
  onUpdate: (val: string) => void;
  isExpanding: boolean;
  setExpanding: (val: boolean) => void;
  isLast: boolean;
  section: Section;
}
function FieldGroup({ field, initialValue, patterns, onUpdate, isExpanding, setExpanding, isLast, section }: FieldGroupProps) {
  const [localValue, setLocalValue] = useState(initialValue);
  const setActiveSection = useProfileStore(s => s.setActiveSection);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate(localValue);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [localValue, onUpdate]);
  const { score, flags } = useContextDensity(localValue, patterns);
  useEffect(() => {
    if (score >= 70 && !hasCelebrated) {
      setHasCelebrated(true);
    } else if (score < 60) {
      setHasCelebrated(false);
    }
  }, [score, hasCelebrated]);
  const variations = expandThought(localValue);
  const scoreColor = score > 70 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : score > 40 ? "bg-amber-500" : "bg-rose-500";
  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (isLast) {
        const nextSecIndex = ROLE_OS_SECTIONS.findIndex(s => s.id === section.id) + 1;
        if (nextSecIndex < ROLE_OS_SECTIONS.length) {
          setActiveSection(ROLE_OS_SECTIONS[nextSecIndex].id);
        }
      } else {
        const parent = (e.target as HTMLElement).closest('div.space-y-12');
        const textareas = Array.from(parent?.querySelectorAll('textarea') || []);
        const nextIdx = textareas.indexOf(e.target as HTMLTextAreaElement) + 1;
        if (nextIdx < textareas.length) {
          (textareas[nextIdx] as HTMLElement).focus();
        }
      }
    }
  };
  return (
    <section className="space-y-4" aria-labelledby={`label-${field.id}`}>
      <div className="flex items-end justify-between">
        <label id={`label-${field.id}`} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{field.label}</label>
        <div className="flex items-center gap-2" aria-live="polite">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">Signal: {score}%</span>
          <div className="w-24 h-1 bg-muted/20 rounded-full overflow-hidden relative" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
            <motion.div
              className={`h-full transition-colors duration-500 ${scoreColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
        </div>
      </div>
      <div className="relative group">
        <Textarea
          id={field.id}
          aria-label={field.label}
          placeholder={field.placeholder}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleEnter}
          className="min-h-[120px] bg-card border-border text-foreground placeholder:text-muted-foreground/80 group-hover:border-border/75 focus:ring-ring focus:ring-offset-2 resize-none transition-all duration-300 focus:border-primary/50"
        />
        <AnimatePresence>
          {score >= 70 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-2 -right-2 z-20"
              role="status"
            >
              <div className="bg-emerald-500 rounded-full p-1 shadow-glow border border-emerald-400/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-50" />
                <span className="sr-only">High signal density achieved</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {flags.length > 0 && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500/80 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20" role="alert">
              <AlertTriangle className="w-3 h-3" aria-hidden="true" />
              Low Signal Detected
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanding(!isExpanding)}
            aria-expanded={isExpanding}
            aria-controls={`variations-${field.id}`}
            className="h-8 gap-2 bg-muted hover:bg-primary text-muted-foreground hover:text-foreground border-border transition-all duration-200"
          >
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            <span className="text-xs">Expand</span>
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanding && (
          <motion.div
            id={`variations-${field.id}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden space-y-2 pt-2"
          >
            {Object.entries(variations).map(([key, val]) => (
              <button
                key={key}
                onClick={() => {
                  setLocalValue(val as string);
                  onUpdate(val as string);
                  setExpanding(false);
                }}
                className="w-full text-left p-3 rounded-md bg-muted/50 border border-border hover:border-primary/40 hover:bg-primary/10 transition-all group relative focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">{key}</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </div>
                <p className="text-sm text-muted-foreground group-hover:text-foreground line-clamp-2">{val as string}</p>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}