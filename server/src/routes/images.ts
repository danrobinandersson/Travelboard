import { Router } from "express";
import { ImagesError, getCountryImage } from "../services/imageService.js";

export const imagesRouter = Router();

// GET /api/images?capital=Stockholm&country=Sweden  (country is optional)
imagesRouter.get("/", async (req, res) => {
  const { capital, country } = req.query;

  if (typeof capital !== "string" || capital.trim() === "") {
    res.status(400).json({ error: 'Query parameter "capital" is required' });
    return;
  }

  try {
    res.json(
      await getCountryImage(capital, typeof country === "string" ? country : ""),
    );
  } catch (error) {
    if (error instanceof ImagesError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error("Unexpected error in /api/images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
