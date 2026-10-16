// Your own shape: what Angular receives
export interface Currency {
  code: string;   // "CAD"
  name: string;   // "Canadian dollar"
  symbol: string; // "$"
}

export interface Country {
  code: string;          // "CA"
  name: string;          // "Canada"
  flag: string;          // SVG URL
  currencies: Currency[];
}

// What REST Countries v5 sends
export interface RestCountry {
  names: { common: string };
  codes: { alpha_2: string };
  flag: { url_svg: string };
  currencies: Currency[];
}

export interface RestCountriesResponse {
  data: {
    objects: RestCountry[];
    meta: { total: number; count: number; limit: number; offset: number; more: boolean };
  };
}