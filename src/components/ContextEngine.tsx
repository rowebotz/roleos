import React, { useState, useEffect, useCallback, memo } from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { ROLE_OS_SECTIONS, Section, Field } from '@/data/schemas';
import { useContextDensity } from '@/hooks/useContextDensity';
import { expandThought } from '@/data/expansionTemplates';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertTriangle, ChevronRight, History, X, CheckCircle2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntroHero } from '@/components/IntroHero';
import { useHotkeys } from 'react-hotkeys-hook';

// Why-this-matters descriptions for each section — gives users context on how the AI uses each field
const SECTION_WHY: Record<string, string> = {
  "professional-identity": "Helps AI address you at the right level of expertise and use accurate job-specific terminology.",
  "target-audience": "Lets AI tailor tone, vocabulary, and examples to the people you serve.",
  "value-proposition": "Gives AI a north star so responses stay focused on outcomes that matter to you.",
  "standard-workflows": "Lets AI follow your actual process rather than suggesting generic steps.",
  "success-metrics": "Helps AI know when to celebrate wins and flag risks based on your real benchmarks.",
  "collaboration-style": "Teaches AI how you prefer to communicate so it mirrors your protocols.",
  "knowledge-base": "Prevents AI from over-explaining basics you already know deeply.",
  "core-tools": "Lets AI generate code and suggestions in the exact tools you use, not alternatives.",
  "philosophical-alignment": "Anchors AI recommendations to your values and avoids suggestions that conflict with them.",
  "expertise-credentials": "Gives AI concrete proof of your credibility to use in bios, pitches, and summaries.",
  "unfair-advantage": "Helps AI amplify what makes you genuinely different rather than giving generic advice.",
  "voice-tone": "Ensures every AI-generated draft sounds like you, not a generic assistant.",
  "decision-rules": "Lets AI pre-filter options and recommendations according to your logic.",
  "constraints": "Prevents AI from suggesting anything that falls outside your hard limits.",
  "output-preferences": "Ensures AI delivers results in the exact format you can immediately use.",
};

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

  const handleUpdate = useCallback((fieldId: string, val: string) => {
    updateField(fieldId, val);
  }, [updateField]);

  if (!section) return null;

  const sectionWhy = SECTION_WHY[activeId];

  return (
    <div className="max-w-2xl mx-auto space-y-10 py-10" id={`panel-${activeId}`} role="tabpanel" aria-labelledby={`tab-${activeId}`}>
      <AnimatePresence>
        {showIntro && <IntroHero onDismiss={dismissIntro} />}
        {showResumeBanner && !showIntro && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-brand to-[#4b5cd1] border border-white/20 shadow-glow text-white"
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

      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{section.title}</h1>
        <p className="text-muted-foreground leading-relaxed">{section.description}</p>
        {sectionWhy && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-brand/5 border border-brand/15">
            <Info className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground/80">Why this matters: </span>
              {sectionWhy}
            </p>
          </div>
        )}
      </header>

      <div className="space-y-12 pb-20">
        {section.fields.map((field, index) => (
          <FieldGroup
            key={field.id}
            field={field}
            initialValue={profile[field.id] || ''}
            patterns={section.lowSignalPatterns}
            onUpdate={handleUpdate}
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
  onUpdate: (fieldId: string, val: string) => void;
  isExpanding: boolean;
  setExpanding: (val: boolean) => void;
  isLast: boolean;
  section: Section;
}

const FieldGroup = memo(({ field, initialValue, patterns, onUpdate, isExpanding, setExpanding, isLast, section }: FieldGroupProps) => {
  const [localValue, setLocalValue] = useState(initialValue);
  const setActiveSection = useProfileStore(s => s.setActiveSection);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localValue !== initialValue) {
        onUpdate(field.id, localValue);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [localValue, onUpdate, field.id, initialValue]);

  const { score, flags } = useContextDensity(localValue, patterns);

  useEffect(() => {
    if (score >= 70 && !hasCelebrated) {
      setHasCelebrated(true);
    } else if (score < 60) {
      setHasCelebrated(false);
    }
  }, [score, hasCelebrated]);

  const variations = expandThought(localValue);
  const scoreColor = score > 70 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : score > 40 ? "bg-brand" : "bg-rose-500";

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

  const hasInput = localValue.trim().length > 0;

  return (
    <section className="space-y-4" aria-labelledby={`label-${field.id}`}>
      <div className="flex items-end justify-between">
        <label id={`label-${field.id}`} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{field.label}</label>
        <div className="flex items-center gap-2" aria-live="polite">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">Clarity: {score}%</span>
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
                <span className="sr-only">High clarity achieved</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {flags.length > 0 && (
            <div
              className="flex items-center gap-1 text-[10px] font-bold text-amber-500/80 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20"
              role="alert"
            >
              <AlertTriangle className="w-3 h-3" aria-hidden="true" />
              Too vague
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanding(!isExpanding)}
            aria-expanded={isExpanding}
            aria-controls={`variations-${field.id}`}
            title={hasInput ? "AI will rewrite this in 3 styles — clear, technical, and persuasive. Click to apply one." : "Type something first, then AI will offer rewrite suggestions."}
            className="h-8 gap-2 bg-muted hover:bg-brand hover:text-white text-muted-foreground border-border transition-all duration-200"
          >
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            <span className="text-xs">✦ Rewrite</span>
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
            {!hasInput ? (
              <div className="p-3 rounded-md bg-muted/30 border border-border text-center">
                <p className="text-xs text-muted-foreground">
                  Type something in the field above, then hit <strong>✦ Rewrite</strong> to get AI-improved versions.
                </p>
              </div>
            ) : (
              Object.entries(variations).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => {
                    setLocalValue(val as string);
                    onUpdate(field.id, val as string);
                    setExpanding(false);
                  }}
                  className="w-full text-left p-3 rounded-md bg-muted/50 border border-border hover:border-brand/40 hover:bg-brand/10 transition-all group relative focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand/80">{key}</span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground line-clamp-2">{val as string}</p>
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

FieldGroup.displayName = "FieldGroup";
