/**
 * Leaderboard service – pure business logic, no Express dependency.
 * Easy to unit-test and easy to swap out the data layer.
 */

const { store, TRACKS } = require("../data/leaderboard");

/**
 * Get leaderboard entries for a track with optional pagination.
 *
 * @param {object} options
 * @param {string} [options.track="all"]   - track slug
 * @param {number} [options.page=1]        - page number (1-indexed)
 * @param {number} [options.limit=20]      - results per page
 * @returns {{ data: Array, total: number, page: number, limit: number, totalPages: number }}
 */
function getLeaderboard({ track = "all", page = 1, limit = 20 } = {}) {
  const slug  = TRACKS.includes(track) ? track : "all";
  const all   = store[slug] ?? store["all"];
  const total = all.length;
  const start = (page - 1) * limit;
  const data  = all.slice(start, start + limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    track: slug,
  };
}

/**
 * Get top N entries across all tracks (for home page stats).
 * @param {number} n
 * @returns {Array}
 */
function getTopPlayers(n = 3) {
  return (store["all"] ?? []).slice(0, n);
}

/**
 * Get all available track slugs.
 * @returns {string[]}
 */
function getTracks() {
  return TRACKS;
}

module.exports = { getLeaderboard, getTopPlayers, getTracks };
