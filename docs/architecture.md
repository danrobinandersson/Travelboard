# Architecture

```
Angular SPA (Vercel)
  |
  |-- Supabase (auth + Postgres: favourites, trips)   direct, protected by RLS
  |
  `-- Node/Express API (Render or similar)
        |-- /api/country, /weather, /rates, /holidays, /indicators  -> external APIs
        `-- /api/chat (SSE streaming) -> Claude API (tool use)   [Should]
```

## Why this shape
- The client never sees third-party API keys. The server proxies and caches.
- Supabase handles auth and per-user data directly from the client. RLS makes
  that safe, so no custom auth backend is needed. Only the anon key is in the client.
- The server is a long-running process (not serverless), so the in-memory TTL
  cache and SSE streaming work as expected. That is why it is not on Vercel.

## External APIs
| API | Used for | Key |
|---|---|---|
| REST Countries | facts, flags, currencies, languages | no |
| Open-Meteo | forecast and historical climate | no |
| Frankfurter | exchange rates and history | no |
| Nager.Date | public holidays | no |
| World Bank | indicators for comparison (population, GDP, tourism) | no |
| OpenTripMap or Wikivoyage | sights (Should) | maybe |
| Claude API | travel assistant (Should), server side only | yes |

Final choices are made in Sprint 1 after testing the APIs.

## Conventions
See `CLAUDE.md`. Server normalises third-party data into our own types before
it reaches the client.

## Open decisions
- Chart/grid library: a free alternative, not yet chosen
- Server host: Render, Railway or Fly
- Final list of APIs (decide in Sprint 1)
