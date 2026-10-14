# Travelboard

Travel planning dashboard. The user picks a country and sees data from several
APIs (facts, weather/climate, exchange rates, holidays) in charts and grids.
Users can log in, save favourites, compare 2-3 countries and chat with an AI
travel assistant. This is a 5-week school project (examensarbete), so keep
scope small and prefer simple solutions.

## Structure
- `client/`: Angular SPA (TypeScript, SCSS), standalone components, no SSR
- `server/`: Node + Express (TypeScript, ES modules). Proxies and caches
  external APIs, hosts the AI chat endpoint, keeps API keys secret
- Supabase: auth + Postgres (favourites, trips), protected by Row Level Security
- Chart/grid library: TBD, a free one (not DevExtreme)
- Hosting: client on Vercel, server on Render or similar, DB/auth on Supabase

## Commands
- Client: `cd client && ng serve` (http://localhost:4200)
- Server: `cd server && npm run dev` (http://localhost:3000)

## Angular conventions
- Standalone components only, no NgModules
- Use signals for state; `inject()` instead of constructor injection
- Use the new control flow (`@if`, `@for`), not `*ngIf` / `*ngFor`
- One widget = one component, data fetched through a service
- Every data widget needs loading and error states
- Strict typing, no `any`. Define interfaces for API responses

## Server conventions
- Routes under `/api/...`, one file per resource
- External API responses are cached in memory with a TTL
- Normalise third-party data into our own types before sending to the client
- Never log or return secrets. Config via `server/.env` (gitignored)

## AI chat (Claude API)
- Called only from the server, never from the browser
- Uses tool calling (e.g. get_weather, get_exchange_rate) that reuses the same
  services as the dashboard
- Streamed to the client with SSE. Model name comes from an env variable
- System prompt limits it to travel topics, with no visa or legal claims

## How to work with me
- I want to understand the code. Briefly explain what you changed and why, and
  point out Angular/TypeScript concepts I might not know
- Make small changes and propose a plan before large ones
- Ask before adding new dependencies
- Don't add features outside the MoSCoW scope in README/examensarbete.md
- Suggest improvements, but separate "must fix" from "nice to have"

## Security
- Never commit `.env` or API keys
- Don't touch `.gitignore` to include secrets or `node_modules`

## Project docs (read when relevant)
- Full plan: @docs/examensarbete.md
- Scope and priorities: @docs/scope.md
- Architecture and APIs: @docs/architecture.md
- Current status: @docs/progress.md

Before starting a task, check docs/progress.md. After finishing one, update it.