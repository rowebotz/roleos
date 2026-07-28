import React from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { ROLE_OS_SECTIONS } from '@/data/schemas';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkle } from 'lucide-react';
export function ProfilePreview() {
  const profile = useProfileStore(s => s.profile);
  const hasAnyData = Object.keys(profile).length > 0;
  return (
    <div className="flex flex-col h-full w-full md:w-[420px] bg-sidebar md:border-l border-border" aria-label="Profile Preview">
      <div className="p-6 border-b border-border flex items-center justify-between bg-sidebar/70 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-[13px] font-medium text-muted-foreground">Preview</h2>
        {hasAnyData && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Synced
          </span>
        )}
      </div>
      <ScrollArea className="flex-1 p-6 md:p-8">
        <div className="space-y-10 text-sm leading-relaxed max-w-sm mx-auto pb-12">
          {ROLE_OS_SECTIONS.map((section) => {
            const hasData = section.fields.some(f => !!profile[f.id]);
            if (!hasData) return null;
            return (
              <section key={section.id} className="space-y-4">
                <h3 className="eyebrow">{section.title}</h3>
                <div className="space-y-5">
                  {section.fields.map(field => profile[field.id] && (
                    <div key={field.id} className="space-y-1">
                      <h4 className="text-xs text-muted-foreground/80">
                        {field.label}
                      </h4>
                      <p className="text-foreground leading-normal">
                        {profile[field.id]}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
          {!hasAnyData && (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 px-4" role="status">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Sparkle className="w-5 h-5 text-muted-foreground/50" aria-hidden="true" />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-foreground/80">Nothing here yet</p>
                <p className="text-muted-foreground text-xs max-w-[220px]">Fill in a few fields on the left and your profile will take shape here.</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
