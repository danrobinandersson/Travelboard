### Initial idea

- Project Overview

    - Short description of the project (elevator pitch)?
      * This project is a dashboard for planning your travels. The user picks a country and instantly sees a data-rich overview: for example best time         to visit, live weather, exchange rates, intersting facts, popular sights etc. A built-in AI travel assistant helps to answer questions you might           have about your trip. Logged-in users can save favourite countries, compare destinations and plan trips.
    
    - What is the name of the project?
      * Travelboard
        
- Tech Stack & Architecture

    - What technologies do you plan to use? (frontend, backend, DB, hosting, third-party services, APIs etc)
 
      Frontend:	Angular, TypeScript, free chart/grid library (not yet decided)
      Backend:	Node.js + Express (TypeScript)
      Database and auth: Supabase (Postgres and auth) for users, favourites, trips
      AI: Travel agent assistant
      Hosting:	Vercel (Angular client), Render or similar (Express server), Supabase (database and auth)
      API:s (some preliminary ideas):
        •	REST Countries: country facts, flags, currencies, languages
        •	Open-Meteo: forecast and historical climate data, no key needed. Alternative: https://www.weatherapi.com/
        •	Frankfurter: exchange rates and historical rate trends, no key needed
        •	World Bank API: population, GDP, tourism arrivals and other indicators for comparison charts and grids
        •	Nager.Date: public holidays per country
        •	OpenTripMap or Wikipedia/Wikivoyage API: sights and things to do

- Moscow 

    - Must
        •	Country selection (search function, optional: map) with a country overview page
        •	Dashboard with at least 4 data widgets: weather/climate, exchange rates, country facts, holidays
        •	Compare 2–3 countries side by side (charts and grid)
        •	Data visualisation (charts, DataGrid with sorting and filtering)
        •	User login, registration, authentication
        •	Saving favourite countries
        •	Basic error handling
        

    - Should
       
        •	AI travel assistant chat that answers questions about the selected country
        •	Things to do / sights list with a map
        •	Basic trip planner: dates, saved destinations, notes, checklist
        •	Responsive design

    - Could
        •	Currency converter widget
        •	Dark mode and multi-language (Swedish/English)
        •	Export trip plan as PDF
        •	Unit tests (Vitest?)

    - Won't
 
        •	Booking of flights or hotels
        •	Payment handling
        •	Native mobile app
        •	Social features (sharing, comments, reviews)


- AI

    - How will you use ai in your project? (Tools, methods etc)

        •   Will rely primarily on Claude code
        •	For planning, architecture decisions
        •   First review by AI, final review by me
        •   AI will be used as a teacher to help me gain a better understanding of the code, offer suggestions for improvements etc...
        •   Time permitting, Claude to generate unit tests
        •   AI Anthropic Claude API for the travel assistant


### Detailed plan

Fill out this part of the project plan ONLY after you got an OK from the examinator.

# MVP

  ## Describe the MVP
    - A website where users can search for a country and see a dashboard with data from several APIs (country facts, weather/climate, exchange rates,          holidays). The data is visualised in a clear way with graphs, grids and charts.
    - Anyone can compare 2-3 countries side by side (no login required).
    - A logged-in user can save favourite countries.
    - Should (not part of the MVP): an AI travel assistant answers questions related to the data.
    - The app is deployed and works on desktop.

 ## Definition of Done
 What criterias needs to be completed or fulfilled to make your project considered finished? (tests, reviewed, deployed, etc)
 
    - All Must items are implemented and work in the deployed version
    - Should: the AI chat works end to end (frontend, backend, Claude API)
    - Every widget has loading and error states, and the app doesn't crash if an API is down
    - Auth: register, log in, log out
    - Deployed with a public link + README that explains how to run it locally
    - The page runs without critical bugs
    - Basic responsive layout
    - Nice to have: unit tests for core services (Could)

## System architecture 
Describe the system architecture and choices

   - Angular Single Page Application(SPA), hosted on Vercel
   │
   ├── Supabase (auth + Postgres: favourites, trips)   ← direct, protected by RLS (Row Level Security)
   │
   └── Node/Express API, hosted on Render or similar (long-running server, so in-memory cache and SSE work)
         ├── /api/country, /weather, /rates, /holidays, /indicators  → external APIs 
         └── /api/chat (SSE streaming) → Claude API (tool use)

## Sprint Plan
Break the project into sprints. For each sprint: what is the goal, and what tasks or Moscow parts belong to it?

      Sprint | Dates      | Goal                             | Tasks/Moscow
    
        1    | Oct 12-18  | Foundation & first data          | Setup repo and basic file structure, express, CLAUDE.md.  Test APIs                                                                                      and decide which to use. Basic country search and overview page. Work on first two                                                                        widgets.
        2    | Oct 19-25  | Full dashboard                   | Add remaining widgets, work on dataGrid with sorting/filtering, error handling. Compare view for 2-3 countries (reuses the widgets and services, no login needed).
                                                                Supervision Oct 21st: show the dashboard, ask about AI scope, get feedback
        3    | Oct 26- Nov 1 | Auth & deploy                 | Supabase auth (register, login, guards), favourites with RLS (row level security)                                                                       First early deploy (client on Vercel, server on Render or similar)
        4    | Nov 2-8    | AI assistant (Should)            | Chat UI, /api/chat                                                                                                                                       Supervision Nov 4th: demo of the working app, discuss potential adjustements
        5    | Nov 9-15   | Finish & deliver                 | Deploy, bug fixes, responsive polish, error handling review. Add "Should" items only if                                                                  time allows. Write the Result section and finalise the README. Submit before Nov 16th
        Buffer |	Nov 16-18 |	Presentation	              |Prepare slides and demo, rehearse
        
## Risks & Mitigations
Describe risks that could be a hazard to this project
For each risk, is there a plan B?

    * Risk: The scope is too large for 5 weeks
        - plan B: Prioritise the MVP, review progress after every sprint, adjust priorities
    * Risk: An external API is down, rate-limited or changes
        - plan B: Handle error states gracefully. Worst scenario: Change APIs (e.g. WeatherAPI instead of Open-Meteo) 
    * Risk: Deployment/hosting issues
        - plan B: Deploy early and set aside time for debugging
    * Over-reliance on AI-generated code
        - plan B: Use AI as a teacher that helps explain the code, use small commits, put limits on AI tool- for example, don't allow it to produce a lot
        of code independetly, but focus on smaller changes, explain, and wait for my approval.
        - Important: review each sprint

