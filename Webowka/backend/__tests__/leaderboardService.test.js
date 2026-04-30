/**
 * Unit tests – leaderboardService.js
 */

const {
  getLeaderboard,
  getTopPlayers,
  getTracks,
} = require("../src/services/leaderboardService");

describe("leaderboardService", () => {
  /* ── getTracks ── */
  describe("getTracks()", () => {
    it("returns an array of strings", () => {
      const tracks = getTracks();
      expect(Array.isArray(tracks)).toBe(true);
      expect(tracks.length).toBeGreaterThan(0);
      tracks.forEach((t) => expect(typeof t).toBe("string"));
    });

    it("always includes the 'all' track", () => {
      expect(getTracks()).toContain("all");
    });
  });

  /* ── getLeaderboard ── */
  describe("getLeaderboard()", () => {
    it("returns default 20 entries for 'all' track", () => {
      const result = getLeaderboard();
      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("page", 1);
      expect(result).toHaveProperty("limit", 20);
      expect(result.data.length).toBeLessThanOrEqual(20);
    });

    it("each entry has required fields", () => {
      const { data } = getLeaderboard();
      data.forEach((entry) => {
        expect(entry).toHaveProperty("id");
        expect(entry).toHaveProperty("rank");
        expect(entry).toHaveProperty("name");
        expect(entry).toHaveProperty("car");
        expect(entry).toHaveProperty("country");
        expect(entry).toHaveProperty("time");
        expect(entry).toHaveProperty("pts");
      });
    });

    it("entries are ordered by rank ascending", () => {
      const { data } = getLeaderboard();
      for (let i = 1; i < data.length; i++) {
        expect(data[i].rank).toBeGreaterThan(data[i - 1].rank);
      }
    });

    it("accepts a specific track and returns that track's data", () => {
      const { data, track } = getLeaderboard({ track: "alpine-crossing" });
      expect(track).toBe("alpine-crossing");
      data.forEach((entry) => expect(entry.track).toBe("alpine-crossing"));
    });

    it("falls back to 'all' for an unknown track", () => {
      const { track } = getLeaderboard({ track: "nonexistent-track" });
      expect(track).toBe("all");
    });

    it("respects pagination – page 1 and page 2 have different entries", () => {
      const page1 = getLeaderboard({ page: 1, limit: 5 });
      const page2 = getLeaderboard({ page: 2, limit: 5 });
      expect(page1.data[0].rank).not.toBe(page2.data[0]?.rank);
    });

    it("returns correct totalPages", () => {
      const result = getLeaderboard({ limit: 5 });
      expect(result.totalPages).toBe(Math.ceil(result.total / 5));
    });

    it("returns empty data array for out-of-range page", () => {
      const result = getLeaderboard({ page: 999, limit: 20 });
      expect(result.data).toHaveLength(0);
    });
  });

  /* ── getTopPlayers ── */
  describe("getTopPlayers()", () => {
    it("returns 3 players by default", () => {
      expect(getTopPlayers()).toHaveLength(3);
    });

    it("returns n players when specified", () => {
      expect(getTopPlayers(5)).toHaveLength(5);
    });

    it("rank of first player is 1", () => {
      const top = getTopPlayers();
      expect(top[0].rank).toBe(1);
    });
  });
});
