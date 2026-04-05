import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "coverage/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,ts}"],
    rules: {
      // Code style
      indent: ["error", 2],
      quotes: ["error", "double", { avoidEscape: true }],
      semi: ["error", "always"],

      // Best practices
      eqeqeq: ["error", "always"],
      "no-console": "warn",
      "no-var": "error",
      "prefer-const": "error",

      // ES6+
      "arrow-spacing": "error",
      "no-duplicate-imports": "error",
      "object-shorthand": "error",
      "prefer-template": "error",

      // Error prevention
      "no-unreachable": "error",

      // Maintainability
      "max-len": ["error", { code: 100, ignoreUrls: true }],
      complexity: ["warn", 10],
      "max-depth": ["warn", 4],
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      // Use TypeScript-aware version instead of base no-unused-vars
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/*.js"],
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      "no-redeclare": "error",
    },
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        globalThis: "readonly",
      },
    },
  },
  {
    files: ["tests/**/*.ts", "**/*.test.ts", "**/*.spec.ts"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        vi: "readonly",
        vitest: "readonly",
      },
    },
    rules: {
      "no-console": "off",
      "max-len": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
