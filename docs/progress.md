# Progress

Update after every task. Check this before starting one.

## Current sprint

Final stretch. Deadline moved to Nov 16 (changes allowed until Nov 19-20).
Plan: styling, compare view, map and things to do, show/hide widgets, README.

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
- Facts widget: capital, population, region, languages and currencies
- Holidays: Nager.Date service (24 h cache), `GET /api/holidays`, widget with a chart (holidays per month) and an AG Grid table with sorting and filtering
- Supabase login: auth service, `/login` page (log in and register), header shows email and log out, `authGuard` ready to use. Email confirmation is off
- Favourites: `favourites` table with RLS, save button on the country page, `/favourites` page (login required), link in the header
- About text from Wikipedia (`GET /api/about`), shown in the facts widget via a toggle
- Weather for cities: place search (`GET /api/places`, Open-Meteo geocoding, 24 h cache), pick a city and the weather widget follows, reset goes back to the capital
- Git: feature branches merged into `develop` and `main`. Work on `develop`, merge into `main` only to deploy

## In progress

- (nothing)

## Next

- [ ] Verify on Render: weather and city search (Open-Meteo geocoding may be rate limited there)
- [ ] Verify on Vercel after the next deploy: picker, chart/grid toggle and exchange widget work against the Render server, and refreshing `/country/SE` works (tests `vercel.json`)
- [ ] Test capital/coordinates/population for edge cases (AQ, BO, ZA, PA)
- [ ] Exchange widget gaps: use the first currency Frankfurter supports, handle base equals target, add a cache on the server
- [ ] Styling: theme, cards, hero header, widgets of different sizes
- [ ] Compare view for 2-3 countries (no login): temperature and exchange rate charts plus a grid
- [ ] Map (Leaflet) and things to do (Wikipedia geosearch)
- [ ] Show/hide widgets, then drag to reorder (if time)
- [ ] Test Register on the login page (hit Supabase's email rate limit, test user was added in the dashboard)
- [ ] Tests, README
- [ ] Add GitHub, Vercel and Render links to `examensarbete.md` (before Nov 16)
- [ ] Delete merged feature branches (optional)

## Not tested yet

- World Bank API (comparison indicators)
- Wikipedia geosearch (things to do)

## Later

- AI chat (Should): dropped for now, mention as future work
- Nov 15: README, result section, deploy. Submit Nov 16
- Presentation Nov 19-20

## Known limitations

- The exchange rate widget uses only a country's first currency (`currencies[0]`)
- Exchange rates only exist for about 30 major currencies (Frankfurter), so some countries show "not available"
- Initial bundle is large (AG Grid, ECharts, Material), so the budget in `angular.json` was raised to warn 3 MB / error 4 MB. Possible fix later: lazy-load the dashboard route
- CORS allows all origins (`cors()`), could be restricted to the Vercel domain
- Weather daily rows are grouped by UTC date, so the first day is partial

## Decisions

- 2026-11-07: After feedback, priority is styling, compare view, map and things to do. AI chat is dropped for now
- 2026-11-07: City search uses Open-Meteo geocoding only. The weather itself still comes from MET Norway

- 2026-10-26: The country page loads its data from the URL, so refresh and shared links work
- 2026-10-14: AI chat is Should, not part of the MVP
- 2026-10-14: Compare view does not require login
- 2026-10-14: Client on Vercel, server on Render
- 2026-10-14: Frankfurter v2 API (v1 is deprecated), one request returns history, latest is the last row
- 2026-10-16: REST Countries v5 (needs an API key, set only in `server/.env` and on Render). All countries are fetched once and cached for 24 h, search and lookup run in memory
- 2026-10-23: Chart/grid library: ECharts and AG Grid (free), not DevExtreme
- 2026-10-26: Weather provider switched from Open-Meteo to MET Norway (Locationforecast 2.0, no key, needs an identifying `User-Agent`). Open-Meteo returned 429 "daily limit exceeded" on Render because the IP is shared. Not a code bug. The response now has `symbol` (MET string, e.g. `partlycloudy_day`) instead of a WMO `weatherCode`, and wind in m/s instead of km/h
- 2026-10-26: Deployment config fixes: `server/tsconfig.json` has `rootDir`, `outDir` and `include: src/**/*` (otherwise `scratch/` broke the build). Feature branches had never been merged and were merged into `main` and `develop`
