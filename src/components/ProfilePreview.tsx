import React from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { ROLE_OS_SECTIONS } from '@/data/schemas';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, Cpu } from 'lucide-react';
export function ProfilePreview() {
  const profile = useProfileStore(s => s.profile);
  return (
    <div className="flex flex-col h-full w-full md:w-[450px] bg-sidebar md:border-l border-border" aria-label="Live Profile Preview">
      <div className="p-6 border-b border-border flex items-center justify-between bg-sidebar/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" aria-hidden="true" />
          <h2 className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">Live Output</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
          <div className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/10 text-primary-foreground/80 border border-primary/30 tracking-widest">
            STABLE_SYNC
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 p-6 md:p-8">
        <div className="space-y-12 font-mono text-xs leading-relaxed max-w-sm mx-auto pb-12">
          <header className="text-center space-y-3">
            <h2 className="text-xl font-bold tracking-tighter text-foreground">ROLE_OS_PROFILE_V1</h2>
            <div className="flex items-center gap-2 justify-center" aria-hidden="true">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-border/30" />
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-center">STRUCTURED_CONTEXT_FOR_LLMS</div>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-border/30" />
            </div>
          </header>
          {ROLE_OS_SECTIONS.map((section) => {
            const hasData = section.fields.some(f => !!profile[f.id]);
            if (!hasData) return null;
            return (
              <section key={section.id} className="space-y-4">
                <div className="flex items-center gap-4 text-primary/60">
                  <h3 className="shrink-0 text-[10px] font-bold tracking-widest">
                    [ {section.title.toUpperCase().replace(/\s+/g, '_')} ]
                  </h3>
                  <div className="h-[1px] flex-1 bg-current opacity-20" aria-hidden="true" />
                </div>
                <div className="space-y-6 pl-4 border-l border-border/60 ml-1">
                  {section.fields.map(field => profile[field.id] && (
                    <div key={field.id} className="space-y-1.5">
                      <h4 className="text-muted-foreground font-bold tracking-widest text-[9px] uppercase">
                        {field.label}
                      </h4>
                      <p className="text-foreground leading-normal selection:bg-primary/20">
                        {profile[field.id]}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
          {Object.keys(profile).length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-6 px-4" role="status">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border border-dashed border-border/60 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-border" aria-hidden="true" />
                </div>
                <div className="absolute inset-0 w-16 h-16 rounded-full border border-primary/30 animate-ping [animation-duration:3s]" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.2em]">Context Engine Offline</p>
                <p className="text-muted-foreground italic text-[11px]">Align your communication and thought processes... <br/>Begin input to synthesize profile.</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <footer className="p-4 border-t border-border bg-sidebar/80 text-[9px] font-mono text-muted-foreground flex justify-between uppercase tracking-widest">
        <span>Encoding: UTF-8</span>
        <span>Version: 1.0.4-STABLE</span>
      </footer>
    </div>
  );
}