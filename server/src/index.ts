import express from "express";
import cors from "cors";
import "dotenv/config";
import { ratesRouter } from "./routes/rates.js";
import { countriesRouter } from "./routes/countries.js";
import { weatherRouter } from "./routes/weather.js";
import { holidaysRouter } from "./routes/holidays.js";
import { aboutRouter } from "./routes/about.js";
import { placesRouter } from "./routes/places.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/rates", ratesRouter);

app.use("/api/countries", countriesRouter);

app.use("/api/weather", weatherRouter);

app.use("/api/holidays", holidaysRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/about", aboutRouter);

app.use("/api/places", placesRouter);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`),
);
