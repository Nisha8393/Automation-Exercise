// Pre-flight check, run once before the suite.
//
// automationexercise.com serves a bot-check interstitial to datacenter IPs. When
// it does, no page renders and every test times out on the missing header, which
// reports a 20-minute red build for something that is not a defect in the suite.
// This fails in seconds instead, and says why.
import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { LAUNCH_ARGS } from "./browser.js";

const BASE_URL = "https://automationexercise.com";
const SHOT = path.join("reports", "test-results", "preflight-failure.png");

export default async function globalSetup() {
  // Same flags and locale as the chromium project, so the check is no more
  // detectable than the tests it guards.
  const browser = await chromium.launch({ args: LAUNCH_ARGS });
  const context = await browser.newContext({ locale: "en-US" });
  const page = await context.newPage();

  let status = "no response";
  let lastError;

  // The interstitial refreshes itself while it verifies, so allow two attempts.
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await page.goto(BASE_URL, {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      status = response?.status() ?? status;

      // The banner is the first thing every spec asserts, so it is the right signal.
      await page
        .getByRole("banner")
        .waitFor({ state: "visible", timeout: 30_000 });

      await browser.close();
      return;
    } catch (error) {
      lastError = error;
    }
  }

  const title = await page.title().catch(() => "");
  const text = await page
    .locator("body")
    .innerText()
    .catch(() => "");
  const snippet = text.replace(/\s+/g, " ").trim().slice(0, 300);

  fs.mkdirSync(path.dirname(SHOT), { recursive: true });
  await page.screenshot({ path: SHOT, fullPage: true }).catch(() => {});
  await browser.close();

  throw new Error(
    [
      `Pre-flight failed: ${BASE_URL} did not render its header after 2 attempts.`,
      "",
      `  HTTP status : ${status}`,
      `  Reason      : ${lastError?.message.split("\n")[0]}`,
      `  Page title  : ${title || "(none)"}`,
      `  Page text   : ${snippet || "(empty)"}`,
      `  Screenshot  : ${SHOT}`,
      "",
      "This is the site's bot check, which it serves to datacenter IPs such as",
      "GitHub Actions runners. It is not a failure in the test suite - re-run the",
      "workflow, and see README > Continuous Integration.",
    ].join("\n"),
    { cause: lastError },
  );
}
