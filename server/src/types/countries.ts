// Your own shape: what Angular receives
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
  coordinates: Coordinates | null; // capital's, or the country's centre as a fallback
  coordinatesSource: "capital" | "country" | null; // where the coordinates came from
  population: number | null;
  region: string | null;
  languages: string[];
  subregion: string | null; // "Northern Europe"
  areaKm2: number | null;
  drivingSide: string | null; // "left" or "right"
  callingCodes: string[]; // ["46"]
  timezones: string[]; // ["UTC+01:00"]
  inEu: boolean | null;
  inSchengen: boolean | null;
  measurementSystem: string | null; // "metric"
  description: string | null; // one short sentence
}

// What REST Countries v5 sends
export interface RestCountry {
  names: { common: string };
  codes: { alpha_2: string };
  flag: { url_svg: string };
  currencies?: Currency[]; // missing for some territories, e.g. Antarctica
  capitals?: {
    name: string;
    attributes: { primary: boolean };
    coordinates?: Coordinates;
  }[];
  coordinates?: Coordinates;
  population?: number;
  region?: string;
  languages?: { name: string }[];
  subregion?: string;
  area?: { kilometers: number };
  cars?: { driving_side: string };
  calling_codes?: string[];
  timezones?: string[];
  memberships?: { eu: boolean; schengen: boolean };
  units?: { measurement_system: string };
  descriptions?: { short: string };
}

export interface RestCountriesResponse {
  data: {
    objects: RestCountry[];
    meta: {
      total: number;
      count: number;
      limit: number;
      offset: number;
      more: boolean;
    };
  };
}
