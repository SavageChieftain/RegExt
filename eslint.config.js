import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        globalThis: "readonly"
      }
    },
    rules: {
      // Code style
      "indent": ["error", 2],
      "quotes": ["error", "double"],
      "semi": ["error", "always"],

      // Best practices
      "eqeqeq": ["error", "always"],
      "no-console": "warn",
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-var": "error",
      "prefer-const": "error",

      // ES6+
      "arrow-spacing": "error",
      "no-duplicate-imports": "error",
      "object-shorthand": "error",
      "prefer-template": "error",

      // Error prevention
      "no-unreachable": "error",
      "no-undef": "error",
      "no-redeclare": "error",

      // Maintainability
      "max-len": ["error", { "code": 100, "ignoreUrls": true }],
      "complexity": ["warn", 10],
      "max-depth": ["warn", 4]
    }
  },
  {
    // Test file configuration
    files: ["__tests__/**/*.js", "**/*.test.js", "**/*.spec.js"],
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
        vitest: "readonly"
      }
    },
    rules: {
      "no-console": "off",
      "max-len": "off"
    }
  },
  {
    // Exclude configuration files and others
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**"
    ]
  }
];
