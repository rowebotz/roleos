# RoleOS

**Build your AI profile. Export it as a skill.**

RoleOS helps anyone — in any line of work — turn how they work, think, and communicate into a structured profile. Fill out a handful of short sections, then export it as a ready-to-upload **skill file** or **system prompt** for Claude, ChatGPT, Gemini, Copilot, and other AI tools.

🔗 **[Try it live →](https://rowebotz.github.io/roleos/)**

---

## What it does

Most people use AI with zero context, so it answers like it's talking to a stranger. RoleOS fixes that by giving you a simple way to define:

- Your role, audience, and the outcomes you care about
- How you work and what you know
- Your voice, principles, and boundaries

Once filled out, the **Export** panel turns your profile into formats you can drop into any major AI tool.

## Export formats

- **Skill (`SKILL.md`)** — a valid Agent Skill file (YAML frontmatter + Markdown) you can upload to Claude and other platforms that accept skills
- **System Prompt** — paste into ChatGPT, Gemini, Copilot, Okta AI, or any assistant's instructions field
- **Markdown** — your plain profile for docs or Projects
- **JSON** — raw field data for custom integrations

## How to use it

1. Visit [rowebotz.github.io/roleos](https://rowebotz.github.io/roleos/)
2. Work through the short sections in the left sidebar
3. Use **✦ Rewrite** on any field to sharpen your wording
4. Click **Export Skill** and download or copy the format you need

No account required. All data is stored locally in your browser.

---

## Running locally

**Prerequisites:**
- [Bun](https://bun.sh) — `curl -fsSL https://bun.sh/install | bash`

**Install and run:**
```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

**Build:**
```bash
bun run build
```

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TanStack Query, React Router |
| State | Zustand with localStorage persistence |
| Styling | Tailwind CSS, shadcn/ui, Lucide Icons |
| Tooling | Bun, Vite, TypeScript |

## License

MIT
