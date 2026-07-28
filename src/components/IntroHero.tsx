import React from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IntroHeroProps {
  onDismiss: () => void;
}

const STEPS = [
  {
    number: "1",
    title: "Answer 5 quick questions",
    desc: "Tap chips or type a line for each — that's the whole Quick Start. Takes about 2 minutes.",
  },
  {
    number: "2",
    title: "Use it right away",
    desc: "Quick Start alone gives you a usable profile. Level Up sections add depth whenever you want it.",
  },
  {
    number: "3",
    title: "Export to your AI tool",
    desc: "Click Export Profile to copy it as a Claude Skill, Custom GPT, Gemini Gem, or raw JSON.",
  },
];

export function IntroHero({ onDismiss }: IntroHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft mb-12"
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2.5">
            <span className="eyebrow text-brand/90">Welcome</span>
            <h1 className="text-2xl font-display font-semibold tracking-tight text-foreground">
              Build your personal AI profile in about 2 minutes
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
              Answer the 5 Quick Start questions and you're ready to export. Everything else is optional — add it anytime to go deeper.
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
        <p className="eyebrow mb-4">How it works</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STEPS.map((step) => (
            <div key={step.number} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-muted text-foreground/70 text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
                {step.number}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export formats */}
      <div className="px-8 pb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Download className="w-3.5 h-3.5 text-muted-foreground/60" />
          <span>Exports to:</span>
          {["Claude Skills", "Custom GPTs", "Gemini Gems", "JSON"].map((fmt) => (
            <span key={fmt} className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[11px] font-medium">
              {fmt}
            </span>
          ))}
        </div>
        <div className="sm:ml-auto">
          <Button
            onClick={onDismiss}
            className="bg-brand hover:bg-[#253694] text-white px-5 h-9 text-sm font-medium gap-2"
          >
            Start building
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
