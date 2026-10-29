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
}
