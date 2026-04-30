/**
 * Integration tests – REST API endpoints (uses supertest, no real port bound)
 */

const request = require("supertest");
const app     = require("../../src/app");

describe("REST API – Integration Tests", () => {

  /* ── Health ── */
  describe("GET /api/health", () => {
    it("returns 200 with status ok", async () => {
      const res = await request(app).get("/api/health");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe("ok");
    });
  });

  /* ── Leaderboard ── */
  describe("GET /api/leaderboard", () => {
    it("returns 200 with data array", async () => {
      const res = await request(app).get("/api/leaderboard");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("accepts ?track= query param", async () => {
      const res = await request(app).get("/api/leaderboard?track=alpine-crossing");
      expect(res.status).toBe(200);
      expect(res.body.track).toBe("alpine-crossing");
    });

    it("respects ?limit= query param", async () => {
      const res = await request(app).get("/api/leaderboard?limit=5");
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
    });

    it("returns pagination metadata", async () => {
      const res = await request(app).get("/api/leaderboard");
      expect(res.body).toHaveProperty("total");
      expect(res.body).toHaveProperty("page");
      expect(res.body).toHaveProperty("limit");
      expect(res.body).toHaveProperty("totalPages");
    });
  });

  describe("GET /api/leaderboard/tracks", () => {
    it("returns array of track slugs", async () => {
      const res = await request(app).get("/api/leaderboard/tracks");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.tracks)).toBe(true);
    });
  });

  describe("GET /api/leaderboard/top", () => {
    it("returns 3 top players by default", async () => {
      const res = await request(app).get("/api/leaderboard/top");
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(3);
    });
  });

  /* ── Achievements ── */
  describe("GET /api/achievements", () => {
    it("returns 200 with data array", async () => {
      const res = await request(app).get("/api/achievements");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("accepts ?lang=pl", async () => {
      const res = await request(app).get("/api/achievements?lang=pl");
      expect(res.status).toBe(200);
    });

    it("accepts ?category=speed", async () => {
      const res = await request(app).get("/api/achievements?category=speed");
      expect(res.status).toBe(200);
      res.body.data.forEach((a) => expect(a.category).toBe("speed"));
    });
  });

  describe("GET /api/achievements/stats", () => {
    it("returns total and totalPts", async () => {
      const res = await request(app).get("/api/achievements/stats");
      expect(res.status).toBe(200);
      expect(res.body.total).toBeGreaterThan(0);
      expect(res.body.totalPts).toBeGreaterThan(0);
    });
  });

  describe("GET /api/achievements/:id", () => {
    it("returns 200 for a valid id", async () => {
      const res = await request(app).get("/api/achievements/a1");
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe("a1");
    });

    it("returns 404 for an unknown id", async () => {
      const res = await request(app).get("/api/achievements/zzz999");
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  /* ── Weather ── */
  describe("GET /api/weather", () => {
    it("returns 200 with weather data (mock mode)", async () => {
      const res = await request(app).get("/api/weather?city=Warsaw");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("city");
      expect(res.body.data).toHaveProperty("temp");
    });

    it("returns 400 when city is missing", async () => {
      const res = await request(app).get("/api/weather");
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  /* ── Auth ── */
  describe("POST /api/auth/register", () => {
    it("registers a new user and returns 201", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "ApiTestUser1", password: "securepass", avatarSeed: "alpha" });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.user).not.toHaveProperty("passwordHash");
    });

    it("returns 409 if name is already taken", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({ name: "DupApiUser", password: "securepass" });
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "DupApiUser", password: "otherpass" });
      expect(res.status).toBe(409);
    });

    it("returns 400 for short password", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "ShortPassUser", password: "abc" });
      expect(res.status).toBe(400);
    });

    it("returns 400 for missing name", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ password: "securepass" });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeAll(async () => {
      await request(app)
        .post("/api/auth/register")
        .send({ name: "LoginApiUser", password: "mypassword" });
    });

    it("logs in with correct credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ name: "LoginApiUser", password: "mypassword" });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 401 for wrong password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ name: "LoginApiUser", password: "wrongpass" });
      expect(res.status).toBe(401);
    });

    it("returns 401 for non-existent user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ name: "NoSuchApiUser", password: "pass" });
      expect(res.status).toBe(401);
    });
  });

  /* ── News ── */
  describe("GET /api/news", () => {
    it("returns all news posts", async () => {
      const res = await request(app).get("/api/news");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("returns Polish content when lang=pl", async () => {
      const res = await request(app).get("/api/news?lang=pl");
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/news/:id", () => {
    it("returns single post for valid id", async () => {
      const res = await request(app).get("/api/news/n1");
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe("n1");
    });

    it("returns 404 for unknown id", async () => {
      const res = await request(app).get("/api/news/zzz");
      expect(res.status).toBe(404);
    });
  });

  /* ── Stats ── */
  describe("GET /api/stats", () => {
    it("returns game stats", async () => {
      const res = await request(app).get("/api/stats");
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("players");
      expect(res.body.data).toHaveProperty("tracks");
    });
  });

  /* ── 404 handler ── */
  describe("404 handler", () => {
    it("returns 404 for unknown routes", async () => {
      const res = await request(app).get("/api/nonexistent");
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
