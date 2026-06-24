import React, { useState } from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { ROLE_OS_SECTIONS } from '@/data/schemas';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, Link as LinkIcon, Sparkles, FileDown, Check } from 'lucide-react';
import { toast } from 'sonner';

// Turn a free-text role into a safe skill slug, e.g. "Family Lawyer" -> "family-lawyer".
function slugify(input: string, fallback: string): string {
  const slug = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return slug || fallback;
}

export function ExportPanel() {
  const profile = useProfileStore(s => s.profile);
  const saveProfileSnapshot = useProfileStore(s => s.saveProfileSnapshot);
  const [shortcode, setShortcode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const role = (profile.role || '').trim();
  const specialization = (profile.specialization || '').trim();
  const audience = (profile.audience || '').trim();

  // Profile body shared by every export format.
  const generateMarkdown = () => {
    let md = '';
    ROLE_OS_SECTIONS.forEach(s => {
      const fields = s.fields.filter(f => !!profile[f.id]?.trim());
      if (fields.length > 0) {
        md += `## ${s.title}\n`;
        fields.forEach(f => {
          md += `- **${f.label}:** ${profile[f.id].trim()}\n`;
        });
        md += `\n`;
      }
    });
    return md.trim();
  };

  // A one-line description for the skill — what it's for and when to use it.
  const skillDescription = () => {
    const subject = role || 'this person';
    const focus = specialization ? ` focused on ${specialization}` : '';
    const forWhom = audience ? ` who serves ${audience}` : '';
    return `Operating profile for ${subject}${focus}${forWhom}. Use this whenever you assist them so your tone, process, and recommendations match how they actually work.`.slice(0, 1024);
  };

  const skillName = slugify(role || 'my-profile', 'my-profile');
  const displayTitle = role ? `${role}${specialization ? ` — ${specialization}` : ''}` : 'Operating Profile';

  // A valid Claude / Agent "Skill" file: YAML frontmatter + Markdown body.
  const skillFile = `---
name: ${skillName}
description: ${skillDescription()}
---

# ${displayTitle}

This is a personal operating profile. Adopt it whenever you assist this person so your help fits how they actually think and work.

${generateMarkdown()}
`;

  // A platform-agnostic system prompt for ChatGPT, Gemini, Copilot, Okta AI, etc.
  const systemPrompt = `You are an AI assistant supporting ${role || 'the user described below'}${audience ? `, who serves ${audience}` : ''}. Follow this operating profile in every response — match their voice, respect their boundaries, and deliver results the way they prefer.

${generateMarkdown()}`;

  const handleGenerateLink = () => {
    const id = Math.random().toString(36).substring(2, 10);
    saveProfileSnapshot(id, profile);
    setShortcode(id);
    toast.success('Share link created');
  };
  const shareUrl = shortcode ? `${window.location.origin}${window.location.pathname}?id=${shortcode}` : '';

  const formats: Record<string, { label: string; hint: string; content: string; filename: string }> = {
    skill: {
      label: 'Skill (SKILL.md)',
      hint: 'A ready-to-upload Agent Skill file for Claude and other platforms that accept skills.',
      content: skillFile,
      filename: 'SKILL.md',
    },
    system: {
      label: 'System Prompt',
      hint: 'Paste into the system/instructions field of ChatGPT, Gemini, Copilot, Okta AI, or most other assistants.',
      content: systemPrompt,
      filename: 'system-prompt.md',
    },
    markdown: {
      label: 'Markdown',
      hint: 'Your plain profile — drop it into a doc, a Project, or anywhere that takes Markdown.',
      content: `# ${displayTitle}\n\n${generateMarkdown()}`,
      filename: 'profile.md',
    },
    json: {
      label: 'JSON',
      hint: 'Raw field data for custom integrations and automations.',
      content: JSON.stringify(profile, null, 2),
      filename: 'profile.json',
    },
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 1500);
  };

  const download = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="btn-gradient shadow-glow gap-2 px-5">
          <FileDown className="w-4 h-4" />
          Export Skill
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[680px] bg-background border-border text-foreground max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Export your profile</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Turn your profile into a skill file or system prompt you can upload to Claude, ChatGPT, Gemini, Copilot, and other tools.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <Tabs defaultValue="skill" className="w-full">
            <TabsList className="bg-muted border border-border w-full justify-start h-auto p-1 mb-3 overflow-x-auto">
              {Object.entries(formats).map(([key, f]) => (
                <TabsTrigger key={key} value={key} className="data-[state=active]:bg-brand data-[state=active]:text-white">
                  {f.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(formats).map(([key, f]) => (
              <TabsContent key={key} value={key} className="space-y-3 outline-none">
                <p className="text-xs text-muted-foreground leading-relaxed">{f.hint}</p>
                <div className="relative group">
                  <pre className="p-4 rounded-lg bg-muted/80 border border-border/40 font-mono text-[11px] leading-relaxed overflow-auto max-h-[320px] text-foreground selection:bg-brand/20 whitespace-pre-wrap break-words">
                    {f.content}
                  </pre>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" className="border-border/60 bg-muted text-xs h-9" onClick={() => copy(f.content)}>
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    Copy
                  </Button>
                  <Button className="btn-gradient text-xs h-9 px-4" onClick={() => download(f.content, f.filename)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download {f.filename}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <section className="p-4 rounded-xl bg-brand/5 border border-brand/15 space-y-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-brand" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Share link</h3>
              <Sparkles className="w-3 h-3 text-brand ml-auto" />
            </div>
            {!shortcode ? (
              <Button
                onClick={handleGenerateLink}
                variant="outline"
                className="w-full border-brand/30 bg-brand/5 text-foreground hover:bg-brand hover:text-white transition-colors"
              >
                Create a share link
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
            <p className="text-[10px] text-muted-foreground italic">Links open this profile on your own device — your data stays in your browser, nothing is uploaded.</p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
