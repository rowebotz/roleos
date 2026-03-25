import React from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { ROLE_OS_SECTIONS } from '@/data/schemas';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
export function ExportPanel() {
  const profile = useProfileStore(s => s.profile);
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
        <Button className="btn-gradient shadow-glow gap-2">
          <Share2 className="w-4 h-4" />
          Deploy Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-zinc-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Deploy to AI Agent</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="claude" className="mt-4">
          <TabsList className="bg-zinc-900 border border-white/5 w-full justify-start overflow-x-auto h-auto p-1">
            <TabsTrigger value="claude" className="data-[state=active]:bg-zinc-800">Claude</TabsTrigger>
            <TabsTrigger value="chatgpt" className="data-[state=active]:bg-zinc-800">ChatGPT</TabsTrigger>
            <TabsTrigger value="gemini" className="data-[state=active]:bg-zinc-800">Gemini</TabsTrigger>
            <TabsTrigger value="json" className="data-[state=active]:bg-zinc-800">JSON</TabsTrigger>
          </TabsList>
          {Object.entries(formats).map(([key, content]) => (
            <TabsContent key={key} value={key} className="mt-4 space-y-4">
              <div className="relative">
                <pre className="p-4 rounded-lg bg-black/50 border border-white/5 font-mono text-xs overflow-auto max-h-[400px] text-zinc-400">
                  {content}
                </pre>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute top-2 right-2 text-zinc-500 hover:text-white"
                  onClick={() => copy(content)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" className="border-white/5 bg-zinc-900" onClick={() => {
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `roleos-profile-${key}.${key === 'json' ? 'json' : 'md'}`;
                  a.click();
                }}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}