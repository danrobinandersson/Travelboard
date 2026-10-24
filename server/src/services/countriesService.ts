import type {
  Country,
  RestCountriesResponse,
  RestCountry,
} from "../types/countries.js";

const BASE_URL = "https://api.restcountries.com/countries/v5";
const PAGE_SIZE = 100; //free plan maximum
const CACHE_TTL = 24 * 60 * 60 * 1000; // one day, in milliseconds
const FIELDS =
  "names.common,codes.alpha_2,currencies,flag.url_svg,capitals,coordinates,population";

export class CountriesError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function toCountry(c: RestCountry): Country {
  // Prefer the primary capital, otherwise the first one
  const capital =
    c.capitals?.find((cap) => cap.attributes.primary) ?? c.capitals?.[0];

  return {
    code: c.codes.alpha_2,
    name: c.names.common,
    flag: c.flag.url_svg,
    currencies: c.currencies ?? [],
    capital: capital?.name ?? null,
    coordinates: capital?.coordinates ?? c.coordinates ?? null,
    population: c.population ?? null,
  };
}

async function fetchPage(
  offset: number,
): Promise<RestCountriesResponse["data"]> {
  const apiKey = process.env.RESTCOUNTRIES_API_KEY;
  if (!apiKey) {
    throw new CountriesError(
      "Server is missing the REST Countries API key",
      500,
    );
  }

  const url = `${BASE_URL}?limit=${PAGE_SIZE}&offset=${offset}&response_fields=${FIELDS}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    console.error(`REST Countries responded with status ${response.status}`);
    throw new CountriesError("Country data is not available right now", 502);
  }

  const body = (await response.json()) as RestCountriesResponse;
  return body.data;
}

async function fetchAllCountries(): Promise<Country[]> {
  const countries: Country[] = [];
  let offset = 0;
  let more = true;

  while (more && offset < 1000) {
    const page = await fetchPage(offset);
    countries.push(...page.objects.map(toCountry));
    more = page.meta.more;
    offset += PAGE_SIZE;
  }

  return countries;
}

let cache: { countries: Country[]; expires: number } | null = null;

async function loadCountries(): Promise<Country[]> {
  if (cache && cache.expires > Date.now()) {
    return cache.countries;
  }

  const countries = await fetchAllCountries();
  cache = { countries, expires: Date.now() + CACHE_TTL };
  return countries;
}

export async function getCountries(query?: string): Promise<Country[]> {
  const countries = await loadCountries();
  if (!query) return countries;

  const q = query.toLowerCase();
  return countries.filter((c) => c.name.toLowerCase().includes(q));
}

export async function getCountry(code: string): Promise<Country> {
  if (!/^[A-Za-z]{2}$/.test(code)) {
    throw new CountriesError("Invalid country code", 400);
  }

  const countries = await loadCountries();
  const country = countries.find((c) => c.code === code.toUpperCase());
  if (!country) {
    throw new CountriesError(`Country not found: ${code}`, 404);
  }
  return country;
}
