export interface Currency {
  code: string;   // "CAD"
  name: string;   // "Canadian dollar"
  symbol: string; // "$"
}

export interface Country {
  code: string;   // "CA"
  name: string;   // "Canada"
  flag: string;   // SVG URL
  currencies: Currency[];
}