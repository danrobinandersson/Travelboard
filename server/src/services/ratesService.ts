import type { FrankfurterRate, RatePoint, RatesResponse } from '../types/rates.js';

const FRANKFURTER_URL = 'https://api.frankfurter.dev/v2';
const CURRENCY_CODE = /^[A-Za-z]{3}$/;

// An error that carries an HTTP status, so the route can answer the client properly.
export class RatesError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getRates(base: string, target: string, days = 30): Promise<RatesResponse> {
  if (!CURRENCY_CODE.test(base) || !CURRENCY_CODE.test(target)) {
    throw new RatesError('Invalid currency code', 400);
  }
  base = base.toUpperCase();
  target = target.toUpperCase();

  const start = new Date();
  start.setDate(start.getDate() - days);

  // Without "to", Frankfurter returns everything from "from" up to today
  const url = `${FRANKFURTER_URL}/rates?from=${toIsoDate(start)}&base=${base}&quotes=${target}`;
  const response = await fetch(url);

  if (!response.ok) {
    // 404/422 mean Frankfurter doesn't know the currency; anything else is its fault
    const status = response.status === 404 || response.status === 422 ? 404 : 502;
    throw new RatesError(`Exchange rates not available for ${base} -> ${target}`, status);
  }

  const rows = (await response.json()) as FrankfurterRate[];

  const history: RatePoint[] = rows.map(({ date, rate }) => ({ date, rate }));
  history.sort((a, b) => a.date.localeCompare(b.date));

  const latest = history.at(-1);
  if (!latest) {
    throw new RatesError(`No exchange rate data for ${base} -> ${target}`, 404);
  }

  return { base, target, latest, history };
}
