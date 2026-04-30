/**
 * Express application factory.
 * Separated from server.js so it can be imported in tests without binding a port.
 */

require("dotenv").config();

const express      = require("express");
const cors         = require("cors");
const helmet       = require("helmet");
const morgan       = require("morgan");
const rateLimit    = require("express-rate-limit");

/* ── Route modules ── */
const leaderboardRouter  = require("./routes/leaderboard");
const achievementsRouter = require("./routes/achievements");
const weatherRouter      = require("./routes/weather");
const authRouter         = require("./routes/auth");
const newsRouter         = require("./routes/news");
const statsRouter        = require("./routes/stats");

const app = express();

/* ── Security headers ── */
app.use(helmet());

/* ── CORS ── */
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* ── Body parsing ── */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

/* ── Logging (skip in test env) ── */
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

/* ── Rate limiting ── */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests. Try again later." },
});
app.use("/api", limiter);

/* ── Health check ── */
app.get("/api/health", (_req, res) => {
  res.json({
    success:    true,
    status:     "ok",
    version:    "1.4.0",
    timestamp:  new Date().toISOString(),
    env:        process.env.NODE_ENV || "development",
  });
});

/* ── API routes ── */
app.use("/api/leaderboard",  leaderboardRouter);
app.use("/api/achievements", achievementsRouter);
app.use("/api/weather",      weatherRouter);
app.use("/api/auth",         authRouter);
app.use("/api/news",         newsRouter);
app.use("/api/stats",        statsRouter);

/* ── 404 handler ── */
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Endpoint not found." });
});

/* ── Global error handler ── */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status  = err.status || 500;
  const message = process.env.NODE_ENV === "production"
    ? "Internal server error."
    : err.message || "Internal server error.";

  if (process.env.NODE_ENV !== "test") {
    console.error("[ERROR]", err);
  }

  res.status(status).json({ success: false, error: message });
});

module.exports = app;
