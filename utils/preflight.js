// Pre-flight check, run once before the suite.
//
// automationexercise.com serves a bot-check interstitial to datacenter IPs, so a
// blocked CI run renders no page at all and every test times out on the missing
// header. That reports a 20-minute red build for something that is not a defect
// in the suite. This fails in seconds instead, and says why.
import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const BASE_URL = "https://automationexercise.com";
// Lives with the other failure artifacts, so CI uploads it without extra config.
const SHOT = path.join("reports", "test-results", "preflight-failure.png");

export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let status = "no response";

  try {
    const response = await page.goto(BASE_URL, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    status = response?.status() ?? status;
    if (response && !response.ok()) {
      throw new Error(`HTTP ${status}`);
    }

    // The banner is the first thing every spec asserts, so it is the right signal.
    await page
      .getByRole("banner")
      .waitFor({ state: "visible", timeout: 20_000 });
  } catch (error) {
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
        `Pre-flight failed: ${BASE_URL} did not render its header.`,
        "",
        `  HTTP status : ${status}`,
        `  Reason      : ${error.message.split("\n")[0]}`,
        `  Page title  : ${title || "(none)"}`,
        `  Page text   : ${snippet || "(empty)"}`,
        `  Screenshot  : ${SHOT}`,
        "",
        "This is usually the site's bot check, which it serves to datacenter IPs",
        "such as GitHub Actions runners. It is not a failure in the test suite -",
        "re-run the workflow, and see README > Continuous Integration.",
      ].join("\n"),
      { cause: error },
    );
  }

  await browser.close();
}
