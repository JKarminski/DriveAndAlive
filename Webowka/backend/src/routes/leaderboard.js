/**
 * GET  /api/leaderboard          – paginated leaderboard (optional ?track=&page=&limit=)
 * GET  /api/leaderboard/tracks   – list of available track slugs
 * GET  /api/leaderboard/top      – top-3 players (for home page)
 */

const express  = require("express");
const { query, validationResult } = require("express-validator");
const svc      = require("../services/leaderboardService");

const router = express.Router();

/* ── Validation middleware ── */
const leaderboardValidation = [
  query("track").optional().isString().trim(),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
];

/* ── GET /api/leaderboard ── */
router.get("/", leaderboardValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { track = "all", page = 1, limit = 20 } = req.query;
  const result = svc.getLeaderboard({ track, page: Number(page), limit: Number(limit) });

  res.json({ success: true, ...result });
});

/* ── GET /api/leaderboard/tracks ── */
router.get("/tracks", (_req, res) => {
  res.json({ success: true, tracks: svc.getTracks() });
});

/* ── GET /api/leaderboard/top ── */
router.get("/top", (req, res) => {
  const n = Math.min(Number(req.query.n) || 3, 10);
  res.json({ success: true, data: svc.getTopPlayers(n) });
});

module.exports = router;
