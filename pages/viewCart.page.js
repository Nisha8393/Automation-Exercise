import { expect } from "@playwright/test";

export default class ViewCartPage {
  constructor(page) {
    this.page = page;

    // =========================
    // CART ITEMS SECTION
    // =========================
    this.cartItemsSection = this.page.locator("#cart_items");

    // =========================
    // BREADCRUMBS
    // =========================
    this.breadcrumbs = this.cartItemsSection.locator(".breadcrumbs");
    this.breadcrumbList = this.breadcrumbs.locator("ol.breadcrumb");
    this.breadcrumbHomeLink = this.breadcrumbList.getByRole("link", {
      name: "Home",
    });
    this.breadcrumbShoppingCartText = this.breadcrumbList.locator("li.active");

    // =========================
    // CHECKOUT SECTION
    // =========================
    this.doActionSection = this.page.locator("#do_action");
    this.proceedToCheckoutButton = this.doActionSection.locator("a.check_out");

    // =========================
    // CHECKOUT MODAL
    // =========================
    this.checkoutModal = this.page.locator("#checkoutModal");
    this.checkoutModalIcon = this.checkoutModal.locator(".icon-box i").first();
    this.checkoutModalTitle = this.checkoutModal
      .locator(".modal-title")
      .first();
    this.checkoutModalMessage = this.checkoutModal
      .locator(".modal-body p")
      .first();
    this.checkoutModalRegisterLoginLink = this.checkoutModal.getByRole("link", {
      name: /Register \/ Login/i,
    });
    this.checkoutModalContinueButton = this.checkoutModal.locator(
      "button.close-checkout-modal",
    );

    // =========================
    // CART TABLE
    // =========================
    this.cartInfo = this.page.locator("#cart_info");
    this.cartTable = this.cartInfo.locator("#cart_info_table");
    this.cartTableHead = this.cartTable.locator("thead");
    this.cartTableBody = this.cartTable.locator("tbody");

    // Table headers
    this.itemHeader = this.cartTableHead.locator("td.image");
    this.descriptionHeader = this.cartTableHead.locator("td.description");
    this.priceHeader = this.cartTableHead.locator("td.price");
    this.quantityHeader = this.cartTableHead.locator("td.quantity");
    this.totalHeader = this.cartTableHead.locator("td.total");

    // Cart rows
    this.cartRows = this.cartTableBody.locator("tr");

    // Dynamic product row by product ID
    this.productRow = (productId) =>
      this.cartTableBody.locator(`#product-${productId}`);

    // Product row elements (use with productRow)
    this.productImage = (row) =>
      row.locator("td.cart_product img.product_image");
    this.productNameLink = (row) => row.locator("td.cart_description h4 a");
    this.productCategory = (row) => row.locator("td.cart_description p");
    this.productPrice = (row) => row.locator("td.cart_price p");
    this.productQuantity = (row) => row.locator("td.cart_quantity button");
    this.productTotal = (row) =>
      row.locator("td.cart_total p.cart_total_price");
    this.productDeleteButton = (row) =>
      row.locator("td.cart_delete a.cart_quantity_delete");

    // =========================
    // EMPTY CART
    // =========================
    this.emptyCartMessage = this.cartInfo.locator("#empty_cart");
    this.emptyCartBuyProductsLink = this.emptyCartMessage.getByRole("link", {
      name: /here/i,
    });
  }

  // =================================================
  // INTERACTION METHODS
  // =================================================

  // ---------- BREADCRUMB ACTIONS ----------
  async clickBreadcrumbHome() {
    await this.breadcrumbs.scrollIntoViewIfNeeded();
    await expect(this.breadcrumbHomeLink).toBeVisible();
    await this.breadcrumbHomeLink.click();
  }

  // ---------- CHECKOUT ACTIONS ----------
  async clickProceedToCheckout() {
    await this.doActionSection.scrollIntoViewIfNeeded();
    await expect(this.proceedToCheckoutButton).toBeVisible();
    await this.proceedToCheckoutButton.click();
  }

  // ---------- CHECKOUT MODAL ACTIONS ----------
  async clickCheckoutModalRegisterLogin() {
    await expect(this.checkoutModal).toBeVisible();
    await expect(this.checkoutModalRegisterLoginLink).toBeVisible();
    await this.checkoutModalRegisterLoginLink.click();
  }

  async clickCheckoutModalContinue() {
    await expect(this.checkoutModal).toBeVisible();
    await expect(this.checkoutModalContinueButton).toBeVisible();
    await this.checkoutModalContinueButton.click();
  }

  // ---------- CART PRODUCT ACTIONS ----------
  async getProductNameByProductId(productId) {
    await this.cartInfo.scrollIntoViewIfNeeded();
    const row = this.productRow(productId);
    await expect(row).toBeVisible();
    const nameLink = this.productNameLink(row);
    await expect(nameLink).toBeVisible();
    return (await nameLink.textContent()).trim();
  }

  async getProductCategoryByProductId(productId) {
    await this.cartInfo.scrollIntoViewIfNeeded();
    const row = this.productRow(productId);
    await expect(row).toBeVisible();
    const category = this.productCategory(row);
    await expect(category).toBeVisible();
    return (await category.textContent()).trim();
  }

  async getProductPriceByProductId(productId) {
    await this.cartInfo.scrollIntoViewIfNeeded();
    const row = this.productRow(productId);
    await expect(row).toBeVisible();
    const price = this.productPrice(row);
    await expect(price).toBeVisible();
    return (await price.textContent()).trim();
  }

  async getProductQuantityByProductId(productId) {
    await this.cartInfo.scrollIntoViewIfNeeded();
    const row = this.productRow(productId);
    await expect(row).toBeVisible();
    const quantity = this.productQuantity(row);
    await expect(quantity).toBeVisible();
    return (await quantity.textContent()).trim();
  }

  async getProductTotalByProductId(productId) {
    await this.cartInfo.scrollIntoViewIfNeeded();
    const row = this.productRow(productId);
    await expect(row).toBeVisible();
    const total = this.productTotal(row);
    await expect(total).toBeVisible();
    return (await total.textContent()).trim();
  }

  async clickProductDeleteByProductId(productId) {
    await this.cartInfo.scrollIntoViewIfNeeded();
    const row = this.productRow(productId);
    await expect(row).toBeVisible();
    const deleteBtn = this.productDeleteButton(row);
    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();
  }

  async clickProductNameByProductId(productId) {
    await this.cartInfo.scrollIntoViewIfNeeded();
    const row = this.productRow(productId);
    await expect(row).toBeVisible();
    const nameLink = this.productNameLink(row);
    await expect(nameLink).toBeVisible();
    await nameLink.click();
  }

  // ---------- EMPTY CART ACTIONS ----------
  async clickEmptyCartBuyProducts() {
    await expect(this.emptyCartMessage).toBeVisible();
    await expect(this.emptyCartBuyProductsLink).toBeVisible();
    await this.emptyCartBuyProductsLink.click();
  }

  // ---------- VALIDATION METHODS ----------
  async isCartEmpty() {
    await this.cartInfo.scrollIntoViewIfNeeded();
    return await this.emptyCartMessage.isVisible();
  }

  async getCartItemsCount() {
    await this.cartInfo.scrollIntoViewIfNeeded();
    if (await this.isCartEmpty()) {
      return 0;
    }
    return await this.cartRows.count();
  }

  async isProductInCart(productId) {
    await this.cartInfo.scrollIntoViewIfNeeded();
    const row = this.productRow(productId);
    return await row.isVisible();
  }

  async getAllProductIds() {
    await this.cartInfo.scrollIntoViewIfNeeded();
    if (await this.isCartEmpty()) {
      return [];
    }

    const rows = await this.cartRows.all();
    const productIds = [];

    for (const row of rows) {
      const id = await row.getAttribute("id");
      if (id) {
        productIds.push(id.replace("product-", ""));
      }
    }

    return productIds;
  }

  // ---------- VERIFICATION METHODS ----------
  async verifyProductName(productId, expectedName) {
    const actualName = await this.getProductNameByProductId(productId);
    expect(actualName).toBe(expectedName);
  }

  async verifyProductQuantity(productId, expectedQuantity) {
    const actualQuantity = await this.getProductQuantityByProductId(productId);
    expect(actualQuantity).toBe(expectedQuantity);
  }

  async verifyCartContainsProducts(expectedNames) {
    const productIds = await this.getAllProductIds();
    const cartNames = [];
    for (const id of productIds) {
      const name = await this.getProductNameByProductId(id);
      cartNames.push(name);
    }
    for (const expectedName of expectedNames) {
      expect(cartNames).toContain(expectedName);
    }
  }

  async verifyCartItemsCount(expectedCount) {
    const actualCount = await this.getCartItemsCount();
    expect(actualCount).toBe(expectedCount);
  }

  async verifyCheckoutModal() {
    await expect(this.checkoutModal).toBeVisible();
    await expect(this.checkoutModalTitle).toHaveText("Checkout");
    await expect(this.checkoutModalMessage).toHaveText(
      "Register / Login account to proceed on checkout.",
    );
    await expect(this.checkoutModalRegisterLoginLink).toBeVisible();
    await expect(this.checkoutModalRegisterLoginLink).toHaveText(
      "Register / Login",
    );
    await expect(this.checkoutModalRegisterLoginLink).toHaveAttribute(
      "href",
      "/login",
    );
    await expect(this.checkoutModalContinueButton).toBeVisible();
    await expect(this.checkoutModalContinueButton).toHaveText(
      "Continue On Cart",
    );
  }

  async verifyEmptyCartState() {
    await expect(this.emptyCartMessage).toBeVisible();
    await expect(this.emptyCartMessage).toContainText(
      "Cart is empty! Click here to buy products.",
    );
    await expect(this.emptyCartBuyProductsLink).toBeVisible();
    await expect(this.emptyCartBuyProductsLink).toHaveText("here");
  }

  async verifyProductTotalPrice(productId, expectedTotal) {
    const totalText = await this.getProductTotalByProductId(productId);
    const total = parseInt(totalText.replace(/[^\d]/g, ""), 10);
    expect(total).toBe(expectedTotal);
  }

  async calculateCartTotal() {
    await this.cartInfo.scrollIntoViewIfNeeded();
    if (await this.isCartEmpty()) {
      return 0;
    }

    const productIds = await this.getAllProductIds();
    let total = 0;

    for (const productId of productIds) {
      const totalText = await this.getProductTotalByProductId(productId);
      const amount = parseFloat(totalText.replace(/[^0-9.]/g, ""));
      total += amount;
    }

    return total;
  }
}
