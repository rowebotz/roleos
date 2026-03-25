import React, { useState, useEffect, useCallback } from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { ROLE_OS_SECTIONS, Section } from '@/data/schemas';
import { useContextDensity } from '@/hooks/useContextDensity';
import { expandThought } from '@/data/expansionTemplates';
import { Textarea } from '@/components/ui/textarea';
import { Field } from '@/data/schemas';
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
    <div className="max-w-2xl mx-auto space-y-10 py-10" id={`panel-${activeId}`} role="tabpanel">
      <AnimatePresence>
        {showIntro && <IntroHero onDismiss={dismissIntro} />}
        {showResumeBanner && !showIntro && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between p-3 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400"
          >
            <div className="flex items-center gap-3">
              <History className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Resume where you left off?</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleResume} className="h-7 px-3 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-widest">
                Jump to task
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDismissedResumeBanner(true)} className="h-7 w-7 text-indigo-400/50 hover:text-indigo-400">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">{section.title}</h2>
        <p className="text-zinc-400 leading-relaxed">{section.description}</p>
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
        const form = (e.target as HTMLElement).closest('div.space-y-12');
        const textareas = Array.from(form?.querySelectorAll('textarea') || []);
        const nextIdx = textareas.indexOf(e.target as HTMLTextAreaElement) + 1;
        if (nextIdx < textareas.length) {
          (textareas[nextIdx] as HTMLElement).focus();
        }
      }
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">{field.label}</label>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">Context Density</span>
          <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden relative">
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
          placeholder={field.placeholder}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleEnter}
          className="min-h-[120px] bg-zinc-900/50 border-zinc-800 text-zinc-200 placeholder:text-zinc-700 focus:ring-indigo-500/50 resize-none transition-all duration-300 group-hover:border-zinc-700 focus:border-indigo-500/50"
        />
        <AnimatePresence>
          {score >= 70 && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-2 -right-2 z-20"
            >
              <div className="bg-emerald-500 rounded-full p-1 shadow-glow border border-emerald-400/50">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0 }}
                  animate={{ 
                    opacity: 0, 
                    scale: 1,
                    x: (Math.random() - 0.5) * 60,
                    y: (Math.random() - 0.5) * 60
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {flags.length > 0 && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500/80 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
              <AlertTriangle className="w-3 h-3" />
              Low Signal
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanding(!isExpanding)}
            className="h-8 gap-2 bg-zinc-800 hover:bg-indigo-600 text-zinc-300 hover:text-white border border-white/5 transition-all duration-200"
          >
            <Sparkles className="w-3 h-3" />
            <span className="text-xs">Expand</span>
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanding && (
          <motion.div
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
                className="w-full text-left p-3 rounded-md bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group relative focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400/80">{key}</span>
                  <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-sm text-zinc-400 group-hover:text-zinc-200 line-clamp-2">{val as string}</p>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}