import type {
  DailyWeather,
  MetNoForecast,
  WeatherResponse,
} from "../types/weatherTypes.js";

const MET_URL = "https://api.met.no/weatherapi/locationforecast/2.0/compact";
// MET requires an identifying User-Agent with a contact
const USER_AGENT =
  "Travelboard/1.0 https://github.com/danrobinandersson/Travelboard";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export class WeatherError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const cache = new Map<string, { data: WeatherResponse; expires: number }>();

interface DayAcc {
  temps: number[];
  precipitation: number;
  hasPrecip: boolean;
  symbol: string | null;
  symbolDist: number; // hours away from 12:00 UTC
}

export async function getWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherResponse> {
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new WeatherError("Invalid coordinates", 400);
  }

  // Round to 2 decimals (about 1 km), so nearby requests share one cache entry
  const lat = Math.round(latitude * 100) / 100;
  const lon = Math.round(longitude * 100) / 100;
  const key = `${lat},${lon}`;

  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.data;

  const response = await fetch(`${MET_URL}?lat=${lat}&lon=${lon}`, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!response.ok) {
    const body = await response.text();
    console.error(
      `MET Norway responded with status ${response.status}: ${body}`,
    );
    if (hit) return hit.data; // serve old data instead of an error
    throw new WeatherError("Weather data is not available right now", 502);
  }

  const raw = (await response.json()) as MetNoForecast;
  const series = raw.properties.timeseries;
  const first = series[0];
  if (!first) {
    throw new WeatherError("Weather data is not available right now", 502);
  }

  // MET sends one row per time step. Group the rows by day.
  const days = new Map<string, DayAcc>();
  for (const entry of series) {
    const date = entry.time.slice(0, 10);
    let day = days.get(date);
    if (!day) {
      day = {
        temps: [],
        precipitation: 0,
        hasPrecip: false,
        symbol: null,
        symbolDist: Infinity,
      };
      days.set(date, day);
    }

    const temp = entry.data.instant.details.air_temperature;
    if (temp !== undefined) day.temps.push(temp);

    // Hourly rows have next_1_hours; later 6-hourly rows only have next_6_hours.
    // Using one or the other means no double counting.
    const rain = (entry.data.next_1_hours ?? entry.data.next_6_hours)?.details
      ?.precipitation_amount;
    if (rain !== undefined) {
      day.precipitation += rain;
      day.hasPrecip = true;
    }

    // Day symbol: the row closest to 12:00 UTC
    const symbol =
      (entry.data.next_6_hours ?? entry.data.next_1_hours)?.summary
        ?.symbol_code ?? null;
    const dist = Math.abs(Number(entry.time.slice(11, 13)) - 12);
    if (symbol && dist < day.symbolDist) {
      day.symbol = symbol;
      day.symbolDist = dist;
    }
  }

  const daily: DailyWeather[] = Array.from(days.entries())
    .slice(0, 7)
    .map(([date, day]) => ({
      date,
      tempMax: day.temps.length ? Math.max(...day.temps) : null,
      tempMin: day.temps.length ? Math.min(...day.temps) : null,
      precipitation: day.hasPrecip
        ? Math.round(day.precipitation * 10) / 10
        : null,
      symbol: day.symbol,
    }));

  const data: WeatherResponse = {
    latitude: lat,
    longitude: lon,
    current: {
      time: first.time,
      temperature: first.data.instant.details.air_temperature ?? null,
      windSpeed: first.data.instant.details.wind_speed ?? null,
      symbol:
        (first.data.next_1_hours ?? first.data.next_6_hours)?.summary
          ?.symbol_code ?? null,
    },
    daily,
  };

  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
  return data;
}
