import { test, expect } from "../../../fixtures/base.js";
import { signupTestData } from "../../../utils/testData/auth.data.js";

test.describe("Signup Tests", () => {
  test.beforeEach(async ({ header }) => {
    await header.clickLoginSignup();
  });

  // ============================================================================
  // POSITIVE TESTS
  // ============================================================================

  test.describe("Valid Signup", () => {
    test("should proceed to registration form with valid data", async ({
      loginPage,
      isolatedPage,
    }) => {
      const newUser = signupTestData.generateNewUser();

      await loginPage.signup(newUser.name, newUser.email);

      await expect(isolatedPage).toHaveURL(/signup/);
      await expect(
        isolatedPage.getByText("Enter Account Information")
      ).toBeVisible();
    });
  });

  // ============================================================================
  // NEGATIVE TESTS
  // ============================================================================

  test.describe("Invalid Signup", () => {
    test("should show error for existing email", async ({ loginPage }) => {
      const testData = signupTestData.invalid.find((t) => t.id === "SIGNUP-01");

      await loginPage.signup(testData.name, testData.email);

      await loginPage.verifySignupErrorMessage(testData.expectedError);
    });
  });
});
