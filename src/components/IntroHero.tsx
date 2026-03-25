import React from 'react';
import { motion } from 'framer-motion';
import { X, Terminal, Cpu, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface IntroHeroProps {
  onDismiss: () => void;
}
export function IntroHero({ onDismiss }: IntroHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="relative overflow-hidden rounded-2xl border-border bg-card/50 p-8 shadow-2xl backdrop-blur-md mb-12"
    >
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/30"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-widest">
            <Terminal className="h-3 w-3 text-brand" />
            System Initialization
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">
            Build Your Personal AI <span className="text-brand">Operating Profile</span>
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
            RoleOS is a structured context engine that helps align large language models (LLMs) with your communication style, work, and thought process. It gives AI systems richer context, clearer instructions, and more precise guidance on how to support you, then exports that profile into usable formats like Claude Skills, Gemini Gems, Custom GPTs, and more.
          </p>
          <div className="flex gap-4 pt-2">
            <Button onClick={onDismiss} className="btn-gradient bg-brand hover:bg-brand/90 px-6 h-10 text-xs uppercase tracking-widest font-bold">
              Initialize System
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto shrink-0">
          {[
            { icon: Cpu, title: "Thinking Styles", desc: "Define cognitive frameworks." },
            { icon: Zap, title: "Persistent Context", desc: "One source of truth for AI." },
            { icon: ShieldCheck, title: "Systems Approach", desc: "Predictable AI behavior." },
            { icon: Terminal, title: "Export Ready", desc: "Claude, GPT, Gemini formats." }
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-card/60 border-border/40 space-y-1">
              <div className="flex items-center gap-2">
                <item.icon className="h-3 w-3 text-brand" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight">{item.title}</span>
              </div>
              <p className="text-xs text-muted-foreground/80 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}