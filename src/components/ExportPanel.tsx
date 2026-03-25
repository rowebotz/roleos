import React, { useState } from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { ROLE_OS_SECTIONS } from '@/data/schemas';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, Share2, Link as LinkIcon, Sparkles, Terminal } from 'lucide-react';
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
      <DialogContent className="sm:max-w-[700px] bg-background border-border text-foreground max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">System Deployment Hub</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <section className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-4">
            <div className="flex items-center justify-between">
<div className="flex items-center gap-2">
  <LinkIcon className="w-4 h-4 text-primary-foreground" />
  <h3 className="text-xs font-bold uppercase tracking-widest text-primary-foreground">Localized Short-Link</h3>
</div>
              <Sparkles className="w-3 h-3 text-primary-foreground" />
            </div>
            {!shortcode ? (
<Button
  onClick={handleGenerateLink}
  variant="outline"
  className="w-full border-primary/30 bg-primary/10 text-primary-foreground hover:bg-primary/20"
>
                Generate Snapshot Link
              </Button>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1 px-3 py-2 rounded bg-muted/70 border border-border/50 font-mono text-xs text-muted-foreground truncate">
                  {shareUrl}
                </div>
                <Button size="icon" variant="ghost" className="bg-muted/20" onClick={() => copy(shareUrl)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            )}
            <p className="text-[10px] text-muted-foreground italic">Links are stored in your local browser storage for quick retrieval.</p>
          </section>
          <section className="space-y-4">
<div className="flex items-center gap-2">
  <Terminal className="w-4 h-4 text-muted-foreground" />
  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AI Platform Exports</h3>
</div>
            <Tabs defaultValue="claude" className="w-full">
              <TabsList className="bg-muted border border-border w-full justify-start h-auto p-1 mb-4 overflow-x-auto">
<TabsTrigger value="claude" className="data-[state=active]:bg-muted/60">Claude</TabsTrigger>
<TabsTrigger value="chatgpt" className="data-[state=active]:bg-muted/60">ChatGPT</TabsTrigger>
<TabsTrigger value="gemini" className="data-[state=active]:bg-muted/60">Gemini</TabsTrigger>
<TabsTrigger value="json" className="data-[state=active]:bg-muted/60">JSON</TabsTrigger>
              </TabsList>
              {Object.entries(formats).map(([key, content]) => (
                <TabsContent key={key} value={key} className="space-y-4 outline-none">
                  <div className="relative group">
                    <pre className="p-4 rounded-lg bg-muted/80 border border-border/40 font-mono text-[11px] overflow-auto max-h-[300px] text-foreground selection:bg-indigo-500/30">
                      {content}
                    </pre>
<Button
  size="icon"
  variant="ghost"
  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground bg-card/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
  onClick={() => copy(content)}
>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" className="border-border/30 bg-muted text-xs h-9" onClick={() => {
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