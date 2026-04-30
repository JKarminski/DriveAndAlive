/**
 * Entry point – starts the HTTP server.
 * The app logic lives in app.js (imported by tests without binding a port).
 */

const app  = require("./app");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`\n  🏎️  DriveAndAlive Backend`);
  console.log(`  ─────────────────────────────────`);
  console.log(`  🚀 Server running on   http://localhost:${PORT}`);
  console.log(`  🌐 API base URL        http://localhost:${PORT}/api`);
  console.log(`  ❤️  Health check        http://localhost:${PORT}/api/health`);
  console.log(`  📋 Environment         ${process.env.NODE_ENV || "development"}`);
  console.log(`  ─────────────────────────────────\n`);
});
