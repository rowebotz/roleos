import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { ContextEngine } from '@/components/ContextEngine';
import { ProfilePreview } from '@/components/ProfilePreview';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ExportPanel } from '@/components/ExportPanel';
import { MobileNav } from '@/components/MobileNav';
import { Toaster } from '@/components/ui/sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2 } from 'lucide-react';
import { useProfileStore } from '@/store/useProfileStore';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'sonner';
export function HomePage() {
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const isHydrated = useProfileStore(s => s.isHydrated);
  const activeMobileView = useProfileStore(s => s.activeMobileView);
  const savedShortcodes = useProfileStore(s => s.savedShortcodes);
  const importProfile = useProfileStore(s => s.importProfile);
  const processedIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (isHydrated) {
      const id = searchParams.get('id');
      if (id && savedShortcodes[id] && processedIdRef.current !== id) {
        importProfile(savedShortcodes[id]);
        processedIdRef.current = id;
        toast.success("Profile loaded from local link", {
          description: "This snapshot was retrieved from your local storage."
        });
      }
    }
  }, [isHydrated, searchParams, savedShortcodes, importProfile]);
  const activeSectionId = useProfileStore(s => s.activeSectionId);
  useHotkeys('meta+b, ctrl+b', () => {
    const activeEl = document.activeElement as HTMLElement;
    if (activeEl?.tagName === 'TEXTAREA') {
      const tab = document.getElementById('tab-' + activeSectionId);
      tab?.focus();
    } else {
      document.querySelector('textarea')?.focus();
    }
  });
  if (!isHydrated) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center" role="status" aria-live="assertive">
        <div className="flex flex-col items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-brand flex items-center justify-center shadow-soft">
            <span className="font-display font-semibold text-lg text-white" aria-hidden="true">R</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            Loading your profile
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden text-foreground selection:bg-primary/20 transition-colors duration-500">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className="h-14 border-b border-border px-6 flex items-center justify-between bg-card backdrop-blur-md z-30 shrink-0" role="banner">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
              <span className="font-display font-semibold text-sm text-white" aria-hidden="true">R</span>
            </div>
            <span className="font-display font-semibold text-lg text-foreground">RoleOS</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!isMobile && <ExportPanel />}
          <div className="h-4 w-[1px] bg-border/20" aria-hidden="true" />
          <ThemeToggle />
        </div>
      </header>
      <main id="main-content" className="flex-1 flex overflow-hidden max-w-[2000px] mx-auto w-full relative" role="main">
        {!isMobile ? (
          <>
            <aside className="shrink-0 h-full" aria-label="Taxonomy Navigation">
              <Sidebar />
            </aside>
            <section className="flex-1 h-full overflow-y-auto custom-scrollbar relative px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <ContextEngine />
              </div>
            </section>
            <aside className="shrink-0 h-full" aria-label="Live Output Preview">
              <ProfilePreview />
            </aside>
          </>
        ) : (
          <div className="flex-1 h-full overflow-y-auto pb-24 px-4">
            {activeMobileView === 'sidebar' && <Sidebar />}
            {activeMobileView === 'engine' && <ContextEngine />}
            {activeMobileView === 'preview' && <ProfilePreview />}
            {activeMobileView === 'export' && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center shadow-soft">
                  <span className="font-display font-semibold text-2xl text-white" aria-hidden="true">R</span>
                </div>
                <h2 className="text-xl font-semibold">Ready to export?</h2>
                <p className="text-muted-foreground text-sm max-w-xs">Turn your profile into a Claude Skill, Gemini Gem, Custom GPT, or raw JSON.</p>
                <ExportPanel />
              </div>
            )}
          </div>
        )}
      </main>
      {isMobile && <MobileNav />}
      <Toaster position="top-center" richColors theme="system" />
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--ring)/0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: hsl(var(--ring)/0.5); }
      `}} />
    </div>
  );
}