import { Router } from "express";
import { WeatherError, getWeather } from "../services/weatherService.js";

export const weatherRouter = Router();

// GET /api/weather?latitude=59.33&longitude=18.07
weatherRouter.get("/", async (req, res) => {
  const { latitude, longitude } = req.query;

  if (
    typeof latitude !== "string" ||
    typeof longitude !== "string" ||
    latitude.trim() === "" ||
    longitude.trim() === ""
  ) {
    res.status(400).json({
      error: 'Query parameters "latitude" and "longitude" are required',
    });
    return;
  }

  try {
    res.json(await getWeather(Number(latitude), Number(longitude)));
  } catch (error) {
    if (error instanceof WeatherError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error("Unexpected error in /api/weather:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
