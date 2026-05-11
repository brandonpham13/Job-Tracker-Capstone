# Server (Backend)

Express + TypeScript API for the Job Application Tracker.

## Setup

```bash
npm install
npx prisma generate
```

## Scripts

- `npm run dev` — start the server in watch mode via `tsx`
- `npm run build` — compile TypeScript into `dist/`
- `npm start` — run the compiled server from `dist/`
- `npm run typecheck` — type-check without emitting

## Structure

```
server/
├── src/
│   ├── index.ts   # Entry point (starts the HTTP server)
│   └── app.ts     # Express app (routes, middleware)
├── package.json
├── tsconfig.json
└── .env.example
```

## Health check

Once running, visit:

```
GET http://localhost:3000/health  ->  { "status": "ok" }
```
