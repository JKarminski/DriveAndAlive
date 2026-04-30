/**
 * POST /api/auth/register  – create account
 * POST /api/auth/login     – login
 * GET  /api/auth/profile/:id – get public profile
 */

const express = require("express");
const { body, param, validationResult } = require("express-validator");
const svc     = require("../services/authService");

const router  = express.Router();

/* ── POST /api/auth/register ── */
router.post(
  "/register",
  [
    body("name")
      .notEmpty().withMessage("Name is required")
      .isString().trim()
      .isLength({ min: 3, max: 30 }).withMessage("Name must be 3-30 characters"),
    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("avatarSeed")
      .optional()
      .isString().trim(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, password, avatarSeed = "alpha" } = req.body;
    const result = svc.register(name, password, avatarSeed);

    if (!result.success) {
      // 409 Conflict if name taken, 400 otherwise
      const status = result.error === "Name already taken." ? 409 : 400;
      return res.status(status).json({ success: false, error: result.error });
    }

    res.status(201).json({ success: true, user: result.user });
  }
);

/* ── POST /api/auth/login ── */
router.post(
  "/login",
  [
    body("name").notEmpty().withMessage("Name is required").isString().trim(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, password } = req.body;
    const result = svc.login(name, password);

    if (!result.success) {
      return res.status(401).json({ success: false, error: result.error });
    }

    res.json({ success: true, user: result.user });
  }
);

/* ── GET /api/auth/profile/:id ── */
router.get(
  "/profile/:id",
  [param("id").isString().trim().notEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const user = svc.getProfile(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    res.json({ success: true, user });
  }
);

module.exports = router;
