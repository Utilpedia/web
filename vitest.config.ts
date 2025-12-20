import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // The stdlib monorepo installs the whole repo, so we alias to the actual packages
      "@utilpedia/math": path.resolve(
        __dirname,
        "./node_modules/@utilpedia/math/packages/math/dist"
      ),
      "@utilpedia/color": path.resolve(
        __dirname,
        "./node_modules/@utilpedia/color/packages/color/dist"
      ),
    },
  },
});
