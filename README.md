# Cloudflare Workers React Template

[![Deploy to Cloudflare][cloudflarebutton]]

A production-ready full-stack starter template for Cloudflare Workers with React frontend, Hono backend, and Durable Objects for persistent state management. Includes a demo chat application with users, chat boards, and real-time messaging.

## 🚀 Features

- **Full-Stack Architecture**: React + Vite frontend with TanStack Query, Hono-powered Workers API.
- **Durable Objects**: Per-entity storage (users, chats) with automatic indexing and pagination.
- **Modern UI**: shadcn/ui components, Tailwind CSS, dark mode support.
- **Type-Safe**: End-to-end TypeScript with shared types.
- **Real-Time Demo**: Users, chat boards, threaded messages with CRUD operations.
- **Responsive Design**: Mobile-first, sidebar layout option.
- **Production-Ready**: Error boundaries, logging, CORS, health checks.
- **Bun-Powered**: Fast installs and dev server.

## 🛠️ Tech Stack

| Frontend | Backend | Styling | Data | Tools |
|----------|---------|---------|------|-------|
| React 18 | Hono | Tailwind CSS | Durable Objects | Bun, Vite, Wrangler |
| TanStack Query | Cloudflare Workers | shadcn/ui | Global KV-like storage | TypeScript |
| React Router | Durable Objects | Lucide Icons | Indexed pagination | ESLint |

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed (`curl -fsSL https://bun.sh/install | bash`)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (`bunx wrangler@latest init` or global install)
- Cloudflare account (free tier sufficient)

### Installation

```bash
bun install
```

### Development

Start the dev server (frontend + Workers proxy):

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) (or `${PORT:-3000}`).

Generate Worker types:

```bash
bun run cf-typegen
```

### Build & Preview

```bash
bun run build
bun run preview
```

## 🌐 API Endpoints

All endpoints under `/api/` with JSON responses `{ success: boolean; data?: T; error?: string }`.

- `GET /api/health` - Health check
- `GET/POST /api/users` - List/create users (supports `?cursor` & `?limit`)
- `DELETE /api/users/:id`, `POST /api/users/deleteMany`
- `GET/POST /api/chats` - List/create chats
- `GET/POST /api/chats/:chatId/messages` - List/send messages
- `DELETE /api/chats/:id`, `POST /api/chats/deleteMany`
- `POST /api/client-errors` - Client error reporting

Data auto-seeded on first request. Uses `crypto.randomUUID()` for IDs.

## ☁️ Deployment

1. Login to Cloudflare:
   ```bash
   bunx wrangler@latest login
   ```

2. Configure `wrangler.jsonc` with your account ID if needed.

3. Deploy:
   ```bash
   bun run deploy
   ```

Your app will be live at `https://<project>.workers.dev`.

[![Deploy to Cloudflare][cloudflarebutton]]

**Note**: Durable Objects use SQLite storage; first deploy runs migrations automatically.

## 🧑‍💻 Development Guidelines

- **Frontend**: Edit `src/pages/HomePage.tsx` or add routes in `src/main.tsx`.
- **Backend**: Add routes in `worker/user-routes.ts` (auto-reloads in dev).
- **Entities**: Extend `IndexedEntity` in `worker/entities.ts`.
- **Shared Types**: `shared/types.ts`.
- **Styles**: Tailwind config in `tailwind.config.js`.
- **Lint**: `bun run lint`.

Hot-reload works for both frontend and Worker routes.

## 📚 Documentation

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Durable Objects Guide](https://developers.cloudflare.com/durable-objects/)
- [Hono Docs](https://hono.dev/)
- [shadcn/ui](https://ui.shadcn.com/)

## 🤝 Contributing

1. Fork & clone
2. `bun install`
3. `bun dev`
4. Submit PR

## 📄 License

MIT License - see [LICENSE](LICENSE) (or add one).