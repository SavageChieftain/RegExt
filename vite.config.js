import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Test file patterns
    include: ["tests/**/*.{ts,js}", "**/*.{test,spec}.{ts,js}"],
    // Enable global APIs (describe, it, expect, etc.)
    globals: true,
    // Node.js style module resolution
    environment: "node",
  },
});
