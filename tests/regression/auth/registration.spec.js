import { test, expect } from "../../../fixtures/base.js";
import { signupTestData } from "../../../utils/testData/auth.data.js";
import { DataGenerator } from "../../../utils/helper/dataGenerator.js";

test.describe("Registration Tests", () => {
  test.beforeEach(async ({ header }) => {
    await header.clickLoginSignup();
  });

  // ============================================================================
  // POSITIVE TESTS
  // ============================================================================

  test.describe("Valid Registration", () => {
    test("should proceed to registration form with valid data", async ({
      loginPage,
      isolatedPage,
    }) => {
      const newUser = signupTestData.generateNewUser();

      await loginPage.signup(newUser.name, newUser.email);

      await expect(isolatedPage).toHaveURL(/signup/);
      await expect(
        isolatedPage.getByText("Enter Account Information"),
      ).toBeVisible();
    });

    test("Register with valid data - Account created successfully", async ({
      loginPage,
      registerPage,
      accountCreatedPage,
      header,
      isolatedPage,
    }) => {
      const userData = DataGenerator.generateUserData();
      const newUser = signupTestData.generateNewUser();

      // Step 1: Signup
      await loginPage.signup(newUser.name, newUser.email);
      await expect(isolatedPage).toHaveURL(/signup/);

      // Step 2: Fill registration form
      await registerPage.selectTitle(userData.title);
      await registerPage.fillAccountInfo({
        name: newUser.name,
        password: userData.password,
        day: userData.dateOfBirth.day,
        month: userData.dateOfBirth.month,
        year: userData.dateOfBirth.year,
      });
      await registerPage.setNewsletterOptin({
        newsletter: true,
        optin: true,
      });
      await registerPage.fillAddressInfo({
        firstName: userData.firstName,
        lastName: userData.lastName,
        company: userData.company,
        address1: userData.address,
        address2: userData.address2,
        country: userData.country,
        state: userData.state,
        city: userData.city,
        zipcode: userData.zipcode,
        mobileNumber: userData.mobileNumber,
      });

      // Step 3: Create account
      await registerPage.clickCreateAccount();

      // Step 4: Verify account created
      const isCreated = await accountCreatedPage.isAccountCreated();
      expect(isCreated).toBe(true);

      // Step 5: Continue and verify logged in
      await accountCreatedPage.clickContinue();
      await expect(header.loggedInUserText(newUser.name)).toBeVisible();

      // Cleanup: delete account
      await header.clickDeleteAccount();
    });
  });

  // ============================================================================
  // NEGATIVE TESTS
  // ============================================================================

  test.describe("Invalid Registration", () => {
    test("Register with empty name on signup - Shows 'Please fill out this field.' validation", async ({
      loginPage,
      isolatedPage,
    }) => {
      await loginPage.fillSignupEmail(DataGenerator.generateEmail());
      await loginPage.clickSignup();

      // Should stay on login page due to browser validation
      await expect(isolatedPage).toHaveURL(/login/);

      // Verify browser validation message on the empty name input
      const validationMsg = await loginPage.signupNameInput.evaluate(
        (el) => el.validationMessage,
      );
      expect(validationMsg).toBe("Please fill out this field.");
    });

    test("Register with invalid email on signup - Shows browser validation on email", async ({
      loginPage,
      isolatedPage,
    }) => {
      await loginPage.fillSignupName("Test User");
      await loginPage.fillSignupEmail("invalid-email");
      await loginPage.clickSignup();

      // Should stay on login page due to browser validation
      await expect(isolatedPage).toHaveURL(/login/);

      // Verify browser validation message on the invalid email input
      // Chromium shows: "Please include an '@' in the email address. 'invalid-email' is missing an '@'."
      const validationMsg = await loginPage.signupEmailInput.evaluate(
        (el) => el.validationMessage,
      );
      expect(validationMsg).toContain(
        "Please include an '@' in the email address.",
      );
    });

    test("Register with empty required fields on registration form - All required fields show validation", async ({
      loginPage,
      registerPage,
      isolatedPage,
    }) => {
      const newUser = signupTestData.generateNewUser();

      // Navigate to registration form
      await loginPage.signup(newUser.name, newUser.email);
      await expect(isolatedPage).toHaveURL(/signup/);

      // Define all required fields to validate
      // (name and email are pre-filled from signup, so they are excluded)
      const requiredFields = [
        { name: "Password", locator: registerPage.passwordInput },
        { name: "First Name", locator: registerPage.firstNameInput },
        { name: "Last Name", locator: registerPage.lastNameInput },
        { name: "Address", locator: registerPage.address1Input },
        { name: "State", locator: registerPage.stateInput },
        { name: "City", locator: registerPage.cityInput },
        { name: "Zipcode", locator: registerPage.zipcodeInput },
        { name: "Mobile Number", locator: registerPage.mobileNumberInput },
      ];

      // Verify each required field shows "Please fill out this field." when empty
      for (const field of requiredFields) {
        const validationMsg = await field.locator.evaluate((el) => {
          el.reportValidity();
          return el.validationMessage;
        });
        expect(
          validationMsg,
          `${field.name} should show validation message when empty`,
        ).toBe("Please fill out this field.");
      }

      // Click Create Account to confirm form doesn't submit
      await registerPage.clickCreateAccount();
      await expect(isolatedPage).toHaveURL(/signup/);
    });

    test("Register with existing email - Shows error message", async ({
      loginPage,
    }) => {
      const testData = signupTestData.invalid.find((t) => t.id === "SIGNUP-01");

      await loginPage.signup(testData.name, testData.email);

      await loginPage.verifySignupErrorMessage(testData.expectedError);
    });
  });
});
