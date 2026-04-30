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
    query("city")
      .notEmpty().withMessage("city is required")
      .isString().trim()
      .isLength({ min: 1, max: 100 }).withMessage("city must be 1-100 chars"),
    query("units").optional().isIn(["metric", "imperial"]),
    query("lang").optional().isIn(["pl", "en"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { city, units = "metric", lang = "pl" } = req.query;
    const result = await svc.getWeatherByCity(city, units, lang);

    if (!result.success) {
      const status = result.error?.includes("not found") ? 404 : 502;
      return res.status(status).json({ success: false, error: result.error });
    }

    res.json({ success: true, data: result.data, mock: result.mock ?? false });
  }
);

module.exports = router;
