/**
 * Frontend unit tests – api.ts service client
 *
 * Tests that the api module constructs correct URLs and handles responses.
 * The global fetch is mocked.
 */

import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { api } from "../../services/api";

/* ── Helpers ── */
function mockFetch(body: object, status = 200) {
  return vi.fn().mockResolvedValue({
    ok:   status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
}

describe("api service", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.clearAllMocks();
  });

  /* ── leaderboard ── */
  describe("api.leaderboard.get()", () => {
    it("calls /leaderboard with no params by default", async () => {
      globalThis.fetch = mockFetch({ success: true, data: [], total: 0, page: 1, limit: 20, totalPages: 0, track: "all" });
      await api.leaderboard.get();
      const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(url).toContain("/leaderboard");
    });

    it("appends track param to URL", async () => {
      globalThis.fetch = mockFetch({ success: true, data: [], total: 0, page: 1, limit: 20, totalPages: 0, track: "alpine-crossing" });
      await api.leaderboard.get({ track: "alpine-crossing" });
      const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(url).toContain("track=alpine-crossing");
    });

    it("throws when success is false", async () => {
      globalThis.fetch = mockFetch({ success: false, error: "Not found" }, 404);
      await expect(api.leaderboard.get()).rejects.toThrow("Not found");
    });
  });

  describe("api.leaderboard.top()", () => {
    it("calls /leaderboard/top?n=3", async () => {
      globalThis.fetch = mockFetch({ success: true, data: [] });
      await api.leaderboard.top();
      const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(url).toContain("/leaderboard/top");
      expect(url).toContain("n=3");
    });
  });

  /* ── achievements ── */
  describe("api.achievements.get()", () => {
    it("calls /achievements", async () => {
      globalThis.fetch = mockFetch({ success: true, data: [], total: 0 });
      await api.achievements.get();
      const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(url).toContain("/achievements");
    });

    it("appends category and lang params", async () => {
      globalThis.fetch = mockFetch({ success: true, data: [], total: 0 });
      await api.achievements.get({ category: "speed", lang: "pl" });
      const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(url).toContain("category=speed");
      expect(url).toContain("lang=pl");
    });
  });

  /* ── weather ── */
  describe("api.weather.get()", () => {
    it("calls /weather?city=...", async () => {
      globalThis.fetch = mockFetch({ success: true, data: { city: "Warsaw" }, mock: true });
      await api.weather.get("Warsaw");
      const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(url).toContain("/weather");
      expect(url).toContain("city=Warsaw");
    });

    it("throws on API error", async () => {
      globalThis.fetch = mockFetch({ success: false, error: "City not found" }, 404);
      await expect(api.weather.get("Xyz123NotReal")).rejects.toThrow("City not found");
    });
  });

  /* ── news ── */
  describe("api.news.get()", () => {
    it("calls /news with lang param", async () => {
      globalThis.fetch = mockFetch({ success: true, data: [], total: 0 });
      await api.news.get("pl");
      const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(url).toContain("/news?lang=pl");
    });
  });

  /* ── auth ── */
  describe("api.auth.register()", () => {
    it("sends POST request with body", async () => {
      globalThis.fetch = mockFetch({ success: true, user: { id: "1", name: "Test", avatar: "", createdAt: "" } }, 201);
      await api.auth.register("TestUser", "pass123", "alpha");

      const [url, opts] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toContain("/auth/register");
      expect(opts.method).toBe("POST");

      const body = JSON.parse(opts.body as string);
      expect(body.name).toBe("TestUser");
      expect(body.avatarSeed).toBe("alpha");
    });
  });

  describe("api.auth.login()", () => {
    it("sends POST request with name and password", async () => {
      globalThis.fetch = mockFetch({ success: true, user: { id: "1", name: "Test", avatar: "", createdAt: "" } });
      await api.auth.login("TestUser", "pass123");

      const [url, opts] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toContain("/auth/login");
      expect(opts.method).toBe("POST");

      const body = JSON.parse(opts.body as string);
      expect(body.name).toBe("TestUser");
      expect(body.password).toBe("pass123");
    });
  });

  /* ── stats ── */
  describe("api.stats.get()", () => {
    it("calls /stats", async () => {
      globalThis.fetch = mockFetch({ success: true, data: { players: 48312, tracks: 124, rating: 4.8, countries: 12, version: "1.4.0" } });
      await api.stats.get();
      const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(url).toContain("/stats");
    });
  });
});
