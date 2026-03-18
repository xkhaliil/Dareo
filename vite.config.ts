/// <reference types="vitest/config" />
import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // In CI/production the VITE_BASE_PATH env var sets the GitHub Pages sub-path
  // e.g. "/dareo/" — in dev we serve from root.
  base: mode === "production" ? (process.env.VITE_BASE_PATH ?? "/") : "/",

  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    env: {
      VITE_API_URL: "http://localhost:3001",
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
}));
