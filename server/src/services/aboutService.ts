import type { About, WikipediaSummary } from "../types/about.js";

const BASE_URL = "https://en.wikipedia.org/api/rest_v1/page/summary";
// Wikimedia asks for an identifying User-Agent, like MET Norway
const USER_AGENT =
  "Travelboard/1.0 https://github.com/danrobinandersson/Travelboard";
const CACHE_TTL = 24 * 60 * 60 * 1000; // one day, in milliseconds

export class AboutError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const cache = new Map<string, { data: About; expires: number }>();

// Returns null when the page does not exist
async function fetchSummary(title: string): Promise<WikipediaSummary | null> {
  const slug = encodeURIComponent(title.replace(/ /g, "_"));
  const response = await fetch(`${BASE_URL}/${slug}`, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    console.error(`Wikipedia responded with status ${response.status}`);
    throw new AboutError("Country summary is not available right now", 502);
  }
  return (await response.json()) as WikipediaSummary;
}

export async function getAbout(name: string): Promise<About> {
  const trimmed = name.trim();
  if (trimmed === "" || trimmed.length > 100) {
    throw new AboutError("Invalid country name", 400);
  }

  const key = trimmed.toLowerCase();
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.data;

  // "Georgia" is a disambiguation page, "Georgia (country)" is the right one
  for (const title of [trimmed, `${trimmed} (country)`]) {
    const summary = await fetchSummary(title);
    if (summary && summary.type === "standard") {
      const data: About = {
        title: summary.title,
        description: summary.description ?? null,
        extract: summary.extract,
        pageUrl: summary.content_urls.desktop.page,
      };
      cache.set(key, { data, expires: Date.now() + CACHE_TTL });
      return data;
    }
  }

  throw new AboutError(`No summary found for ${trimmed}`, 404);
}
