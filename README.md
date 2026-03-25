# RoleOS

RoleOS is a structured context engine that helps align large language models (LLMs) with your communication style, work, and thought process. It gives AI systems richer context, clearer instructions, and more precise guidance on how to support you, then exports that profile into usable formats like Claude Skills, Gemini Gems, Custom GPTs, and more.

## Features

- **Full-stack architecture**: React + Vite frontend with TanStack Query and a Hono-powered API backend
- **Durable Objects**: Per-entity storage (users, chats) with automatic indexing and pagination
- **Modern UI**: shadcn/ui components, Tailwind CSS, and dark mode support
- **Type-safe**: End-to-end TypeScript with shared types across frontend and backend
- **Real-time demo**: Users, chat boards, and threaded messages with full CRUD operations
- **Responsive design**: Mobile-first layout with optional sidebar
- **Production-ready**: Error boundaries, logging, CORS handling, and health checks
- **Bun-powered**: Fast installs and dev server

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TanStack Query, React Router |
| Backend | Hono, Durable Objects |
| Styling | Tailwind CSS, shadcn/ui, Lucide Icons |
| Data | Durable Objects (per-entity), global KV-like store, indexed pagination |
| Tooling | Bun, Vite, Wrangler, TypeScript, ESLint |

## Prerequisites

- [Bun](https://bun.sh) — `curl -fsSL https://bun.sh/install | bash`
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) — `bunx wrangler@latest init` or install globally
- A Workers-compatible account (free tier is sufficient)

## Quick start

**Install dependencies:**
```bash
bun install
```

**Start the dev server** (frontend + Workers proxy):
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) (or `${PORT:-3000}`).

**Generate Worker types:**
```bash
bun run cf-typegen
```

**Build and preview:**
```bash
bun run build
bun run preview
```

## API reference

All endpoints are under `/api/` and return JSON in the shape `{ success: boolean; data?: T; error?: string }`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/users` | List users (supports `?cursor` and `?limit`) |
| `POST` | `/api/users` | Create a user |
| `DELETE` | `/api/users/:id` | Delete a user |
| `POST` | `/api/users/deleteMany` | Bulk delete users |
| `GET` | `/api/chats` | List chats |
| `POST` | `/api/chats` | Create a chat |
| `GET` | `/api/chats/:chatId/messages` | List messages in a chat |
| `POST` | `/api/chats/:chatId/messages` | Send a message |
| `DELETE` | `/api/chats/:id` | Delete a chat |
| `POST` | `/api/chats/deleteMany` | Bulk delete chats |
| `POST` | `/api/client-errors` | Report a client-side error |

Data is auto-seeded on first request. IDs use `crypto.randomUUID()`.

## Deployment

1. Log in via Wrangler:
```bash
bunx wrangler@latest login
```

2. If needed, update `wrangler.jsonc` with your account ID.

3. Deploy:
```bash
bun run deploy
```

Your app will be live at `https://<project>.workers.dev`.

> **Note:** Durable Objects use SQLite storage. Migrations run automatically on first deploy.

## Development guidelines

| Area | Where to edit |
|---|---|
| Frontend pages | `src/pages/HomePage.tsx` |
| Routing | `src/main.tsx` |
| Backend routes | `worker/user-routes.ts` (auto-reloads in dev) |
| Entities | Extend `IndexedEntity` in `worker/entities.ts` |
| Shared types | `shared/types.ts` |
| Styles | `tailwind.config.js` |
| Linting | `bun run lint` |

Hot reload is enabled for both the frontend and Worker routes.

## Documentation

- [Durable Objects guide](https://developers.cloudflare.com/durable-objects/)
- [Hono docs](https://hono.dev)
- [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query)
- [Bun docs](https://bun.sh/docs)

## Contributing

1. Fork and clone the repo
2. Run `bun install`
3. Run `bun dev`
4. Submit a PR

## License

MIT — see `LICENSE`.
