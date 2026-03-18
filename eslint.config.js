import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // ── Ignore generated / built files ─────────────────────────────────────────
  globalIgnores([
    "dist",
    "node_modules",
    "src/generated",
    "src/**/components/ui/**",
    "src/shared/components/ui/**",
  ]),

  // ── All TypeScript source files ────────────────────────────────────────────
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
    rules: {
      // ── TypeScript ──────────────────────────────────────────────────────────
      // Prefer `import type` for type-only imports (keeps bundles clean)
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      // Ban `any` — forces explicit types on data structures
      "@typescript-eslint/no-explicit-any": "error",
      // Unused vars are always a bug — prefix with _ to intentionally ignore
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Enforce explicit return types on exported functions (public API clarity)
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // ── React ───────────────────────────────────────────────────────────────
      // react-hooks/rules-of-hooks and react-hooks/exhaustive-deps from plugin
      // react-refresh enforces component-only exports in dev

      // ── General quality ─────────────────────────────────────────────────────
      // No console.log left in source — use a logger or remove before commit
      "no-console": ["warn", { allow: ["error", "warn"] }],
      // Prefer const over let wherever possible
      "prefer-const": "error",
      // Disallow == in favour of === (except null checks)
      eqeqeq: ["error", "always", { null: "ignore" }],
      // No duplicate imports from same module
      "no-duplicate-imports": "error",
    },
  },

  // ── Test files — relaxed rules ─────────────────────────────────────────────
  {
    files: ["**/*.test.{ts,tsx}", "**/test/**/*.{ts,tsx}"],
    rules: {
      // console.log is acceptable in tests for debugging
      "no-console": "off",
      // Tests often intentionally use `any` for mocks
      "@typescript-eslint/no-explicit-any": "off",
      // Type imports less critical in test files
      "@typescript-eslint/consistent-type-imports": "off",
    },
  },
]);
