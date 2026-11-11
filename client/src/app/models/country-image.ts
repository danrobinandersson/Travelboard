// Mirrors the response of the server's GET /api/images (server/src/types/images.ts)
export interface CountryImage {
  imageUrl: string | null; // null when no good photo was found
}
