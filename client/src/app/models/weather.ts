export interface CurrentWeather {
  time: string;
  temperature: number | null;
  windSpeed: number | null; // m/s
  symbol: string | null; // MET symbol, e.g. "partlycloudy_day"
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
