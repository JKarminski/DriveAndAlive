/**
 * In-memory leaderboard data store.
 * NOTE: This will be replaced with a real database connection.
 * The data shape is intentionally identical to what the DB layer will return.
 */

const TRACKS = [
  "all",
  "alpine-crossing",
  "gravel-sprint",
  "night-highway",
  "mountain-loop",
  "desert-slalom",
];

/** Generate a deterministic but realistic-looking dataset */
const PLAYER_NAMES = [
  "xX_DriftKing_Xx", "PolishRacer", "SpeedDemon99", "NightDriver", "AlpineMaster",
  "TarmacTerror",    "GravelKing",  "TurboWojtek",  "FjordRacer",  "SunsetDrifter",
  "JakubPL",         "SilentCorner","ApexHunter",   "DustDevil",   "MidnightRunner",
  "RedlineRacer",    "SnowFox",     "ThrottleQueen","GhostLap",    "BlazingKarol",
];

const CARS = [
  "BMW M3", "Subaru WRX", "Ford Fiesta R5", "VW Polo GTI", "Mitsubishi Evo",
];

const FLAGS = ["🇵🇱", "🇩🇪", "🇫🇷", "🇮🇹", "🇳🇴", "🇸🇪"];

/**
 * Formats milliseconds as "M:SS.mmm"
 * @param {number} ms
 * @returns {string}
 */
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millis = ms % 1000;
  return `${minutes}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
}

/**
 * Generates leaderboard entries for a given track.
 * Uses a seeded approach so results are consistent per track.
 * @param {string} track
 * @param {number} count
 * @returns {Array}
 */
function generateEntries(track, count = 20) {
  // Simple seeded pseudo-random based on track name
  const seed = track.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

  return Array.from({ length: count }, (_, i) => {
    const seededRng = (n) => ((seed * 9301 + 49297 * (i + 1) * (n + 1)) % 233280) / 233280;

    const baseTime = 90000 + i * 8000 + Math.floor(seededRng(1) * 4000);
    const pts      = Math.max(100, 10000 - i * 450 - Math.floor(seededRng(2) * 200));
    const carIdx   = Math.floor(seededRng(3) * CARS.length);
    const flagIdx  = Math.floor(seededRng(4) * FLAGS.length);

    return {
      id:      `${track}-${i + 1}`,
      rank:    i + 1,
      name:    PLAYER_NAMES[i % PLAYER_NAMES.length],
      car:     CARS[carIdx],
      country: FLAGS[flagIdx],
      time:    formatTime(baseTime),
      timeMs:  baseTime,
      pts,
      track,
    };
  });
}

/** In-memory store keyed by track slug */
const store = {};

TRACKS.forEach((t) => {
  store[t] = generateEntries(t);
});

// "all" track is the overall top players (sorted by pts)
store["all"] = PLAYER_NAMES.map((name, i) => {
  const seed  = name.charCodeAt(0) + i;
  const seededRng = (n) => ((seed * 9301 + 49297 * (i + 1) * (n + 1)) % 233280) / 233280;
  return {
    id:      `all-${i + 1}`,
    rank:    i + 1,
    name,
    car:     CARS[Math.floor(seededRng(3) * CARS.length)],
    country: FLAGS[Math.floor(seededRng(4) * FLAGS.length)],
    time:    formatTime(90000 + i * 8000 + Math.floor(seededRng(1) * 4000)),
    timeMs:  90000 + i * 8000,
    pts:     Math.max(100, 10000 - i * 450 - Math.floor(seededRng(2) * 200)),
    track:   "all",
  };
});

module.exports = { store, TRACKS, formatTime };
