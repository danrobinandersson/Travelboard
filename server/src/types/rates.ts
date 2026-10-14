export interface RatePoint {
  date: string; // ISO date, e.g. "2026-10-13"
  rate: number;
}

export interface RatesResponse {
  base: string; // currency we convert from, e.g. "SEK"
  target: string; // currency we convert to, e.g. "EUR"
  latest: RatePoint;
  history: RatePoint[]; // oldest first, ready to plot in a chart
}

export interface FrankfurterRate {
  date: string;
  base: string;
  quote: string;
  rate: number;
}
