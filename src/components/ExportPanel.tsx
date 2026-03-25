import React, { useState } from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { ROLE_OS_SECTIONS } from '@/data/schemas';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, Share2, Link as LinkIcon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
export function ExportPanel() {
  const profile = useProfileStore(s => s.profile);
  const saveProfileSnapshot = useProfileStore(s => s.saveProfileSnapshot);
  const [shortcode, setShortcode] = useState<string | null>(null);
  const generateMarkdown = () => {
    let md = "# RoleOS Profile\n\n";
    ROLE_OS_SECTIONS.forEach(s => {
      const fields = s.fields.filter(f => !!profile[f.id]);
      if (fields.length > 0) {
        md += `## ${s.title}\n`;
        fields.forEach(f => {
          md += `**${f.label}:** ${profile[f.id]}\n\n`;
        });
      }
    });
    return md;
  };
  const handleGenerateLink = () => {
    const id = Math.random().toString(36).substring(2, 10);
    saveProfileSnapshot(id, profile);
    setShortcode(id);
    toast.success("Short-link generated locally");
  };
  const shareUrl = shortcode ? `${window.location.origin}${window.location.pathname}?id=${shortcode}` : '';
  const formats = {
    claude: `<role_os_profile>\n${generateMarkdown()}</role_os_profile>`,
    chatgpt: `Act according to this Operating Profile:\n\n${generateMarkdown().substring(0, 1800)}`,
    gemini: generateMarkdown(),
    json: JSON.stringify(profile, null, 2)
  };
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="btn-gradient shadow-glow gap-2 px-6">
          <Share2 className="w-4 h-4" />
          Deploy Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-zinc-950 border-white/10 text-white max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">System Deployment Hub</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <section className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Localized Short-Link</h3>
              </div>
              <Sparkles className="w-3 h-3 text-indigo-500" />
            </div>
            {!shortcode ? (
              <Button 
                onClick={handleGenerateLink}
                variant="outline" 
                className="w-full border-indigo-500/20 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
              >
                Generate Snapshot Link
              </Button>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1 px-3 py-2 rounded bg-black/40 border border-white/5 font-mono text-xs text-zinc-400 truncate">
                  {shareUrl}
                </div>
                <Button size="icon" variant="ghost" className="bg-white/5" onClick={() => copy(shareUrl)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            )}
            <p className="text-[10px] text-zinc-500 italic">Links are stored in your local browser storage for quick retrieval.</p>
          </section>
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-zinc-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">AI Platform Exports</h3>
            </div>
            <Tabs defaultValue="claude" className="w-full">
              <TabsList className="bg-zinc-900 border border-white/5 w-full justify-start h-auto p-1 mb-4 overflow-x-auto">
                <TabsTrigger value="claude" className="data-[state=active]:bg-zinc-800">Claude</TabsTrigger>
                <TabsTrigger value="chatgpt" className="data-[state=active]:bg-zinc-800">ChatGPT</TabsTrigger>
                <TabsTrigger value="gemini" className="data-[state=active]:bg-zinc-800">Gemini</TabsTrigger>
                <TabsTrigger value="json" className="data-[state=active]:bg-zinc-800">JSON</TabsTrigger>
              </TabsList>
              {Object.entries(formats).map(([key, content]) => (
                <TabsContent key={key} value={key} className="space-y-4 outline-none">
                  <div className="relative group">
                    <pre className="p-4 rounded-lg bg-black/50 border border-white/5 font-mono text-[11px] overflow-auto max-h-[300px] text-zinc-400 selection:bg-indigo-500/30">
                      {content}
                    </pre>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 text-zinc-500 hover:text-white bg-zinc-900/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copy(content)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" className="border-white/5 bg-zinc-900 text-xs h-9" onClick={() => {
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `roleos-profile-${key}.${key === 'json' ? 'json' : 'md'}`;
                      a.click();
                    }}>
                      <Download className="w-4 h-4 mr-2" />
                      Download File
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}