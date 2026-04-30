/**
 * GET  /api/achievements          – all achievements (optional ?category=&lang=)
 * GET  /api/achievements/stats    – aggregate stats
 * GET  /api/achievements/:id      – single achievement
 */

const express = require("express");
const { query, param, validationResult } = require("express-validator");
const svc     = require("../services/achievementsService");

const router  = express.Router();

/* ── GET /api/achievements ── */
router.get(
  "/",
  [
    query("category").optional().isString().trim().toLowerCase(),
    query("lang").optional().isIn(["pl", "en"]),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { category, lang = "en" } = req.query;
    const data = svc.getAchievements({ category, lang });
    res.json({ success: true, data, total: data.length });
  }
);

/* ── GET /api/achievements/stats ── */
router.get("/stats", (_req, res) => {
  res.json({ success: true, ...svc.getStats() });
});

/* ── GET /api/achievements/:id ── */
router.get(
  "/:id",
  [
    param("id").isString().trim(),
    query("lang").optional().isIn(["pl", "en"]),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { lang = "en" } = req.query;
    const achievement = svc.getAchievementById(req.params.id, lang);

    if (!achievement) {
      return res.status(404).json({ success: false, error: "Achievement not found." });
    }
    res.json({ success: true, data: achievement });
  }
);

module.exports = router;
