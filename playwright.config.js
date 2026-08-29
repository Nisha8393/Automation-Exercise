// @ts-check
import { defineConfig, devices } from "@playwright/test";
import { LAUNCH_ARGS } from "./utils/browser.js";

// .env is loaded where it is used, in utils/testData/auth.data.js

/** @type {import('@playwright/test').ReporterDescription[]} */
// Every generated artifact lands under reports/ - see README > Reports.
const reporters = [
  // Never auto-open a browser on CI - it has no display and would hang
  [
    "html",
    {
      open: process.env.CI ? "never" : "always",
      outputFolder: "reports/playwright",
    },
  ],
  ["./scripts/generateExcelReport.js", { outputDir: "reports/excel" }],
];

// Annotates failures directly on the GitHub Actions run
if (process.env.CI) reporters.push(["github", {}]);

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  // Traces, screenshots and videos - kept with the other artifacts.
  outputDir: "./reports/test-results",
  // Navigation is handled by the fixtures in fixtures/base.js; this only checks
  // the site is reachable and not serving its bot check, so a blocked run fails
  // in seconds with a clear reason instead of timing out 88 tests.
  globalSetup: "./utils/preflight.js",
  /* Sequential on purpose: the live site throttles concurrent browsers and
     serves a bot check to datacenter IPs, and the order-review and e2e tests
     share one account whose cart lives server-side. */
  fullyParallel: false,
  workers: 1,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: reporters,
  // 10 minutes for the whole test + hooks
  timeout: 600000,
  expect: {
    timeout: 15000, // 15 seconds for all expect() calls
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "https://automationexercise.com",

    /* Trace on failure. See https://playwright.dev/docs/trace-viewer
       Locally retries are 0, so "on-first-retry" would never produce one. */
    trace: process.env.CI ? "on-first-retry" : "retain-on-failure",
    actionTimeout: 15000, // 15 seconds for individual actions/waits
    navigationTimeout: 90000, // 1.5 minutes max for page.goto()
    screenshot: "only-on-failure",
    headless: true, // Run headless by default, use --headed flag for headed mode
    locale: "en-US",
    timezoneId: "America/New_York",
    permissions: ["geolocation"],
  },
  testMatch: /.*spec\.js/,

  /* Configure projects for major browsers */
  projects: [
    // Logs in once per run and saves the session to playwright/.auth/user.json.
    // Specs that need an account opt in with test.use({ storageState }) rather
    // than repeating the login through the UI.
    {
      name: "setup",
      testMatch: /.*\.setup\.js/,
    },
    {
      name: "chromium",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        viewport: {
          width: 1280,
          height: 720,
        },
        launchOptions: { args: LAUNCH_ARGS },
      },
    },

    // Cross-browser coverage is deliberately limited to @smoke: those tests are
    // read-only, so they touch no account state, and running the full suite on
    // three browsers would triple the load on a live third-party site.
    {
      name: "firefox",
      grep: /@smoke/,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      grep: /@smoke/,
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
