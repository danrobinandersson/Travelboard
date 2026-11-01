import type { Holiday, NagerHoliday } from "../types/holidays.js";

const BASE_URL = "https://date.nager.at/api/v3/PublicHolidays";
const CACHE_TTL = 24 * 60 * 60 * 1000; // one day, in milliseconds

export class HolidaysError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const cache = new Map<string, { data: Holiday[]; expires: number }>();

export async function getHolidays(
  country: string,
  year: number,
): Promise<Holiday[]> {
  if (!/^[A-Za-z]{2}$/.test(country)) {
    throw new HolidaysError("Invalid country code", 400);
  }
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new HolidaysError("Invalid year", 400);
  }

  const code = country.toUpperCase();
  const key = `${code}-${year}`;

  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.data;

  const response = await fetch(`${BASE_URL}/${year}/${code}`);

  // 204 means "no holiday data for this country", e.g. Antarctica.
  // There is no body, so we must not call response.json().
  if (response.status === 204) {
    cache.set(key, { data: [], expires: Date.now() + CACHE_TTL });
    return [];
  }

  if (!response.ok) {
    console.error(`Nager.Date responded with status ${response.status}`);
    if (hit) return hit.data; // serve old data instead of an error
    throw new HolidaysError("Holiday data is not available right now", 502);
  }

  const raw = (await response.json()) as NagerHoliday[];
  const data: Holiday[] = raw.map((h) => ({
    date: h.date,
    name: h.name,
    localName: h.localName,
    types: h.types,
    global: h.global,
  }));

  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
  return data;
}
