import { Router } from "express";
import { PlacesError, searchPlaces } from "../services/placesService.js";

export const placesRouter = Router();

// GET /api/places?country=SE&query=goth
placesRouter.get("/", async (req, res) => {
  const { country, query } = req.query;

  if (typeof country !== "string" || typeof query !== "string") {
    res.status(400).json({
      error: 'Query parameters "country" and "query" are required',
    });
    return;
  }

  try {
    res.json(await searchPlaces(country, query));
  } catch (error) {
    if (error instanceof PlacesError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error("Unexpected error in /api/places:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
