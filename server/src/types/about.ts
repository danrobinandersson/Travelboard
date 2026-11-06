// Your own shape: what Angular receives
export interface About {
  title: string; // "Sweden"
  description: string | null; // "Country in Northern Europe"
  extract: string; // the intro paragraph
  pageUrl: string; // link to the Wikipedia article
}

// What Wikipedia sends. We describe only the fields we use.
export interface WikipediaSummary {
  type: string; // "standard" or "disambiguation"
  title: string;
  description?: string;
  extract: string;
  content_urls: { desktop: { page: string } };
}
