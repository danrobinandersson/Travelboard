import { Router } from "express";
import { HolidaysError, getHolidays } from "../services/holidayService.js";

export const holidaysRouter = Router();

// GET /api/holidays?country=SE&year=2026  (year is optional)
holidaysRouter.get("/", async (req, res) => {
  const { country, year } = req.query;

  if (typeof country !== "string" || country.trim() === "") {
    res.status(400).json({
      error: 'Query parameter "country" is required',
    });
    return;
  }

  const yearNumber =
    typeof year === "string" && year.trim() !== ""
      ? Number(year)
      : new Date().getFullYear();

  try {
    res.json(await getHolidays(country, yearNumber));
  } catch (error) {
    if (error instanceof HolidaysError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error("Unexpected error in /api/holidays:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
