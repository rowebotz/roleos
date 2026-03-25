import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ContextEngine } from '@/components/ContextEngine';
import { ProfilePreview } from '@/components/ProfilePreview';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ExportPanel } from '@/components/ExportPanel';
import { Toaster } from '@/components/ui/sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Terminal } from 'lucide-react';
export function HomePage() {
  const isMobile = useIsMobile();
  return (
    <div className="h-screen w-full bg-zinc-950 flex flex-col overflow-hidden text-zinc-200 selection:bg-indigo-500/30">
      {/* Global Header */}
      <header className="h-14 border-b border-white/5 px-6 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md z-30 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(79,70,229,0.5)]">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tighter text-white">RoleOS</span>
          </div>
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-zinc-500">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 bg-zinc-950 border-white/10 w-64">
                <Sidebar />
              </SheetContent>
            </Sheet>
          )}
        </div>
        <div className="flex items-center gap-4">
          <ExportPanel />
          <div className="h-4 w-[1px] bg-white/5" />
          <ThemeToggle />
        </div>
      </header>
      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Sidebar */}
        {!isMobile && (
          <aside className="shrink-0 h-full">
            <Sidebar />
          </aside>
        )}
        {/* Center: Context Engine */}
        <section className="flex-1 h-full overflow-y-auto custom-scrollbar relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ContextEngine />
          </div>
        </section>
        {/* Right: Profile Preview */}
        {!isMobile && (
          <aside className="shrink-0 h-full">
            <ProfilePreview />
          </aside>
        )}
        {/* Mobile Preview FAB */}
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-2xl z-50 bg-indigo-600"
                size="icon"
              >
                <Terminal className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] p-0 bg-zinc-950 border-white/10 rounded-t-3xl overflow-hidden">
              <ProfilePreview />
            </SheetContent>
          </Sheet>
        )}
      </main>
      <Toaster position="top-center" richColors theme="dark" />
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #18181b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #27272a; }
      `}} />
    </div>
  );
}