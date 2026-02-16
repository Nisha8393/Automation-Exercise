import { test, expect } from "../../../fixtures/base.js";
import { DataGenerator } from "../../../utils/helper/dataGenerator.js";

test.describe("Product Reviews", () => {
  test.beforeEach(async ({ header, productsPage }) => {
    await header.clickProducts();

    // Navigate to first product detail page
    const firstProduct = productsPage.productCards.first();
    await firstProduct.scrollIntoViewIfNeeded();
    await firstProduct.hover();
    const viewLink = productsPage.productViewProductLink(firstProduct);
    await expect(viewLink).toBeVisible();
    await viewLink.click();
  });

  // ============================================================================
  // REVIEW TESTS
  // ============================================================================

  test("Add review with valid data - Success message shown", async ({
    productDetailsPage,
  }) => {
    const name = DataGenerator.generateUsername("Reviewer");
    const email = DataGenerator.generateEmail("reviewer");
    const reviewText = "This is a great product! Highly recommended.";

    await productDetailsPage.submitReview(name, email, reviewText);

    await expect(productDetailsPage.reviewSuccessAlert).toBeVisible();
    await expect(productDetailsPage.reviewSuccessAlert).toHaveText(
      "Thank you for your review.",
    );
  });

  test("Submit review with empty fields - Browser validation prevents submit", async ({
    productDetailsPage,
    isolatedPage,
  }) => {
    await productDetailsPage.clickReviewSubmit();

    // Should stay on same page due to browser validation
    await expect(isolatedPage).toHaveURL(/product_details/);

    // First required field (name) should show validation message
    const nameValidation = await productDetailsPage.reviewNameInput.evaluate(
      (el) => el.validationMessage,
    );
    expect(nameValidation).toBe("Please fill out this field.");
  });

  test("Submit review with only name - Email validation prevents submit", async ({
    productDetailsPage,
    isolatedPage,
  }) => {
    const name = DataGenerator.generateUsername("Reviewer");

    await productDetailsPage.fillReviewName(name);
    await productDetailsPage.clickReviewSubmit();

    await expect(isolatedPage).toHaveURL(/product_details/);

    const emailValidation = await productDetailsPage.reviewEmailInput.evaluate(
      (el) => el.validationMessage,
    );
    expect(emailValidation).toBe("Please fill out this field.");
  });

  test("Submit review with name and email only - Review text validation prevents submit", async ({
    productDetailsPage,
    isolatedPage,
  }) => {
    const name = DataGenerator.generateUsername("Reviewer");
    const email = DataGenerator.generateEmail("reviewer");

    await productDetailsPage.fillReviewName(name);
    await productDetailsPage.fillReviewEmail(email);
    await productDetailsPage.clickReviewSubmit();

    await expect(isolatedPage).toHaveURL(/product_details/);

    const reviewValidation = await productDetailsPage.reviewTextArea.evaluate(
      (el) => el.validationMessage,
    );
    expect(reviewValidation).toBe("Please fill out this field.");
  });

  test("Verify review form visible - Form fields and heading present", async ({
    productDetailsPage,
  }) => {
    await productDetailsPage.verifyReviewFormVisible();
  });
});
