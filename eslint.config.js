import js from "@eslint/js";
import globals from "globals";
import playwright from "eslint-plugin-playwright";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "node_modules/",
      // All generated output - see README > Reports
      "reports/",
      "blob-report/",
      "playwright/.auth/",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Unused args are fine if prefixed with _ (common in destructured fixtures)
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    ...playwright.configs["flat/recommended"],
    files: ["tests/**/*.spec.js", "tests/**/*.setup.js"],
    // page.evaluate() bodies run in the browser, so they use browser globals
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      // Assertions live in Page Object methods in this repo, not in the spec body
      "playwright/expect-expect": "off",
    },
  },
  // Must stay last: turns off rules that would fight Prettier formatting
  prettier,
];
