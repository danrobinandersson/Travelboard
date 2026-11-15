# Travelboard

A travel planning dashboard. Pick a country and see its facts, weather, exchange rates, public holidays, a map and a short Wikipedia article in charts, grids and cards. Log in to save favourite countries, and compare up to three countries side by side.

Built as a degree project (examensarbete) in 2026.

- **Live app:** https://travelboard-nu.vercel.app
- **API server:** https://travelboard.onrender.com (Render's free plan, see the note below)
- **Repository:** https://github.com/danrobinandersson/Travelboard

> **Note:** the server sleeps when it is idle, so the first request after a break can take 30-60 seconds. If the live app shows errors at first, wait a minute and reload.

## Features

- **Country search** on the home page and in the header, with a flag and a list of about 250 countries
- **Country page** with widgets for:
  - Facts: capital, population, area, languages, currencies, time zone, driving side, EU and Schengen
  - About: the capital's photo and the country's Wikipedia text
  - Weather: current weather and a 7-day forecast, for the capital or any city in the country
  - Exchange rates: a chart or table of the last 30 days, with a choice of base currency
  - Public holidays: a chart (per month) or a sortable, filterable table
  - A map that follows the city you pick
- **Compare 2-3 countries** (no login needed): facts, weather and the exchange rate against SEK, with a star on the best value in each row
- **Login, register, log out** with Supabase
- **Favourites** (login required): saved per user and protected by Row Level Security
- Every widget has loading and error states, so the app keeps working if an external API is down

## Tech stack

| Part | Technology |
|---|---|
| Client | Angular 21 (standalone components, signals), TypeScript, SCSS |
| UI and visuals | Angular Material, ECharts (charts), AG Grid (data grids), Leaflet (map) |
| Server | Node.js, Express 5, TypeScript (ES modules) |
| Login and database | Supabase (auth and Postgres with Row Level Security) |
| Hosting | Vercel (client), Render (server), Supabase (database and auth) |

## Data sources

The server calls these APIs, caches the answers in memory, and sends the client its own simplified types.

| Source | Used for | Key |
|---|---|---|
| [REST Countries](https://restcountries.com) v5 | facts, flags, currencies, languages | yes (server only) |
| [MET Norway](https://api.met.no/) | weather forecast | no |
| [Open-Meteo geocoding](https://open-meteo.com/en/docs/geocoding-api) | city search | no |
| [Frankfurter](https://frankfurter.dev) v2 | exchange rates | no |
| [Nager.Date](https://date.nager.at) | public holidays | no |
| [Wikipedia](https://www.wikipedia.org) | About text and capital photos | no |
| [OpenStreetMap](https://www.openstreetmap.org/copyright) | map tiles (loaded by the browser) | no |

## Project structure

```
client/   Angular app (pages, widgets, services, models)
server/   Express API (routes, services, types). Keeps API keys secret
docs/     Project plan, scope, architecture and progress notes
```

On the server there is one route file per resource (`/api/countries`, `/rates`, `/weather`, `/holidays`, `/about`, `/places`, `/images`) and one service file that fetches, caches and normalises the data. On the client, every widget is one component and gets its data through a service.

## Run it locally

You need **Node.js 20.19 or newer** (it was developed on Node 25) and npm.

### 1. The server

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and fill it in:

```
PORT=3000
RESTCOUNTRIES_API_KEY=your_key_here
```

You need your own REST Countries v5 API key from [restcountries.com](https://restcountries.com). The `.env` file is ignored by git, so the key is never committed. Then start the server:

```bash
npm run dev
```

It runs on http://localhost:3000. Check http://localhost:3000/api/health, which should answer `{"status":"ok"}`.

### 2. The client

In a second terminal:

```bash
cd client
npm install
npx ng serve
```

Open http://localhost:4200. The dev build talks to the server on `http://localhost:3000/api` (set in `client/src/environments/environment.development.ts`).

> The server only accepts requests from `http://localhost:4200` and the live app's address. If you run the client on another port or address, add it to `allowedOrigins` in `server/src/index.ts`.

### 3. Login and favourites (Supabase)

The environment files in `client/src/environments/` contain the URL and the public ("anon") key of the author's Supabase project, so login and favourites work out of the box. The anon key is meant to be public. What it can do is limited by Row Level Security, and the secret keys are never in the repository.

To use **your own** Supabase project instead:

1. Create a project at [supabase.com](https://supabase.com).
2. Under **Project Settings, API**, copy the project URL and the anon or publishable key into both `environment.ts` and `environment.development.ts`. Never use the `service_role` or secret key in the client.
3. Under **Authentication, Providers, Email**, turn off "Confirm email". Supabase's built-in email service only sends a few emails per hour.
4. In the **SQL editor**, create the favourites table and its policies:

```sql
create table public.favourites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  country_code text not null,
  created_at timestamptz not null default now(),
  unique (user_id, country_code)
);

alter table public.favourites enable row level security;

create policy "Users can read their own favourites"
  on public.favourites for select to authenticated
  using (user_id = auth.uid());

create policy "Users can add their own favourites"
  on public.favourites for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can delete their own favourites"
  on public.favourites for delete to authenticated
  using (user_id = auth.uid());
```

## Deployment

- **Server (Render):** a Web Service with the root directory `server`. Build command `npm install && npm run build`, start command `npm start`. Set the environment variable `RESTCOUNTRIES_API_KEY` in Render's dashboard.
- **Client (Vercel):** the root directory is `client`. It builds with `ng build` and serves `dist/client/browser`. `client/vercel.json` rewrites every path to `index.html`, so refreshing a page such as `/country/SE` works.
- The production build uses `client/src/environments/environment.ts`, which points to the Render server.
- Work happens on feature branches that are merged into `develop`. `main` is merged from `develop` only when deploying.

## Known limitations

- The exchange rate widget uses only a country's first currency. A country with several currencies may show the less common one.
- The compare view uses the capital's weather. "Warmest" is not always "best", and the note in the modal explains what each star means.
- A capital with an ambiguous name can get an unrelated photo, and a country without a capital gets none.
- The weather forecast groups days by UTC date, so the first day is partial.
- The server's cache is in memory, so it is empty after the server restarts.
- The layout is designed mainly for desktop. On narrow screens the widgets stack in one column.
- There are no automated tests.

## Future work

- An AI travel assistant (Claude API with streaming and tool calling)
- A "things to do" list from Wikipedia
- A trip planner (dates, notes, checklist)
- Show, hide and reorder the widgets
- Charts in the compare view, and more rows such as holidays
- A server cache for exchange rates
- Unit tests

## Credits

- Weather data from [MET Norway](https://api.met.no/).
- Text from Wikipedia is available under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Photos come from Wikipedia and Wikimedia Commons.
- Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
- Exchange rates from Frankfurter, which uses data from central banks. Holidays from Nager.Date.

## Licence

MIT, see [LICENSE](LICENSE).
