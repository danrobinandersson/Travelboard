// Our own shape (what the client gets)
export interface CurrentWeather {
  time: string;
  temperature: number | null;
  windSpeed: number | null; // m/s
  symbol: string | null; // MET symbol code, e.g. "partlycloudy_day"
}

export interface DailyWeather {
  date: string; // YYYY-MM-DD (UTC)
  tempMax: number | null;
  tempMin: number | null;
  precipitation: number | null; // mm
  symbol: string | null;
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  current: CurrentWeather;
  daily: DailyWeather[];
}

// Raw MET Norway locationforecast 2.0 "compact" shape (only what we use)
interface MetNoPeriod {
  summary?: { symbol_code?: string };
  details?: { precipitation_amount?: number };
}

export interface MetNoEntry {
  time: string;
  data: {
    instant: { details: { air_temperature?: number; wind_speed?: number } };
    next_1_hours?: MetNoPeriod;
    next_6_hours?: MetNoPeriod;
  };
}

export interface MetNoForecast {
  properties: { timeseries: MetNoEntry[] };
}
