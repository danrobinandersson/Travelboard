# Progress

Update after every task. Check this before starting one.

## Current sprint
Sprint 3 (Oct 26-Nov 1): Auth and deploy. Supervision Nov 4.
Sprint 2 leftovers are carried over (marked below).

## Live
- Server: https://travelboard.onrender.com (Render free plan, sleeps when idle, first request takes 30-60 s, wake it before presenting)
- Client: Vercel (add link here)
- Repo: https://github.com/danrobinandersson/Travelboard

## Done
- Angular client, Express server, CLAUDE.md, project docs, header, footer, styling
- Exchange rates: Frankfurter v2 service, `GET /api/rates`, widget with loading/error states, chart/grid toggle, re-fetches when the country changes
- Countries: REST Countries v5 service (24 h cache), `GET /api/countries` and `/api/countries/:code`, now with capital, coordinates and population
- Country picker (dropdown) wired to the exchange rate widget
- Routing: home page with the picker, and a country page at `/country/:code` with the exchange rate widget
- `vercel.json` so refreshing a page on Vercel doesn't give a 404
- Chart and grid library chosen and in use: ECharts (charts), AG Grid (data grid), Angular Material (UI)
- Weather: `GET /api/weather` (MET Norway, 30 min cache) and a weather widget on the country page with current weather, a 7-day forecast and the MET Norway credit. The heading says if it is the capital or the country centre
- Deployment: server on Render, client on Vercel, environment files for the API URL (`client/src/environments/`), server build/start scripts
- Git: feature branches merged into `develop` and `main`. Work on `develop`, merge into `main` only to deploy

## In progress
- (nothing)

## Next
- [ ] Verify on Render: the weather widget works on the deployed site
- [ ] Verify on Vercel after the next deploy: picker, chart/grid toggle and exchange widget work against the Render server, and refreshing `/country/SE` works (tests `vercel.json`)
- [ ] Test capital/coordinates/population for edge cases (AQ, BO, ZA, PA)
- [ ] Country facts widget (data already in `Country`)
- [ ] Holidays widget (test Nager.Date first)
- [ ] Exchange widget gaps: use the first currency Frankfurter supports, handle base equals target, add a cache on the server
- [ ] Compare view for 2-3 countries (no login)
- [ ] Supabase login and favourites
- [ ] AI chat (Should)
- [ ] Tests, README
- [ ] Add GitHub, Vercel and Render links to `examensarbete.md` (before Nov 16)
- [ ] Delete merged feature branches (optional)

## Not tested yet
- Nager.Date (holidays)
- World Bank API (comparison indicators)
- Sights API (OpenTripMap or Wikivoyage, Should)

## Later
- Sprint 4 (Nov 2-8): AI assistant (Should). Supervision Nov 4
- Sprint 5 (Nov 9-15): polish, README, result section. Submit before Nov 16
- Presentation Nov 19-20

## Known limitations
- The exchange rate widget uses only a country's first currency (`currencies[0]`)
- Exchange rates only exist for about 30 major currencies (Frankfurter), so some countries show "not available"
- Initial bundle is large (AG Grid, ECharts, Material), so the budget in `angular.json` was raised to warn 3 MB / error 4 MB. Possible fix later: lazy-load the dashboard route
- CORS allows all origins (`cors()`), could be restricted to the Vercel domain
- Weather daily rows are grouped by UTC date, so the first day is partial

## Decisions
- 2026-10-26: The country page loads its data from the URL, so refresh and shared links work
- 2026-10-14: AI chat is Should, not part of the MVP
- 2026-10-14: Compare view does not require login
- 2026-10-14: Client on Vercel, server on Render
- 2026-10-14: Frankfurter v2 API (v1 is deprecated), one request returns history, latest is the last row
- 2026-10-16: REST Countries v5 (needs an API key, set only in `server/.env` and on Render). All countries are fetched once and cached for 24 h, search and lookup run in memory
- 2026-10-23: Chart/grid library: ECharts and AG Grid (free), not DevExtreme
- 2026-10-26: Weather provider switched from Open-Meteo to MET Norway (Locationforecast 2.0, no key, needs an identifying `User-Agent`). Open-Meteo returned 429 "daily limit exceeded" on Render because the IP is shared. Not a code bug. The response now has `symbol` (MET string, e.g. `partlycloudy_day`) instead of a WMO `weatherCode`, and wind in m/s instead of km/h
- 2026-10-26: Deployment config fixes: `server/tsconfig.json` has `rootDir`, `outDir` and `include: src/**/*` (otherwise `scratch/` broke the build). Feature branches had never been merged and were merged into `main` and `develop`
