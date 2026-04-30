/**
 * Unit tests – authService.js
 */

const { register, login, getProfile } = require("../../src/services/authService");

describe("authService", () => {
  /* ── register ── */
  describe("register()", () => {
    it("successfully registers a new user", () => {
      const result = register("TestRacer", "password123", "alpha");
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.name).toBe("TestRacer");
    });

    it("returned user has no passwordHash", () => {
      const result = register("SafeUser1", "password123");
      expect(result.user).not.toHaveProperty("passwordHash");
    });

    it("returned user has an id and avatar", () => {
      const result = register("AvatarUser1", "password123", "beta");
      expect(result.user).toHaveProperty("id");
      expect(result.user).toHaveProperty("avatar");
      expect(result.user.avatar).toContain("beta");
    });

    it("rejects registration if name is already taken", () => {
      register("DuplicateUser", "password123");
      const result = register("DuplicateUser", "otherpass");
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/taken/i);
    });

    it("rejects if name is shorter than 3 characters", () => {
      const result = register("ab", "password123");
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/3/);
    });

    it("rejects if name is longer than 30 characters", () => {
      const result = register("a".repeat(31), "password123");
      expect(result.success).toBe(false);
    });

    it("rejects if password is shorter than 6 characters", () => {
      const result = register("ShortPass1", "abc");
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/6/);
    });

    it("rejects if name is empty", () => {
      const result = register("", "password123");
      expect(result.success).toBe(false);
    });

    it("rejects if password is empty", () => {
      const result = register("EmptyPass", "");
      expect(result.success).toBe(false);
    });

    it("uses 'alpha' seed for unknown avatar seeds", () => {
      const result = register("SeedTest1", "password123", "invalid-seed");
      expect(result.user.avatar).toContain("alpha");
    });
  });

  /* ── login ── */
  describe("login()", () => {
    beforeAll(() => {
      register("LoginUser", "correctpass", "gamma");
    });

    it("logs in with correct credentials", () => {
      const result = login("LoginUser", "correctpass");
      expect(result.success).toBe(true);
      expect(result.user.name).toBe("LoginUser");
    });

    it("rejects wrong password", () => {
      const result = login("LoginUser", "wrongpass");
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/credentials/i);
    });

    it("rejects non-existent user", () => {
      const result = login("NoSuchUser", "password123");
      expect(result.success).toBe(false);
    });

    it("is case-insensitive for username", () => {
      const result = login("LOGINUSER", "correctpass");
      expect(result.success).toBe(true);
    });

    it("rejects empty name", () => {
      const result = login("", "password123");
      expect(result.success).toBe(false);
    });

    it("rejects empty password", () => {
      const result = login("LoginUser", "");
      expect(result.success).toBe(false);
    });

    it("returned user has no passwordHash", () => {
      const result = login("LoginUser", "correctpass");
      expect(result.user).not.toHaveProperty("passwordHash");
    });
  });

  /* ── getProfile ── */
  describe("getProfile()", () => {
    let userId;

    beforeAll(() => {
      const r = register("ProfileUser1", "password123", "delta");
      userId  = r.user.id;
    });

    it("returns user for valid id", () => {
      const user = getProfile(userId);
      expect(user).not.toBeNull();
      expect(user.id).toBe(userId);
    });

    it("returns null for unknown id", () => {
      expect(getProfile("nonexistent-uuid")).toBeNull();
    });

    it("returned profile has no passwordHash", () => {
      const user = getProfile(userId);
      expect(user).not.toHaveProperty("passwordHash");
    });
  });
});
