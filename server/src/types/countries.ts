// Your own shape: what Angular receives
export interface Currency {
  code: string; // "CAD"
  name: string; // "Canadian dollar"
  symbol: string; // "$"
}

export interface Coordinates {
  lat: number;
  lgn: number;
}

export interface Country {
  code: string; // "CA"
  name: string; // "Canada"
  flag: string; // SVG URL
  currencies: Currency[];
  capital: string | null;
  coordinates: Coordinates | null; // capital's, or the country's centre as a fallback
  population: number | null;
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
