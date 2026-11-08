import type { OpenMeteoGeocodingResponse, Place } from "../types/places.js";

const BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const CACHE_TTL = 24 * 60 * 60 * 1000; // one day, in milliseconds

export class PlacesError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const cache = new Map<string, { data: Place[]; expires: number }>();

export async function searchPlaces(
  country: string,
  query: string,
): Promise<Place[]> {
  if (!/^[A-Za-z]{2}$/.test(country)) {
    throw new PlacesError("Invalid country code", 400);
  }
  const text = query.trim();
  if (text.length < 2 || text.length > 60) {
    throw new PlacesError("Search text must be 2 to 60 characters", 400);
  }

  const code = country.toUpperCase();
  const key = `${code}:${text.toLowerCase()}`;

  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.data;

  const url = `${BASE_URL}?name=${encodeURIComponent(text)}&count=15&countryCode=${code}&language=en`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error(
      `Open-Meteo geocoding responded with status ${response.status}`,
    );
    if (hit) return hit.data; // serve old data instead of an error
    throw new PlacesError("Place search is not available right now", 502);
  }

  const raw = (await response.json()) as OpenMeteoGeocodingResponse;
  const data: Place[] = (raw.results ?? [])
    // keep towns and cities, skip airports and other things
    .filter((p) => p.feature_code?.startsWith("PPL"))
    .map((p) => ({
      id: p.id,
      name: p.name,
      region: p.admin1 ?? null,
      latitude: p.latitude,
      longitude: p.longitude,
      population: p.population ?? null,
    }));

  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
  return data;
}
