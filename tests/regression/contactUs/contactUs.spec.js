import { test, expect } from "../../../fixtures/base.js";
import { DataGenerator } from "../../../utils/helper/dataGenerator.js";
import path from "path";

test.describe("Contact Us Tests", { tag: "@regression" }, () => {
  test.beforeEach(async ({ header }) => {
    await header.clickContactUs();
  });

  // ============================================================================
  // POSITIVE TESTS
  // ============================================================================

  test(
    "Submit with all fields and file - Success message shown",
    { tag: ["@R-CON-01", "@S-CU-02"] },
    async ({ contactUsPage, isolatedPage }) => {
      const name = DataGenerator.generateUsername("Contact");
      const email = DataGenerator.generateEmail("contact");

      await contactUsPage.fillContactForm(
        name,
        email,
        "Test Subject",
        "This is a test message for the contact form.",
      );

      // Upload a file (create a temporary test file path)
      const filePath = path.resolve("package.json");
      await contactUsPage.uploadFile(filePath);

      // Handle the browser confirm dialog
      isolatedPage.once("dialog", (dialog) => dialog.accept());
      await contactUsPage.clickSubmit();

      await expect(contactUsPage.successMessage).toBeVisible();
      await expect(contactUsPage.successMessage).toHaveText(
        "Success! Your details have been submitted successfully.",
      );
    },
  );

  test(
    "Submit without file - Form submits successfully",
    { tag: "@R-CON-02" },
    async ({ contactUsPage, isolatedPage }) => {
      const name = DataGenerator.generateUsername("Contact");
      const email = DataGenerator.generateEmail("contact");

      await contactUsPage.fillContactForm(
        name,
        email,
        "Test Subject",
        "This is a test message without file upload.",
      );

      // Handle the browser confirm dialog
      isolatedPage.once("dialog", (dialog) => dialog.accept());
      await contactUsPage.clickSubmit();

      await expect(contactUsPage.successMessage).toBeVisible();
      await expect(contactUsPage.successMessage).toHaveText(
        "Success! Your details have been submitted successfully.",
      );
    },
  );

  // ============================================================================
  // NEGATIVE TESTS
  // ============================================================================

  test(
    "Submit with empty email - Browser validation prevents submit",
    { tag: ["@R-CON-03", "@S-CU-01"] },
    async ({ contactUsPage, isolatedPage }) => {
      await contactUsPage.clickSubmit();

      // Should stay on contact page due to browser validation
      await expect(isolatedPage).toHaveURL(/contact_us/);
      // Verify browser validation message on the empty email input
      const validationMsg = await contactUsPage.emailInput.evaluate(
        (el) => el.validationMessage,
      );
      expect(validationMsg).toBe("Please fill out this field.");
    },
  );

  // ============================================================================
  // NAVIGATION TESTS
  // ============================================================================

  test(
    "Home button after submit - Navigates to homepage",
    { tag: "@R-CON-04" },
    async ({ contactUsPage, isolatedPage }) => {
      const name = DataGenerator.generateUsername("Contact");
      const email = DataGenerator.generateEmail("contact");

      await contactUsPage.fillContactForm(
        name,
        email,
        "Test Subject",
        "Message to test home button navigation.",
      );

      // Handle the browser confirm dialog
      isolatedPage.once("dialog", (dialog) => dialog.accept());
      await contactUsPage.clickSubmit();

      await expect(contactUsPage.successMessage).toBeVisible();
      await expect(contactUsPage.successMessage).toHaveText(
        "Success! Your details have been submitted successfully.",
      );

      await contactUsPage.clickHome();

      await expect(isolatedPage).toHaveURL(/automationexercise\.com\/?$/);
    },
  );
});
