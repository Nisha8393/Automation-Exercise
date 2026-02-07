import { expect } from "@playwright/test";

export default class ProductDetailPage {
  constructor(page) {
    this.page = page;

    // =========================
    // CART MODAL
    // =========================
    this.cartModal = this.page.locator("#cartModal");
    this.cartModalIcon = this.cartModal.locator(".icon-box i").first();
    this.cartModalTitle = this.cartModal.locator(".modal-title").first();
    this.cartModalMessage = this.cartModal.locator(".modal-body p").first();
    this.cartModalViewCartLink = this.cartModal.getByRole("link", {
      name: /View Cart/i,
    });
    this.cartModalContinueButton = this.cartModal.locator("button.close-modal");

    // =========================
    // PRODUCT DETAILS SECTION
    // =========================
    this.productDetailsSection = this.page.locator(".product-details");

    // Product Image
    this.viewProduct = this.productDetailsSection.locator(".view-product");
    this.productImage = this.viewProduct.locator("img");

    // Product Information
    this.productInformation = this.productDetailsSection.locator(
      ".product-information",
    );
    this.newArrivalBadge = this.productInformation.locator("img.newarrival");
    this.productNameHeading = this.productInformation.locator("h2");
    this.productCategoryText = this.productInformation.locator("p").first();
    this.ratingImage = this.productInformation.locator(
      "img[src*='rating.png']",
    );

    // Price and Add to Cart
    this.productPriceText = this.productInformation
      .locator("span")
      .filter({ hasText: /Rs\./ })
      .first();
    this.quantityLabel = this.productInformation.getByText("Quantity:");
    this.quantityInput = this.productInformation.locator("#quantity");
    this.productIdInput = this.productInformation.locator("#product_id");
    this.addToCartButton = this.productInformation.locator("button.cart");

    // Product Details
    this.availabilityText = this.productInformation
      .locator("p")
      .filter({ hasText: /Availability:/ });
    this.conditionText = this.productInformation
      .locator("p")
      .filter({ hasText: /Condition:/ });
    this.brandText = this.productInformation
      .locator("p")
      .filter({ hasText: /Brand:/ });

    // =========================
    // REVIEW SECTION
    // =========================
    this.categoryTab = this.page.locator(".category-tab");
    this.reviewTabLink = this.categoryTab.getByRole("link", {
      name: /Write Your Review/i,
    });

    // Review Form
    this.reviewForm = this.page.locator("#review-form");
    this.reviewNameInput = this.reviewForm.locator("#name");
    this.reviewEmailInput = this.reviewForm.locator("#email");
    this.reviewTextArea = this.reviewForm.locator("#review");
    this.reviewSubmitButton = this.reviewForm.locator("#button-review");

    // Review Success Message
    this.reviewSuccessSection = this.reviewForm.locator("#review-section");
    this.reviewSuccessAlert =
      this.reviewSuccessSection.locator(".alert-success");
  }

  // =================================================
  // INTERACTION METHODS
  // =================================================

  // ---------- PRODUCT DETAILS ACTIONS ----------
  async getProductName() {
    await this.productDetailsSection.scrollIntoViewIfNeeded();
    await expect(this.productNameHeading).toBeVisible();
    return (await this.productNameHeading.textContent()).trim();
  }

  async getProductCategory() {
    await this.productDetailsSection.scrollIntoViewIfNeeded();
    await expect(this.productCategoryText).toBeVisible();
    const text = await this.productCategoryText.textContent();
    return text.replace("Category:", "").trim();
  }

  async getProductPrice() {
    await this.productDetailsSection.scrollIntoViewIfNeeded();
    await expect(this.productPriceText).toBeVisible();
    return (await this.productPriceText.textContent()).trim();
  }

  async getAvailability() {
    await this.productDetailsSection.scrollIntoViewIfNeeded();
    await expect(this.availabilityText).toBeVisible();
    const text = await this.availabilityText.textContent();
    return text.replace("Availability:", "").trim();
  }

  async getCondition() {
    await this.productDetailsSection.scrollIntoViewIfNeeded();
    await expect(this.conditionText).toBeVisible();
    const text = await this.conditionText.textContent();
    return text.replace("Condition:", "").trim();
  }

  async getBrand() {
    await this.productDetailsSection.scrollIntoViewIfNeeded();
    await expect(this.brandText).toBeVisible();
    const text = await this.brandText.textContent();
    return text.replace("Brand:", "").trim();
  }

  async getProductId() {
    await this.productDetailsSection.scrollIntoViewIfNeeded();
    await expect(this.productIdInput).toBeVisible();
    return await this.productIdInput.getAttribute("value");
  }

  // ---------- QUANTITY ACTIONS ----------
  async getQuantity() {
    await this.productDetailsSection.scrollIntoViewIfNeeded();
    await expect(this.quantityInput).toBeVisible();
    return await this.quantityInput.inputValue();
  }

  async setQuantity(quantity) {
    await this.productDetailsSection.scrollIntoViewIfNeeded();
    await expect(this.quantityInput).toBeVisible();
    await this.quantityInput.clear();
    await this.quantityInput.fill(quantity.toString());
  }

  async increaseQuantity(times = 1) {
    await this.productDetailsSection.scrollIntoViewIfNeeded();
    await expect(this.quantityInput).toBeVisible();
    for (let i = 0; i < times; i++) {
      await this.quantityInput.press("ArrowUp");
    }
  }

  async decreaseQuantity(times = 1) {
    await this.productDetailsSection.scrollIntoViewIfNeeded();
    await expect(this.quantityInput).toBeVisible();
    for (let i = 0; i < times; i++) {
      await this.quantityInput.press("ArrowDown");
    }
  }

  // ---------- ADD TO CART ACTIONS ----------
  async clickAddToCart() {
    await this.productDetailsSection.scrollIntoViewIfNeeded();
    await expect(this.addToCartButton).toBeVisible();
    await this.addToCartButton.click();
  }

  async addToCartWithQuantity(quantity) {
    await this.setQuantity(quantity);
    await this.clickAddToCart();
  }

  // ---------- CART MODAL ACTIONS ----------
  async clickCartModalViewCart() {
    await expect(this.cartModal).toBeVisible();
    await expect(this.cartModalViewCartLink).toBeVisible();
    await this.cartModalViewCartLink.click();
  }

  async clickCartModalContinue() {
    await expect(this.cartModal).toBeVisible();
    await expect(this.cartModalContinueButton).toBeVisible();
    await this.cartModalContinueButton.click();
  }

  // ---------- REVIEW ACTIONS ----------
  async clickReviewTab() {
    await this.categoryTab.scrollIntoViewIfNeeded();
    await expect(this.reviewTabLink).toBeVisible();
    await this.reviewTabLink.click();
  }

  async fillReviewName(name) {
    await this.reviewForm.scrollIntoViewIfNeeded();
    await expect(this.reviewNameInput).toBeVisible();
    await this.reviewNameInput.clear();
    await this.reviewNameInput.fill(name);
  }

  async fillReviewEmail(email) {
    await this.reviewForm.scrollIntoViewIfNeeded();
    await expect(this.reviewEmailInput).toBeVisible();
    await this.reviewEmailInput.clear();
    await this.reviewEmailInput.fill(email);
  }

  async fillReviewText(reviewText) {
    await this.reviewForm.scrollIntoViewIfNeeded();
    await expect(this.reviewTextArea).toBeVisible();
    await this.reviewTextArea.clear();
    await this.reviewTextArea.fill(reviewText);
  }

  async clickReviewSubmit() {
    await this.reviewForm.scrollIntoViewIfNeeded();
    await expect(this.reviewSubmitButton).toBeVisible();
    await this.reviewSubmitButton.click();
  }

  async submitReview(name, email, reviewText) {
    await this.fillReviewName(name);
    await this.fillReviewEmail(email);
    await this.fillReviewText(reviewText);
    await this.clickReviewSubmit();
  }

  // ---------- VERIFICATION METHODS ----------
  async isProductInStock() {
    const availability = await this.getAvailability();
    return availability.toLowerCase().includes("in stock");
  }

  async isNewArrival() {
    await this.productDetailsSection.scrollIntoViewIfNeeded();
    return await this.newArrivalBadge.isVisible();
  }

  async isReviewSuccessVisible() {
    return await this.reviewSuccessAlert.isVisible();
  }
}
