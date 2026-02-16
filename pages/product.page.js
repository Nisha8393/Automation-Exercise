import { expect } from "@playwright/test";

export default class ProductsPage {
  constructor(page) {
    this.page = page;

    // =========================
    // ADVERTISEMENT SECTION (SEARCH)
    // =========================
    this.advertisementSection = this.page.locator("#advertisement");
    this.saleImage = this.advertisementSection.locator("#sale_image");
    this.searchProductInput =
      this.advertisementSection.locator("#search_product");
    this.searchButton = this.advertisementSection.locator("#submit_search");

    // =========================
    // PRODUCTS SECTION
    // =========================
    this.featuresItemsSection = this.page.locator(".features_items");
    this.allProductsHeading = this.featuresItemsSection.getByRole("heading", {
      name: "All Products",
    });

    this.filterHeading = this.featuresItemsSection.locator("h2.title");

    this.productCards = this.featuresItemsSection.locator(
      ".product-image-wrapper",
    );

    // Specific product card by name
    this.productCard = (productName) =>
      this.productCards.filter({
        has: this.page.locator("p", { hasText: productName }),
      });

    // Product elements (strict safe with .first())
    this.productImage = (product) => product.locator("img").first();
    this.productPrice = (product) =>
      product.locator("h2:has-text('Rs.')").first();
    this.productName = (product) => product.locator("p").first();
    this.productAddToCartButton = (product) =>
      product.locator(".overlay-content a.add-to-cart");
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
  }

  // =================================================
  // INTERACTION METHODS
  // =================================================

  // ---------- SEARCH ACTIONS ----------
  async fillSearchProduct(searchText) {
    await this.advertisementSection.scrollIntoViewIfNeeded();
    await expect(this.searchProductInput).toBeVisible();
    await this.searchProductInput.clear();
    await this.searchProductInput.fill(searchText);
  }

  async clickSearch() {
    await this.advertisementSection.scrollIntoViewIfNeeded();
    await expect(this.searchButton).toBeVisible();
    await this.searchButton.click();
  }

  async searchProduct(searchText) {
    await this.fillSearchProduct(searchText);
    await this.clickSearch();
  }

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

  // ---------- VERIFICATION METHODS ----------
  async verifyProductCardDetails(product) {
    await expect(this.productImage(product)).toBeVisible();
    await expect(this.productName(product)).toBeVisible();
    await expect(this.productPrice(product)).toBeVisible();
  }

  async verifyCartModalShown(expectedTitle = "Added!") {
    await expect(this.cartModal).toBeVisible();
    await expect(this.cartModalTitle).toHaveText(expectedTitle);
  }

  async verifyFilterHeading(pattern) {
    await expect(this.filterHeading).toBeVisible();
    await expect(this.filterHeading).toContainText(pattern);
  }

  async verifyProductCount(expectedCount) {
    const actualCount = await this.getProductCardsCount();
    expect(actualCount).toBe(expectedCount);
  }

  // ----- get all products card -----
  async allProductCards() {
    return this.productCards;
  }

  async getAllProductNamesText() {
    const names = [];
    const cards = await this.productCards.all();

    for (const card of cards) {
      const name = await this.productName(card).textContent();
      names.push(name.trim());
    }
    return names;
  }
}
