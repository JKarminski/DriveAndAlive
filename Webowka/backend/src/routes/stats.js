/**
 * GET /api/stats – homepage aggregate stats
 * Returns player count, track count, rating, countries
 */

const express = require("express");
const router  = express.Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    data: {
      players:   48312,
      tracks:    124,
      rating:    4.8,
      countries: 12,
      version:   "1.4.0",
    },
  });
});

module.exports = router;
