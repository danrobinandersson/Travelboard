export interface Currency {
  code: string; // "CAD"
  name: string; // "Canadian dollar"
  symbol: string; // "$"
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Country {
  code: string; // "CA"
  name: string; // "Canada"
  flag: string; // SVG URL
  currencies: Currency[];
  capital: string | null;
  coordinates: Coordinates | null;
  coordinatesSource: 'capital' | 'country' | null;
  population: number | null;
  region: string | null;
  languages: string[];
  subregion: string | null;
  areaKm2: number | null;
  drivingSide: string | null;
  callingCodes: string[];
  timezones: string[];
  inEu: boolean | null;
  inSchengen: boolean | null;
  measurementSystem: string | null;
  description: string | null;
}
