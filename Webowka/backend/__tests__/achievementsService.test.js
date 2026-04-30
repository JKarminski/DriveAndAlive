/**
 * Unit tests – achievementsService.js
 */

const {
  getAchievements,
  getAchievementById,
  getStats,
} = require("../src/services/achievementsService");

describe("achievementsService", () => {
  /* ── getAchievements ── */
  describe("getAchievements()", () => {
    it("returns all achievements when no filter applied", () => {
      const data = getAchievements();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    it("each achievement has required fields", () => {
      getAchievements().forEach((a) => {
        expect(a).toHaveProperty("id");
        expect(a).toHaveProperty("icon");
        expect(a).toHaveProperty("slug");
        expect(a).toHaveProperty("category");
        expect(a).toHaveProperty("pts");
        expect(a).toHaveProperty("name");
        expect(a).toHaveProperty("desc");
      });
    });

    it("pts are positive numbers", () => {
      getAchievements().forEach((a) => {
        expect(typeof a.pts).toBe("number");
        expect(a.pts).toBeGreaterThan(0);
      });
    });

    it("filters by category correctly", () => {
      const speedOnes = getAchievements({ category: "speed" });
      expect(speedOnes.length).toBeGreaterThan(0);
      speedOnes.forEach((a) => expect(a.category).toBe("speed"));
    });

    it("returns empty array for unknown category", () => {
      const result = getAchievements({ category: "flying-cars" });
      expect(result).toHaveLength(0);
    });

    it("returns Polish names when lang=pl", () => {
      const pl = getAchievements({ lang: "pl" });
      const en = getAchievements({ lang: "en" });
      // At least some names should differ
      const plNames = pl.map((a) => a.name);
      const enNames = en.map((a) => a.name);
      expect(plNames).not.toEqual(enNames);
    });

    it("no password or internal fields exposed", () => {
      getAchievements().forEach((a) => {
        expect(a).not.toHaveProperty("passwordHash");
        expect(a).not.toHaveProperty("_internal");
      });
    });
  });

  /* ── getAchievementById ── */
  describe("getAchievementById()", () => {
    it("returns an achievement for a valid id", () => {
      const a = getAchievementById("a1");
      expect(a).not.toBeNull();
      expect(a.id).toBe("a1");
    });

    it("returns null for an unknown id", () => {
      expect(getAchievementById("zzz999")).toBeNull();
    });

    it("returns correct language when specified", () => {
      const pl = getAchievementById("a1", "pl");
      const en = getAchievementById("a1", "en");
      expect(pl.name).not.toBe(en.name);
    });
  });

  /* ── getStats ── */
  describe("getStats()", () => {
    it("returns total count > 0", () => {
      const { total } = getStats();
      expect(total).toBeGreaterThan(0);
    });

    it("returns totalPts > 0", () => {
      const { totalPts } = getStats();
      expect(totalPts).toBeGreaterThan(0);
    });

    it("returns categories array", () => {
      const { categories } = getStats();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    it("totalPts equals sum of all achievement pts", () => {
      const { totalPts } = getStats();
      const allPts = getAchievements().reduce((s, a) => s + a.pts, 0);
      expect(totalPts).toBe(allPts);
    });
  });
});
