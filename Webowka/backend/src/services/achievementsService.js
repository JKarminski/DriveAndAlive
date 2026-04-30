/**
 * Achievements service – pure business logic, no Express dependency.
 */

const { ACHIEVEMENTS, CATEGORIES } = require("../data/achievements");

/**
 * Get all achievements, optionally filtered by category and/or language.
 *
 * @param {object} options
 * @param {string} [options.category]  - filter by category slug
 * @param {string} [options.lang="en"] - locale for name/desc fields
 * @returns {Array}
 */
function getAchievements({ category, lang = "en" } = {}) {
  let result = ACHIEVEMENTS;

  if (category) {
    result = result.filter((a) => a.category === category);
  }

  return result.map((a) => ({
    id:       a.id,
    icon:     a.icon,
    slug:     a.slug,
    category: a.category,
    pts:      a.pts,
    name:     a.name[lang] ?? a.name["en"],
    desc:     a.desc[lang] ?? a.desc["en"],
  }));
}

/**
 * Get a single achievement by id.
 * @param {string} id
 * @param {string} [lang="en"]
 * @returns {object|null}
 */
function getAchievementById(id, lang = "en") {
  const a = ACHIEVEMENTS.find((x) => x.id === id);
  if (!a) return null;
  return {
    id:       a.id,
    icon:     a.icon,
    slug:     a.slug,
    category: a.category,
    pts:      a.pts,
    name:     a.name[lang] ?? a.name["en"],
    desc:     a.desc[lang] ?? a.desc["en"],
  };
}

/**
 * Get total stats (count, total pts).
 * @returns {{ total: number, totalPts: number, categories: string[] }}
 */
function getStats() {
  return {
    total:      ACHIEVEMENTS.length,
    totalPts:   ACHIEVEMENTS.reduce((s, a) => s + a.pts, 0),
    categories: CATEGORIES,
  };
}

module.exports = { getAchievements, getAchievementById, getStats };
