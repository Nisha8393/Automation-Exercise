// @ts-check
import { defineConfig, devices } from "@playwright/test";
import path from "path";
import os from "os";
//import ExcelReporter from "./scripts/generateExcelReport.js";

const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
const documentsDir = path.join(
  os.homedir(),
  "Documents",
  "PlaywrightTestReport",
);

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
//
// // Dynamically load the appropriate .env file based on the environment
// const environment = process.env.NODE_ENV || 'dev'; // default to 'dev' if NODE_ENV is not set
// dotenv.config({path: path.resolve(__dirname, `.env.${environment}`)});
//
// console.log(`Loaded environment: ${environment}`);

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  // globalSetup removed - worker-scoped fixture in fixtures/base.js handles navigation
  /* Run tests in files in parallel */
  fullyParallel: false,
  workers: 1,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["html", { open: "always" }],
    // [
    //   "json",
    //   { outputFile: path.join(documentsDir, `playwrightReport-${today}.json`) },
    // ],
    ["./scripts/generateExcelReport.js"],
  ],
  // 2 minutes for the whole test + hooks
  timeout: 600000,
  expect: {
    timeout: 15000, // 15 seconds for all expect() calls
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "https://automationexercise.com",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // trace: "on-first-retry",
    // 1 min for individual actions/waits
    timeout: 60000,
    navigationTimeout: 90000, // 1.5 minutes max for page.goto()
    ...devices["Desktop Chrome"],
    screenshot: "only-on-failure",
    headless: true, // Run headless by default, use --headed flag for headed mode
    locale: "en-US",
    timezoneId: "America/New_York",
    permissions: ["geolocation"],
  },
  testMatch: /.*spec\.js/,

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // storageState removed - handled by sharedContext fixture in fixtures/base.js
        screenshot: "only-on-failure",
        viewport: {
          width: 1280,
          height: 720,
        },
        actionTimeout: 15000,
        launchOptions: {
          args: [
            "--disable-blink-features=AutomationControlled",
            "--disable-dev-shm-usage",
            "--no-sandbox",
          ],
        },
      },
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
