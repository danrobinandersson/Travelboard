# Progress

Update after every task. Check this before starting one.

## Current sprint

Final stretch. Hand-in Nov 16
Left: deploy check, small hardening, error-handling and responsive check, README, result section. No changes after Nov 16.

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
- Styling: design tokens in `styles.scss`, Material cards and buttons, header with logo, account menu and search icon, home page hero
- Compare view: Compare button, popover (bottom right) and a modal with facts, weather, exchange rate against SEK and a star on the best value in each row. Max 3 countries, the selection is saved in `localStorage`
- Photos on the favourite cards: `GET /api/images` (photo of the capital from Wikipedia, 24 h cache)
- Countries without an ISO code (e.g. Abkhazia) are filtered out of the country list
- Git: feature branches merged into `develop` and `main`. Work on `develop`, merge into `main` only to deploy

## In progress

- (nothing)

## Next

- [ ] Merge to `develop` and `main`, commit `client/public/` (logo, hero), then verify the live site: weather, city search, favourites, compare, photos, login and refreshing `/country/SE` (tests `vercel.json`)
- [ ] Hardening: only accept Wikimedia image hosts and cap the cache in `imageService.ts`, restrict CORS to the Vercel domain
- [ ] Test Register on the login page (hit Supabase's email rate limit, test user was added in the dashboard)
- [ ] Error handling: stop the server or block a request and check every widget shows its error
- [ ] Check the layout on a narrow window (header, widgets, compare modal, favourite cards)
- [ ] README and the result section in `examensarbete.md`
- [ ] Add GitHub, Vercel and Render links to `examensarbete.md`
- [ ] Delete merged feature branches (optional)

## Future work (not done, mention in the result section)

- AI chat (Claude API, SSE, tool use)
- Map (Leaflet) and things to do (Wikipedia geosearch)
- Show/hide and reorder widgets
- Exchange widget gaps: use the first currency Frankfurter supports, handle base equals target, server cache
- Compare: charts, more rows (e.g. holidays), World Bank indicators
- Unit tests
- Edge cases for capital/coordinates/population (AQ, BO, ZA, PA)

## Later

- Nov 15: README, result section, final deploy. Submit Nov 16
- Presentation Nov 19-20 (no code changes)

## Known limitations

- The exchange rate widget uses only a country's first currency (`currencies[0]`)
- Exchange rates only exist for about 30 major currencies (Frankfurter), so some countries show "not available"
- Initial bundle is large (AG Grid, ECharts, Material), so the budget in `angular.json` was raised to warn 3 MB / error 4 MB. Possible fix later: lazy-load the dashboard route
- CORS allows all origins (`cors()`), could be restricted to the Vercel domain
- Weather daily rows are grouped by UTC date, so the first day is partial
- Compare uses the capital's weather and a country's first currency. "Warmest" is not always "best"
- A capital with an ambiguous name can get an unrelated photo, and a country without a capital gets none

## Decisions

- 2026-11-07: After feedback, priority is styling, compare view, map and things to do. AI chat is dropped for now
- 2026-11-07: City search uses Open-Meteo geocoding only. The weather itself still comes from MET Norway
- 2026-11-11: In the compare view "best exchange rate" means SEK gained the most over the last 30 days. The raw rate is misleading (JPY would always win)
- 2026-11-11: Photos come from the capital's Wikipedia page, because a country page's main image is its flag
- 2026-10-26: The country page loads its data from the URL, so refresh and shared links work
- 2026-10-14: AI chat is Should, not part of the MVP
- 2026-10-14: Compare view does not require login
- 2026-10-14: Client on Vercel, server on Render
- 2026-10-14: Frankfurter v2 API (v1 is deprecated), one request returns history, latest is the last row
- 2026-10-16: REST Countries v5 (needs an API key, set only in `server/.env` and on Render). All countries are fetched once and cached for 24 h, search and lookup run in memory
- 2026-10-23: Chart/grid library: ECharts and AG Grid (free), not DevExtreme
- 2026-10-26: Weather provider switched from Open-Meteo to MET Norway (Locationforecast 2.0, no key, needs an identifying `User-Agent`). Open-Meteo returned 429 "daily limit exceeded" on Render because the IP is shared. Not a code bug. The response now has `symbol` (MET string, e.g. `partlycloudy_day`) instead of a WMO `weatherCode`, and wind in m/s instead of km/h
- 2026-10-26: Deployment config fixes: `server/tsconfig.json` has `rootDir`, `outDir` and `include: src/**/*` (otherwise `scratch/` broke the build). Feature branches had never been merged and were merged into `main` and `develop`
