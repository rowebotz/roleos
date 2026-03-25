import React, { useState, useEffect } from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { ROLE_OS_SECTIONS } from '@/data/schemas';
import { useContextDensity } from '@/hooks/useContextDensity';
import { expandThought } from '@/data/expansionTemplates';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertTriangle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntroHero } from '@/components/IntroHero';
import { useDebounce } from 'react-use';
export function ContextEngine() {
  const activeId = useProfileStore(s => s.activeSectionId);
  const profile = useProfileStore(s => s.profile);
  const hasDismissedIntro = useProfileStore(s => s.hasDismissedIntro);
  const updateField = useProfileStore(s => s.updateField);
  const dismissIntro = useProfileStore(s => s.dismissIntro);
  const section = ROLE_OS_SECTIONS.find(s => s.id === activeId);
  const [expandingField, setExpandingField] = useState<string | null>(null);
  const profileSize = Object.keys(profile).length;
  const showIntro = !hasDismissedIntro && profileSize === 0;
  if (!section) return null;
  return (
    <div className="max-w-2xl mx-auto space-y-10 py-10">
      <AnimatePresence>
        {showIntro && (
          <IntroHero onDismiss={dismissIntro} />
        )}
      </AnimatePresence>
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">{section.title}</h2>
        <p className="text-zinc-400 leading-relaxed">{section.description}</p>
      </header>
      <div className="space-y-12">
        {section.fields.map((field) => (
          <FieldGroup
            key={field.id}
            field={field}
            initialValue={profile[field.id] || ''}
            patterns={section.lowSignalPatterns}
            onUpdate={(val: string) => updateField(field.id, val)}
            isExpanding={expandingField === field.id}
            setExpanding={(val: boolean) => setExpandingField(val ? field.id : null)}
          />
        ))}
      </div>
    </div>
  );
}
function FieldGroup({ field, initialValue, patterns, onUpdate, isExpanding, setExpanding }: any) {
  const [localValue, setLocalValue] = useState(initialValue);
  // Sync local state if external value changes (e.g. section switch or import)
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);
  // Debounce the store update to prevent lag during rapid typing
  useDebounce(
    () => {
      if (localValue !== initialValue) {
        onUpdate(localValue);
      }
    },
    500,
    [localValue]
  );
  const { score, flags } = useContextDensity(localValue, patterns);
  const variations = expandThought(localValue);
  const scoreColor = score > 70 ? "bg-emerald-500" : score > 40 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">{field.label}</label>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">Context Density</span>
          <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${scoreColor}`} 
              style={{ width: `${score}%` }} 
            />
          </div>
        </div>
      </div>
      <div className="relative group">
        <Textarea
          placeholder={field.placeholder}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="min-h-[120px] bg-zinc-900/50 border-zinc-800 text-zinc-200 placeholder:text-zinc-700 focus:ring-indigo-500/50 resize-none transition-all duration-300 group-hover:border-zinc-700"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {flags.length > 0 && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500/80 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
              <AlertTriangle className="w-3 h-3" />
              Low Signal: {flags.slice(0, 2).join(', ')}
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
                className="w-full text-left p-3 rounded-md bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group relative"
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