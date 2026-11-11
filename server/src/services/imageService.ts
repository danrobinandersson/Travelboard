import type { CountryImage, WikipediaImageSummary } from "../types/images.js";

const BASE_URL = "https://en.wikipedia.org/api/rest_v1/page/summary";
// Wikimedia asks for an identifying User-Agent, like MET Norway
const USER_AGENT =
  "Travelboard/1.0 https://github.com/danrobinandersson/Travelboard";
const CACHE_TTL = 24 * 60 * 60 * 1000; // one day, in milliseconds
// Wikimedia only serves certain thumbnail widths. 500 works and is about 70 KB.
const IMAGE_WIDTH = 500;

export class ImagesError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const cache = new Map<string, { data: CountryImage; expires: number }>();

// Returns null when the page does not exist
async function fetchSummary(
  title: string,
): Promise<WikipediaImageSummary | null> {
  const slug = encodeURIComponent(title.replace(/ /g, "_"));
  const response = await fetch(`${BASE_URL}/${slug}`, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    console.error(`Wikipedia responded with status ${response.status}`);
    throw new ImagesError("Pictures are not available right now", 502);
  }
  return (await response.json()) as WikipediaImageSummary;
}

// The summary gives a 330 px thumbnail. Ask for a bigger one of the same photo.
function toLargerThumbnail(source: string): string {
  const withoutQuery = source.split("?")[0] ?? source;
  return withoutQuery.replace(/\/\d+px-/, `/${IMAGE_WIDTH}px-`);
}

// Flags and other SVG drawings make poor backgrounds
function isPhoto(source: string): boolean {
  return !/\.svg|flag_of/i.test(source);
}

// A photo of the capital. Country pages only have a flag as their main image.
export async function getCountryImage(
  capital: string,
  country: string,
): Promise<CountryImage> {
  const city = capital.trim();
  const name = country.trim();
  if (city === "" || city.length > 100 || name.length > 100) {
    throw new ImagesError("Invalid capital or country", 400);
  }

  const key = `${city}|${name}`.toLowerCase();
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.data;

  // "Georgetown" is ambiguous, "Georgetown, Guyana" is the right page
  const titles = name === "" ? [city] : [city, `${city}, ${name}`];
  let imageUrl: string | null = null;

  for (const title of titles) {
    const summary = await fetchSummary(title);
    const source = summary?.thumbnail?.source;
    if (summary?.type === "standard" && source && isPhoto(source)) {
      imageUrl = toLargerThumbnail(source);
      break;
    }
  }

  const data: CountryImage = { imageUrl };
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
  return data;
}
