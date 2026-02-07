import { test, expect } from "../../../fixtures/base.js";
import { loginTestData } from "../../../utils/testData/auth.data.js";

test.describe("Login Tests", () => {
  test.beforeEach(async ({ header }) => {
    await header.clickLoginSignup();
  });

  // ============================================================================
  // POSITIVE TESTS
  // ============================================================================

  test.describe("Valid Login", () => {
    test("Login with valid credentials - Logged in successfully", async ({
      loginPage,
      header,
    }) => {
      const { email, password, name } = loginTestData.valid;

      await loginPage.login(email, password);

      await expect(header.loggedInUserText(name)).toBeVisible();
      await expect(header.logoutLink).toBeVisible();
    });

    test("Logout logged-in user - Redirected to login page", async ({
      loginPage,
      header,
    }) => {
      const { email, password } = loginTestData.valid;

      // Login first
      await loginPage.login(email, password);
      await expect(header.logoutLink).toBeVisible();

      // Logout
      await header.clickLogout();

      await expect(loginPage.loginHeading).toBeVisible();
      await expect(header.loginSignupLink).toBeVisible();
    });
  });

  // ============================================================================
  // NEGATIVE TESTS
  // ============================================================================

  test.describe("Invalid Login", () => {
    test("Login with incorrect password - Shows error message", async ({
      loginPage,
    }) => {
      const testData = loginTestData.invalid.find((t) => t.id === "LOGIN-01");

      await loginPage.login(testData.email, testData.password);

      await loginPage.verifyLoginErrorMessage(testData.expectedError);
    });

    test("Login with incorrect email - Shows error message", async ({
      loginPage,
    }) => {
      const testData = loginTestData.invalid.find((t) => t.id === "LOGIN-04");

      await loginPage.login(testData.email, testData.password);

      await loginPage.verifyLoginErrorMessage(testData.expectedError);
    });

    test("Login with unregistered email - Shows error message", async ({
      loginPage,
    }) => {
      const testData = loginTestData.invalid.find((t) => t.id === "LOGIN-02");

      await loginPage.login(testData.email, testData.password);

      await loginPage.verifyLoginErrorMessage(testData.expectedError);
    });

    test("Login with invalid email format - Should not submit", async ({
      loginPage,
      isolatedPage,
    }) => {
      const testData = loginTestData.invalid.find((t) => t.id === "LOGIN-03");

      await loginPage.login(testData.email, testData.password);

      // Should stay on same page due to browser validation
      await expect(isolatedPage).toHaveURL(/login/);
    });

    test("Login with empty email and password - Should not submit", async ({
      loginPage,
      isolatedPage,
    }) => {
      await loginPage.login("", "");

      // Should stay on same page due to browser validation
      await expect(isolatedPage).toHaveURL(/login/);
    });
  });
});
