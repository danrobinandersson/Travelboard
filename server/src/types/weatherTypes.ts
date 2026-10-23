// Our own shape: what the client receives
export interface CurrentWeather {
  time: string;
  temperature: number; // °C
  windSpeed: number; // km/h
  weatherCode: number; // WMO code, the client maps it to text/icon
}

export interface DailyWeather {
  date: string;
  tempMax: number | null;
  tempMin: number | null;
  precipitation: number | null; // mm
  weatherCode: number | null;
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  current: CurrentWeather;
  daily: DailyWeather[]; // one entry per day, oldest first
}

// What Open-Meteo sends (service layer only)
export interface OpenMeteoForecast {
  current: {
    time: string;
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: (number | null)[];
    temperature_2m_max: (number | null)[];
    temperature_2m_min: (number | null)[];
    precipitation_sum: (number | null)[];
  };
}
