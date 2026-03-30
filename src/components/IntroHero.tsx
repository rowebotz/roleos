import React from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, Sparkles, Share2, Download, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROLE_OS_SECTIONS } from '@/data/schemas';

interface IntroHeroProps {
  onDismiss: () => void;
}

const STEPS = [
  {
    number: "1",
    title: "Fill your profile",
    desc: "Work through each section on the left — the more context you add, the better your AI will know you.",
  },
  {
    number: "2",
    title: "AI refines your input",
    desc: "Use the ✦ Rewrite button on any field to get clearer, stronger phrasing instantly.",
  },
  {
    number: "3",
    title: "Export to your AI tool",
    desc: "Click Deploy Profile to copy your profile as a Claude Skill, Custom GPT, Gemini Gem, or raw JSON.",
  },
];

export function IntroHero({ onDismiss }: IntroHeroProps) {
  const totalFields = ROLE_OS_SECTIONS.reduce((acc, s) => acc + s.fields.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card/80 shadow-2xl backdrop-blur-md mb-12"
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3 w-3" />
              Welcome to RoleOS
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tight text-foreground">
              Build your personal AI profile in {totalFields} fields
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
              RoleOS turns your skills, style, and context into a structured profile that makes any AI — Claude, ChatGPT, Gemini — work the way <em>you</em> think. Fill the sections on the left, then export to your preferred platform.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted/30 mt-1"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss intro</span>
          </Button>
        </div>
      </div>

      {/* How it works */}
      <div className="px-8 py-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">How it works</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STEPS.map((step) => (
            <div key={step.number} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-brand/10 border border-brand/30 text-brand text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {step.number}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export formats */}
      <div className="px-8 pb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Download className="w-3.5 h-3.5 text-brand" />
          <span>Exports to:</span>
          {["Claude Skills", "Custom GPTs", "Gemini Gems", "JSON"].map((fmt) => (
            <span key={fmt} className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[11px] font-medium border border-border">
              {fmt}
            </span>
          ))}
        </div>
        <div className="sm:ml-auto">
          <Button
            onClick={onDismiss}
            className="bg-brand hover:bg-brand/90 text-white px-5 h-9 text-xs font-bold uppercase tracking-widest gap-2"
          >
            Start building
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
