// what Angular receives
export interface Holiday {
  date: string; // "2026-01-01"
  name: string; // "New Year's Day"
  localName: string; // "Nyårsdagen"
  types: string[]; // ["Public"]
  global: boolean; // true = the whole country, false = only some regions
}

// What Nager.Date sends
export interface NagerHoliday {
  date: string;
  name: string;
  localName: string;
  types: string[];
  global: boolean;
}
