# Progress

Update after every task. Check this before starting one.

## Current sprint
Sprint 2 (Oct 19-25): Full dashboard. Supervision Oct 21.
Sprint 1 leftovers are carried over (marked below).

## Done
- Angular client, Express server skeleton, CLAUDE.md and project docs
- Header, footer and basic styling
- Exchange rates: Frankfurter v2 service on the server (validation, error class),
  `GET /api/rates`, client service, and a widget with loading/error states that
  re-fetches when the country changes
- Countries: REST Countries v5 service (API key in `server/.env`, 24 h cache),
  `GET /api/countries` and `/api/countries/:code`, client service
- Country picker (search and select) wired to the exchange rate widget
- APIs tested and working: Frankfurter, REST Countries

## In progress
- (nothing)

## Next
- [ ] Choose the chart/grid library (Sprint 1 leftover, everything else depends on it)
- [ ] Country facts widget (add capital, population, region, languages to `FIELDS` in `countriesService.ts`)
- [ ] Test Open-Meteo and Nager.Date with curl (no key needed), then decide
- [ ] Weather/climate widget
- [ ] Holidays widget
- [ ] Country overview page with routing (Sprint 1 leftover, `app.routes.ts` is empty)
- [ ] Data grid with sorting and filtering
- [ ] Compare view for 2-3 countries (no login)
- [ ] Error handling review across widgets

## Not tested yet
- World Bank API (comparison indicators)
- Sights API (OpenTripMap or Wikivoyage, Should)

## Questions for supervision Oct 21
- Is the compare view realistic in Sprint 2, or move it to Sprint 3?
- AI assistant scope

## Later
- Sprint 3: Supabase auth, favourites, first early deploy
- Sprint 4: AI assistant (Should)
- Sprint 5: deploy, polish, README, result section

## Known limitations
- The exchange rate widget uses only a country's first currency (`currencies[0]`)
- Exchange rates only exist for about 30 major currencies (Frankfurter), so some countries show "not available"

## Decisions
- 2026-10-14: AI chat is Should, not part of the MVP
- 2026-10-14: Compare view does not require login
- 2026-10-14: Client on Vercel, server on Render or similar
- 2026-10-14: Free chart/grid library, not DevExtreme (not yet chosen)
- 2026-10-14: Frankfurter v2 API (v1 is deprecated), one request returns history, latest is the last row
- 2026-10-16: REST Countries v5 (needs an API key). All countries are fetched once and cached for 24 h, search and lookup run in memory
