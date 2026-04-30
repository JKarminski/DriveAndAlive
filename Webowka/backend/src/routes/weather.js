/**
 * GET  /api/weather?city=Warsaw&units=metric&lang=pl
 *
 * Proxies OpenWeatherMap so the API key stays server-side.
 * Falls back to mock data when OPENWEATHER_API_KEY is not configured.
 */

const express = require("express");
const { query, validationResult } = require("express-validator");
const svc     = require("../services/weatherService");

const router  = express.Router();

router.get(
  "/",
  [
    query("city").optional().isString().trim().isLength({ max: 100 }),
    query("lat").optional().isFloat(),
    query("lon").optional().isFloat(),
    query("units").optional().isIn(["metric", "imperial"]),
    query("lang").optional().isIn(["pl", "en"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { city, lat, lon, units = "metric", lang = "pl" } = req.query;

    if (!city && (lat === undefined || lon === undefined)) {
      return res.status(400).json({ success: false, error: "city or lat/lon required" });
    }

    let result;
    if (lat !== undefined && lon !== undefined) {
      result = await svc.getWeatherByCoordinates(parseFloat(lat), parseFloat(lon), city || "Mapa Gry");
    } else {
      result = await svc.getWeatherByCity(city, units, lang);
    }

    if (!result.success) {
      const status = result.error?.includes("not found") ? 404 : 502;
      return res.status(status).json({ success: false, error: result.error });
    }

    res.json({ success: true, data: result.data, mock: result.mock ?? false });
  }
);

module.exports = router;
