import { test, expect } from "../../../fixtures/base.js";

test.describe("HomePage - User Interactions", () => {
  // Site opens ONCE in the fixture, then we just click logo to return home
  test.beforeEach(async ({ homePage, headerSection }) => {
    const currentUrl = homePage.page.url();
    // If not on homepage, click logo to go back (no new page load)
    if (
      !currentUrl.includes("automationexercise.com") ||
      !currentUrl.endsWith("automationexercise.com/")
    ) {
      await headerSection.clickLogo();
      await homePage.page.waitForLoadState("domcontentloaded");
    }
    // Reset scroll to top
    await homePage.page.evaluate(() => window.scrollTo(0, 0));
  });

  // Add delay after each test to avoid rate limiting
  test.afterEach(async ({ homePage }) => {
    // Random delay 1-3 seconds between tests to avoid Cloudflare rate limiting
    const delay = 1000 + Math.random() * 2000;
    await homePage.page.waitForTimeout(delay);
  });
});
