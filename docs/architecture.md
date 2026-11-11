# Architecture

```
Angular SPA (Vercel)
  |
  |-- Supabase (auth + Postgres: favourites, trips)   direct, protected by RLS
  |
  `-- Node/Express API (Render or similar)
        |-- /api/countries, /weather, /rates, /holidays, /about, /places, /images  -> external APIs
        `-- /api/chat (SSE streaming) -> Claude API (tool use)   [dropped for now]
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
| REST Countries v5 | facts, flags, currencies, languages | yes (server only) |
| MET Norway | weather forecast | no (needs a User-Agent) |
| Open-Meteo geocoding | city search | no |
| Frankfurter v2 | exchange rates and history | no |
| Nager.Date | public holidays | no |
| Wikipedia | About text and capital photos | no (needs a User-Agent) |
| Claude API | travel assistant, dropped for now | yes |

World Bank and Wikipedia geosearch (things to do) were not used.

## Conventions
See `CLAUDE.md`. Server normalises third-party data into our own types before
it reaches the client.

## Decisions
- Chart/grid/UI: ECharts, AG Grid and Angular Material
- Hosting: client on Vercel, server on Render
