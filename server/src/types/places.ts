// Your own shape: what Angular receives
export interface Place {
  id: number;
  name: string; // "Gothenburg"
  region: string | null; // "Västra Götaland County"
  latitude: number;
  longitude: number;
  population: number | null;
}

// What Open-Meteo sends. We describe only the fields we use.
export interface OpenMeteoPlace {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  feature_code?: string; // "PPLA" = city, "AIRP" = airport
  admin1?: string;
  population?: number;
}

export interface OpenMeteoGeocodingResponse {
  results?: OpenMeteoPlace[]; // missing when nothing was found
}
