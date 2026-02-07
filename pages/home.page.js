import { expect } from "@playwright/test";

export default class HomePage {
  constructor(page) {
    this.page = page;

    // =========================
    // SLIDER SECTION
    // =========================
    this.sliderSection = this.page.locator("#slider");
    this.sliderCarousel = this.sliderSection.locator("#slider-carousel");
    this.sliderIndicators = this.sliderCarousel.locator(
      ".carousel-indicators li",
    );
    this.sliderItems = this.sliderCarousel.locator(".carousel-inner .item");
    this.sliderPrevButton = this.sliderCarousel.locator(
      "a.left.control-carousel",
    );
    this.sliderNextButton = this.sliderCarousel.locator(
      "a.right.control-carousel",
    );
    this.sliderTestCasesButton = this.sliderCarousel.getByRole("button", {
      name: /Test Cases/i,
    });
    this.sliderApisButton = this.sliderCarousel.getByRole("button", {
      name: /APIs list/i,
    });

    // =========================
    // FEATURED ITEMS SECTION
    // =========================
    this.featuresItemsSection = this.page.locator(".features_items");
    this.featuresItemsHeading = this.featuresItemsSection.getByRole("heading", {
      name: "Features Items",
    });

    this.productCards = this.featuresItemsSection.locator(
      ".product-image-wrapper",
    );

    // Specific product card by name
    this.productCard = (productName) =>
      this.productCards.filter({
        has: this.page.locator("p", { hasText: productName }),
      });

    // ---- FIXED PRODUCT ELEMENTS (STRICT SAFE) ----
    this.productImage = (product) => product.locator("img").first();
    this.productPrice = (product) =>
      product.locator("h2:has-text('Rs.')").first();
    this.productName = (product) => product.locator("p").first();
    this.productAddToCartButton = (product) =>
      product.locator("a.add-to-cart").first();
    this.productViewProductLink = (product) =>
      product.locator("a[href*='product_details']").first();

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
    // RECOMMENDED ITEMS SECTION
    // =========================
    this.recommendedItemsSection = this.page.locator(".recommended_items");
    this.recommendedItemsHeading = this.recommendedItemsSection.getByRole(
      "heading",
      { name: "Recommended Items" },
    );
    this.recommendedCarousel = this.recommendedItemsSection.locator(
      "#recommended-item-carousel",
    );
    this.recommendedItems = this.recommendedCarousel.locator(
      ".product-image-wrapper",
    );

    this.recommendedProduct = (productName) =>
      this.recommendedItems.filter({
        has: this.page.locator("p", { hasText: productName }),
      });

    this.recommendedProductAddToCartButton = (product) =>
      product.locator("a.add-to-cart").first();
  }

  // =================================================
  // INTERACTION METHODS
  // =================================================

  // ---------- PRODUCT ACTIONS ----------
  async hoverOverProduct(productName) {
    await this.featuresItemsSection.scrollIntoViewIfNeeded();

    const product = this.productCard(productName);
    await expect(product).toBeVisible();

    await product.scrollIntoViewIfNeeded();
    await product.hover();
  }

  async addProductToCart(productName) {
    await this.hoverOverProduct(productName);

    const product = this.productCard(productName);
    const addToCartBtn = this.productAddToCartButton(product);

    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();
  }

  async viewProduct(productName) {
    await this.hoverOverProduct(productName);

    const product = this.productCard(productName);
    const viewLink = this.productViewProductLink(product);

    await expect(viewLink).toBeVisible();
    await viewLink.click();
  }

  async getProductPrice(productName) {
    await this.featuresItemsSection.scrollIntoViewIfNeeded();

    const product = this.productCard(productName);
    await expect(product).toBeVisible();

    const price = this.productPrice(product);
    await expect(price).toBeVisible();

    return (await price.textContent()).trim();
  }

  async getProductName(productName) {
    await this.featuresItemsSection.scrollIntoViewIfNeeded();

    const product = this.productCard(productName);
    await expect(product).toBeVisible();

    const name = this.productName(product);
    await expect(name).toBeVisible();

    return (await name.textContent()).trim();
  }

  // ---------- CART MODAL ----------
  async clickCartModalViewCart() {
    await expect(this.cartModal).toBeVisible();
    await this.cartModalViewCartLink.click();
  }

  async clickCartModalContinue() {
    await expect(this.cartModal).toBeVisible();
    await this.cartModalContinueButton.click();
  }

  // ---------- COUNTS ----------
  async getProductCardsCount() {
    await this.featuresItemsSection.scrollIntoViewIfNeeded();
    return await this.productCards.count();
  }

  async getRecommendedItemsCount() {
    await this.recommendedItemsSection.scrollIntoViewIfNeeded();
    return await this.recommendedItems.count();
  }

  async getSliderItemsCount() {
    await this.sliderSection.scrollIntoViewIfNeeded();
    return await this.sliderItems.count();
  }
}
