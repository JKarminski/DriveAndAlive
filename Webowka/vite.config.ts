import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals:     true,
    environment: "jsdom",
    setupFiles:  ["./src/__tests__/setup.ts"],
    css:         true,
    coverage: {
      reporter:   ["text", "html"],
      include:    ["src/**/*.{ts,tsx}"],
      exclude:    ["src/main.tsx", "src/vite-env.d.ts", "src/__tests__/**"],
    },
  },
});
