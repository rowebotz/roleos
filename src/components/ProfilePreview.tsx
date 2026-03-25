import React from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { ROLE_OS_SECTIONS } from '@/data/schemas';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal } from 'lucide-react';
export function ProfilePreview() {
  const profile = useProfileStore(s => s.profile);
  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-md border-l border-white/5 w-[450px]">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-500" />
          <h2 className="text-sm font-bold tracking-widest text-zinc-400 uppercase">Live Output</h2>
        </div>
        <div className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          PROMPT_MODE
        </div>
      </div>
      <ScrollArea className="flex-1 p-8">
        <div className="space-y-10 font-mono text-xs leading-relaxed max-w-sm mx-auto">
          <header className="text-center space-y-2">
            <h1 className="text-xl font-bold tracking-tighter text-white">ROLE_OS_PROFILE_V1</h1>
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          </header>
          {ROLE_OS_SECTIONS.map((section) => {
            const hasData = section.fields.some(f => !!profile[f.id]);
            if (!hasData) return null;
            return (
              <section key={section.id} className="space-y-4">
                <div className="flex items-center gap-4 text-indigo-500 opacity-60">
                  <span className="shrink-0">[ {section.title.toUpperCase().replace(/\s+/g, '_')} ]</span>
                  <div className="h-[1px] flex-1 bg-current" />
                </div>
                <div className="space-y-6 pl-4 border-l border-zinc-900">
                  {section.fields.map(field => profile[field.id] && (
                    <div key={field.id} className="space-y-1">
                      <div className="text-zinc-600 font-bold tracking-tight text-[10px] uppercase">
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
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-10 h-10 rounded-full border border-dashed border-zinc-800 flex items-center justify-center">
                <div className="w-2 h-2 bg-zinc-800 rounded-full animate-ping" />
              </div>
              <p className="text-zinc-600 italic">Synthesizing engine offline... <br/>Input required.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}