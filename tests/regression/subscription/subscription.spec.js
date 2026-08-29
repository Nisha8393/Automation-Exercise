import { test, expect } from "../../../fixtures/base.js";
import { DataGenerator } from "../../../utils/helper/dataGenerator.js";

test.describe("Subscription Tests", { tag: "@regression" }, () => {
  // ============================================================================
  // SUBSCRIBE FROM DIFFERENT PAGES
  // ============================================================================

  test(
    "Subscribe from homepage - Success message shown",
    { tag: "@R-SUB-01" },
    async ({ footer }) => {
      await footer.scrollToFooter();
      await expect(footer.subscriptionHeading).toBeVisible();

      const email = DataGenerator.generateEmail("subscriber");
      await footer.subscribeWithEmail(email);

      await expect(footer.subscriptionSuccessAlert).toBeVisible();
      await expect(footer.subscriptionSuccessAlert).toHaveText(
        "You have been successfully subscribed!",
      );
    },
  );

  test(
    "Subscribe from cart page - Success message shown",
    { tag: "@R-SUB-02" },
    async ({ header, footer }) => {
      await header.clickCart();

      await footer.scrollToFooter();
      await expect(footer.subscriptionHeading).toBeVisible();

      const email = DataGenerator.generateEmail("subscriber");
      await footer.subscribeWithEmail(email);

      await expect(footer.subscriptionSuccessAlert).toBeVisible();
      await expect(footer.subscriptionSuccessAlert).toHaveText(
        "You have been successfully subscribed!",
      );
    },
  );

  // ============================================================================
  // INVALID SUBSCRIPTION TESTS
  // ============================================================================

  test(
    "Subscribe with invalid email - Browser validation prevents submit",
    { tag: "@R-SUB-03" },
    async ({ footer, isolatedPage }) => {
      await footer.scrollToFooter();

      await footer.fillSubscriptionEmail("invalid");
      await footer.clickSubscribe();

      // Should stay on same page - browser validation prevents submit
      await expect(isolatedPage).toHaveURL(/automationexercise\.com/);
      await expect(footer.subscriptionSuccessAlert).toBeHidden();

      const validationMsg = await footer.subscriptionEmailInput.evaluate(
        (el) => el.validationMessage,
      );
      expect(validationMsg).toContain(
        "Please include an '@' in the email address.",
      );
    },
  );

  test(
    "Subscribe with empty email - Browser validation prevents submit",
    { tag: "@R-SUB-04" },
    async ({ footer, isolatedPage }) => {
      await footer.scrollToFooter();

      await footer.clickSubscribe();

      // Should stay on same page - browser validation prevents submit
      await expect(isolatedPage).toHaveURL(/automationexercise\.com/);
      await expect(footer.subscriptionSuccessAlert).toBeHidden();

      const validationMsg = await footer.subscriptionEmailInput.evaluate(
        (el) => el.validationMessage,
      );
      expect(validationMsg).toBe("Please fill out this field.");
    },
  );
});
