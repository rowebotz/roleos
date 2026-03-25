# RoleOS

**Build your personal AI operating profile.**

RoleOS is a structured context engine that helps align large language models (LLMs) with your communication style, work, and thought process. Fill out your profile across key taxonomies, then export it directly into Claude Skills, Gemini Gems, Custom GPTs, and more.

🔗 **[Try it live →](https://rowebotz.github.io/roleos/)**

---

## What it does

Most people use AI with zero context. RoleOS fixes that by giving you a structured way to define:

- Your professional identity and role
- How you think and communicate
- Your workflows, tools, and constraints
- Your voice, tone, and output preferences

Once filled out, the **System Deployment Hub** exports your profile into ready-to-use formats for any major AI platform.

## Export formats

- **Claude Skills** — paste directly into a Claude Project
- **Custom GPTs** — drop into the GPT builder system prompt
- **Gemini Gems** — configure your Gemini persona
- **JSON Raw** — for custom integrations

## How to use it

1. Visit [rowebotz.github.io/roleos](https://rowebotz.github.io/roleos/)
2. Click **Initialize System**
3. Work through the taxonomy sections in the left sidebar
4. Click **Deploy Profile** to open the export panel
5. Choose your platform and download or copy your profile

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
