/**
 * GET  /api/news          – all news posts (optional ?lang=)
 * GET  /api/news/:id      – single post
 */

const express = require("express");
const { param, query, validationResult } = require("express-validator");
const { NEWS } = require("../data/news");

const router  = express.Router();

function formatPost(post, lang = "en") {
  return {
    id:      post.id,
    tag:     post.tag[lang]     ?? post.tag["en"],
    date:    post.date,
    title:   post.title[lang]   ?? post.title["en"],
    excerpt: post.excerpt[lang] ?? post.excerpt["en"],
    emoji:   post.emoji,
    accent:  post.accent,
  };
}

/* ── GET /api/news ── */
router.get("/", [query("lang").optional().isIn(["pl", "en"])], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const { lang = "en" } = req.query;
  const data = NEWS.map((p) => formatPost(p, lang));
  res.json({ success: true, data, total: data.length });
});

/* ── GET /api/news/:id ── */
router.get("/:id", [param("id").isString().trim()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const { lang = "en" } = req.query;
  const post = NEWS.find((p) => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, error: "Post not found." });
  }
  res.json({ success: true, data: formatPost(post, lang) });
});

module.exports = router;
