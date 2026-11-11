// Your own shape: what Angular receives
export interface CountryImage {
  imageUrl: string | null; // null when no good photo was found
}

// What Wikipedia sends. We describe only the fields we use.
export interface WikipediaImageSummary {
  type: string; // "standard" or "disambiguation"
  thumbnail?: { source: string };
}
