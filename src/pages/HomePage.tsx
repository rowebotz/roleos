import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { ContextEngine } from '@/components/ContextEngine';
import { ProfilePreview } from '@/components/ProfilePreview';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ExportPanel } from '@/components/ExportPanel';
import { MobileNav } from '@/components/MobileNav';
import { Toaster } from '@/components/ui/sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Terminal, Loader2 } from 'lucide-react';
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
  const activeSectionId = useProfileStore(s => s.activeSectionId);
  // Handle URL Shortcodes
  useEffect(() => {
    if (isHydrated) {
      const id = searchParams.get('id');
      if (id && savedShortcodes[id]) {
        importProfile(savedShortcodes[id]);
        toast.success("Profile loaded from local link", {
          description: "This snapshot was retrieved from your local storage."
        });
      }
    }
  }, [isHydrated, searchParams, savedShortcodes, importProfile]);
  useHotkeys('meta+b, ctrl+b', () => {
    const activeEl = document.activeElement as HTMLElement;
    if (activeEl?.tagName === 'TEXTAREA') {
      document.getElementById('tab-' + activeSectionId)?.focus();
    } else {
      document.querySelector('textarea')?.focus();
    }
  });
  if (!isHydrated) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(79,70,229,0.6)] animate-pulse">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs uppercase tracking-[0.3em]">
            <Loader2 className="w-3 h-3 animate-spin" />
            Initializing OS
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden text-foreground selection:bg-primary/20 transition-colors duration-500">
      <header className="h-14 border-b border-border px-6 flex items-center justify-between bg-card backdrop-blur-md z-30 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(79,70,229,0.5)]">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tighter text-foreground">RoleOS</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!isMobile && <ExportPanel />}
          <div className="h-4 w-[1px] bg-border/20" />
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden max-w-[2000px] mx-auto w-full relative">
        {!isMobile ? (
          <>
            <aside className="shrink-0 h-full">
              <Sidebar />
            </aside>
            <section className="flex-1 h-full overflow-y-auto custom-scrollbar relative px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <ContextEngine />
              </div>
            </section>
            <aside className="shrink-0 h-full">
              <ProfilePreview />
            </aside>
          </>
        ) : (
          <div className="flex-1 h-full overflow-y-auto pb-20 px-4">
            {activeMobileView === 'sidebar' && <Sidebar />}
            {activeMobileView === 'engine' && <ContextEngine />}
            {activeMobileView === 'preview' && <ProfilePreview />}
            {activeMobileView === 'export' && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center">
                  <Terminal className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold">Ready to Deploy?</h2>
                <p className="text-muted-foreground text-sm max-w-xs">Generate your optimized AI prompt or share your local snapshot.</p>
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