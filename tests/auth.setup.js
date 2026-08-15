import { test as setup, expect } from "@playwright/test";
import HeaderSection from "../pages/header.page.js";
import LoginSignupPage from "../pages/loginRegister.page.js";
import { loginTestData } from "../utils/testData/auth.data.js";
import { STORAGE_STATE } from "../utils/authState.js";

// Runs as a project dependency, so it executes on every run regardless of any
// --grep filter applied to the suite.
setup("authenticate", async ({ page }) => {
  const { email, password, name } = loginTestData.valid;

  const header = new HeaderSection(page);
  const loginPage = new LoginSignupPage(page);

  await page.goto("/");
  await header.clickLoginSignup();
  await loginPage.login(email, password);

  // Assert before saving - persisting a logged-out state would fail every
  // dependent test with a confusing error much later in the run
  await expect(header.loggedInUserText(name)).toBeVisible();

  await page.context().storageState({ path: STORAGE_STATE });
});
