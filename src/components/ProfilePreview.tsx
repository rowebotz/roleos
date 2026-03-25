import React from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { ROLE_OS_SECTIONS } from '@/data/schemas';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, Cpu } from 'lucide-react';
export function ProfilePreview() {
  const profile = useProfileStore(s => s.profile);
  return (
    <div className="flex flex-col h-full bg-zinc-950 border-l border-white/5 w-[450px]">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-500" />
          <h2 className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase">Live Output</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          <div className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 tracking-widest">
            PROMPT_MODE
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 p-8">
        <div className="space-y-12 font-mono text-xs leading-relaxed max-w-sm mx-auto pb-12">
          <header className="text-center space-y-3">
            <h1 className="text-xl font-bold tracking-tighter text-white">ROLE_OS_PROFILE_V1</h1>
            <div className="flex items-center gap-2 justify-center">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-800" />
              <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Sys_Context</div>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-800" />
            </div>
          </header>
          {ROLE_OS_SECTIONS.map((section) => {
            const hasData = section.fields.some(f => !!profile[f.id]);
            if (!hasData) return null;
            return (
              <section key={section.id} className="space-y-4">
                <div className="flex items-center gap-4 text-indigo-500/60">
                  <span className="shrink-0 text-[10px] font-bold tracking-widest">
                    [ {section.title.toUpperCase().replace(/\s+/g, '_')} ]
                  </span>
                  <div className="h-[1px] flex-1 bg-current opacity-20" />
                </div>
                <div className="space-y-6 pl-4 border-l border-zinc-900 ml-1">
                  {section.fields.map(field => profile[field.id] && (
                    <div key={field.id} className="space-y-1.5">
                      <div className="text-zinc-600 font-bold tracking-widest text-[9px] uppercase">
                        {field.label}
                      </div>
                      <p className="text-zinc-300 leading-normal selection:bg-indigo-500 selection:text-white">
                        {profile[field.id]}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
          {Object.keys(profile).length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border border-dashed border-zinc-800 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-zinc-800" />
                </div>
                <div className="absolute inset-0 w-16 h-16 rounded-full border border-indigo-500/20 animate-ping [animation-duration:3s]" />
              </div>
              <div className="space-y-2">
                <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em]">Context Engine Offline</p>
                <p className="text-zinc-600 italic text-[11px]">Awaiting system parameters... <br/>Begin input to synthesize profile.</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-white/5 bg-zinc-950/80 text-[9px] font-mono text-zinc-600 flex justify-between uppercase tracking-widest">
        <span>Encoding: UTF-8</span>
        <span>Version: 1.0.4-STABLE</span>
      </div>
    </div>
  );
}