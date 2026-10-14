# Scope (MoSCoW)

Source of truth for what is in and out. Full plan: `examensarbete.md`.

## MVP
Anyone can search for a country and see a dashboard with data from several APIs
(facts, weather/climate, exchange rates, holidays), shown as charts and grids.
Anyone can compare 2-3 countries side by side (no login). A logged-in user can
save favourites. The app is deployed and works on desktop.

## Must
- Country selection (search, optional map) with an overview page
- Dashboard with at least 4 widgets: weather/climate, exchange rates, country facts, holidays
- Compare 2-3 countries side by side (charts and grid), no login required
- Data visualisation (charts, data grid with sorting and filtering)
- User registration, login, logout
- Saving favourite countries (login required)
- Basic error handling (every widget has loading and error states)

## Should
- AI travel assistant chat about the selected country (Claude API, SSE, tool use)
- Things to do / sights list with a map
- Basic trip planner: dates, saved destinations, notes, checklist
- Responsive design

## Could
- Currency converter widget
- Dark mode, Swedish/English
- Export trip plan as PDF
- Unit tests for core services

## Won't
- Booking of flights or hotels
- Payment handling
- Native mobile app
- Social features (sharing, comments, reviews)

## Definition of Done
- All Must items work in the deployed version
- The app doesn't crash if an external API is down
- Public link and a README explaining how to run locally
- No critical bugs, basic responsive layout

## Sprints
| Sprint | Dates | Goal |
|---|---|---|
| 1 | Oct 12-18 | Foundation and first data: repo, Express, test APIs, country search, first two widgets |
| 2 | Oct 19-25 | Full dashboard, data grid, error handling, compare view (no login). Supervision Oct 21 |
| 3 | Oct 26-Nov 1 | Supabase auth, favourites with RLS, first early deploy |
| 4 | Nov 2-8 | AI assistant (Should). Supervision Nov 4 |
| 5 | Nov 9-15 | Deploy, bug fixes, responsive polish, README, result section. Submit before Nov 16 |
| Buffer | Nov 16-18 | Presentation |
