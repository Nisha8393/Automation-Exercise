import { test, expect } from "../../../fixtures/base.js";
import { DataGenerator } from "../../../utils/helper/dataGenerator.js";

test.describe("Subscription Tests", () => {
  // ============================================================================
  // SUBSCRIBE FROM DIFFERENT PAGES
  // ============================================================================

  test("Subscribe from homepage - Success message shown", async ({
    footer,
  }) => {
    await footer.scrollToFooter();
    await expect(footer.subscriptionHeading).toBeVisible();

    const email = DataGenerator.generateEmail("subscriber");
    await footer.subscribeWithEmail(email);

    await expect(footer.subscriptionSuccessAlert).toBeVisible();
    await expect(footer.subscriptionSuccessAlert).toHaveText(
      "You have been successfully subscribed!",
    );
  });

  test("Subscribe from cart page - Success message shown", async ({
    header,
    footer,
  }) => {
    await header.clickCart();

    await footer.scrollToFooter();
    await expect(footer.subscriptionHeading).toBeVisible();

    const email = DataGenerator.generateEmail("subscriber");
    await footer.subscribeWithEmail(email);

    await expect(footer.subscriptionSuccessAlert).toBeVisible();
    await expect(footer.subscriptionSuccessAlert).toHaveText(
      "You have been successfully subscribed!",
    );
  });

  // ============================================================================
  // INVALID SUBSCRIPTION TESTS
  // ============================================================================

  test("Subscribe with invalid email - Browser validation prevents submit", async ({
    footer,
    isolatedPage,
  }) => {
    await footer.scrollToFooter();

    await footer.fillSubscriptionEmail("invalid");
    await footer.clickSubscribe();

    // Should stay on same page - browser validation prevents submit
    await expect(isolatedPage).toHaveURL(/automationexercise\.com/);
    await expect(footer.subscriptionSuccessAlert).not.toBeVisible();

    const validationMsg =
      await footer.subscriptionEmailInput.evaluate(
        (el) => el.validationMessage,
      );
    expect(validationMsg).toContain(
      "Please include an '@' in the email address.",
    );
  });

  test("Subscribe with empty email - Browser validation prevents submit", async ({
    footer,
    isolatedPage,
  }) => {
    await footer.scrollToFooter();

    await footer.clickSubscribe();

    // Should stay on same page - browser validation prevents submit
    await expect(isolatedPage).toHaveURL(/automationexercise\.com/);
    await expect(footer.subscriptionSuccessAlert).not.toBeVisible();

    const validationMsg =
      await footer.subscriptionEmailInput.evaluate(
        (el) => el.validationMessage,
      );
    expect(validationMsg).toBe("Please fill out this field.");
  });
});
