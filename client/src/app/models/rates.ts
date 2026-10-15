// Mirrors the response of the server's GET /api/rates (server/src/types/rates.ts)

export interface RatePoint {
  date: string; // ISO date, e.g. "2026-10-13"
  rate: number;
}

export interface RatesResponse {
  base: string;
  target: string;
  latest: RatePoint;
  history: RatePoint[]; // oldest first
}
