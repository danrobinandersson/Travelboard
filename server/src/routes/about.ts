import { Router } from "express";
import { AboutError, getAbout } from "../services/aboutService.js";

export const aboutRouter = Router();

// GET /api/about?name=Sweden
aboutRouter.get("/", async (req, res) => {
  const { name } = req.query;

  if (typeof name !== "string" || name.trim() === "") {
    res.status(400).json({ error: 'Query parameter "name" is required' });
    return;
  }

  try {
    res.json(await getAbout(name));
  } catch (error) {
    if (error instanceof AboutError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error("Unexpected error in /api/about:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
