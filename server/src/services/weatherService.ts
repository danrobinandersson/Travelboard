import type {
  DailyWeather,
  OpenMeteoForecast,
  WeatherResponse,
} from "../types/weatherTypes.js";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export class WeatherError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const cache = new Map<string, { data: WeatherResponse; expires: number }>();

async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  for (let i = 1; i <= attempts; i++) {
    const response = await fetch(url);
    if (response.status !== 429 || i === attempts) return response;
    await new Promise((resolve) => setTimeout(resolve, 1000 * i)); // wait 1s, then 2s
  }
  throw new WeatherError("Weather data is not available right now", 502);
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

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "temperature_2m,weather_code,wind_speed_10m",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum",
    timezone: "auto",
    forecast_days: "7",
  });

  const response = await fetchWithRetry(`${OPEN_METEO_URL}?${params}`);
  if (!response.ok) {
    const body = await response.text();
    console.error(
      `Open-Meteo responded with status ${response.status}: ${body}`,
    );
    if (hit) return hit.data; // serve old data instead of an error
    throw new WeatherError("Weather data is not available right now", 502);
  }

  const raw = (await response.json()) as OpenMeteoForecast;

  // Open-Meteo sends parallel lists (one per variable). Combine them into one row per day.
  const daily: DailyWeather[] = raw.daily.time.map((date, i) => ({
    date,
    tempMax: raw.daily.temperature_2m_max[i] ?? null,
    tempMin: raw.daily.temperature_2m_min[i] ?? null,
    precipitation: raw.daily.precipitation_sum[i] ?? null,
    weatherCode: raw.daily.weather_code[i] ?? null,
  }));

  const data: WeatherResponse = {
    latitude: lat,
    longitude: lon,
    current: {
      time: raw.current.time,
      temperature: raw.current.temperature_2m,
      windSpeed: raw.current.wind_speed_10m,
      weatherCode: raw.current.weather_code,
    },
    daily,
  };

  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
  return data;
}
