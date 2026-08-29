import { test, expect } from "../../../fixtures/base.js";
import { loginTestData } from "../../../utils/testData/auth.data.js";

test.describe("Login Tests", { tag: "@regression" }, () => {
  test.beforeEach(async ({ header }) => {
    await header.clickLoginSignup();
  });

  // ============================================================================
  // POSITIVE TESTS
  // ============================================================================

  test.describe("Valid Login", () => {
    test(
      "Login with valid credentials - Logged in successfully",
      { tag: ["@R-AUTH-07", "@S-AP-03"] },
      async ({ loginPage, header }) => {
        const { email, password, name } = loginTestData.valid;

        await loginPage.login(email, password);

        await expect(header.loggedInUserText(name)).toBeVisible();
        await expect(header.logoutLink).toBeVisible();
      },
    );

    test(
      "Logout logged-in user - Redirected to login page",
      { tag: ["@R-AUTH-13", "@S-AP-01"] },
      async ({ loginPage, header }) => {
        const { email, password } = loginTestData.valid;

        // Login first
        await loginPage.login(email, password);
        await expect(header.logoutLink).toBeVisible();

        // Logout
        await header.clickLogout();

        await expect(loginPage.loginHeading).toBeVisible();
        await expect(header.loginSignupLink).toBeVisible();
      },
    );
  });

  // ============================================================================
  // NEGATIVE TESTS
  // ============================================================================

  test.describe("Invalid Login", () => {
    test(
      "Login with incorrect password - Shows error message",
      { tag: "@R-AUTH-08" },
      async ({ loginPage }) => {
        const testData = loginTestData.invalid.find((t) => t.id === "LOGIN-01");

        await loginPage.login(testData.email, testData.password);

        await loginPage.verifyLoginErrorMessage(testData.expectedError);
      },
    );

    test(
      "Login with incorrect email - Shows error message",
      { tag: "@R-AUTH-09" },
      async ({ loginPage }) => {
        const testData = loginTestData.invalid.find((t) => t.id === "LOGIN-04");

        await loginPage.login(testData.email, testData.password);

        await loginPage.verifyLoginErrorMessage(testData.expectedError);
      },
    );

    test(
      "Login with unregistered email - Shows error message",
      { tag: "@R-AUTH-15" },
      async ({ loginPage }) => {
        const testData = loginTestData.invalid.find((t) => t.id === "LOGIN-02");

        await loginPage.login(testData.email, testData.password);

        await loginPage.verifyLoginErrorMessage(testData.expectedError);
      },
    );

    test(
      "Login with invalid email format - Shows browser email validation",
      { tag: "@R-AUTH-16" },
      async ({ loginPage, isolatedPage }) => {
        const testData = loginTestData.invalid.find((t) => t.id === "LOGIN-03");

        await loginPage.login(testData.email, testData.password);

        // Should stay on same page due to browser validation
        await expect(isolatedPage).toHaveURL(/login/);

        // Verify browser validation message on the invalid email input
        // Chromium shows: "Please include an '@' in the email address. 'invalid-email' is missing an '@'."
        const validationMsg = await loginPage.loginEmailInput.evaluate(
          (el) => el.validationMessage,
        );
        expect(validationMsg).toContain(
          "Please include an '@' in the email address.",
        );
      },
    );

    test(
      "Login with empty email and password - Shows 'Please fill out this field.' validation",
      { tag: "@R-AUTH-12" },
      async ({ loginPage, isolatedPage }) => {
        await loginPage.clickLogin();

        // Should stay on same page due to browser validation
        await expect(isolatedPage).toHaveURL(/login/);

        // Verify browser validation message on the empty email input
        const validationMsg = await loginPage.loginEmailInput.evaluate(
          (el) => el.validationMessage,
        );
        expect(validationMsg).toBe("Please fill out this field.");
      },
    );
  });
});
