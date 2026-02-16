import { expect } from "@playwright/test";

export default class CheckoutPage {
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
    this.breadcrumbCheckoutText = this.breadcrumbList.locator("li.active");

    // =========================
    // ADDRESS DETAILS SECTION
    // =========================
    this.addressDetailsHeading = this.page
      .locator(".step-one h2.heading")
      .filter({ hasText: "Address Details" });

    this.checkoutInformation = this.page.locator(
      ".checkout-information[data-qa='checkout-info']",
    );

    // Delivery Address
    this.deliveryAddress =
      this.checkoutInformation.locator("#address_delivery");
    this.deliveryAddressTitle =
      this.deliveryAddress.locator("h3.page-subheading");
    this.deliveryAddressName = this.deliveryAddress
      .locator("li.address_firstname.address_lastname")
      .first();
    this.deliveryAddressLines = this.deliveryAddress.locator(
      "li.address_address1.address_address2",
    );
    this.deliveryAddressCityStateZip = this.deliveryAddress.locator(
      "li.address_city.address_state_name.address_postcode",
    );
    this.deliveryAddressCountry = this.deliveryAddress.locator(
      "li.address_country_name",
    );
    this.deliveryAddressPhone =
      this.deliveryAddress.locator("li.address_phone");

    // Billing Address
    this.billingAddress = this.checkoutInformation.locator("#address_invoice");
    this.billingAddressTitle =
      this.billingAddress.locator("h3.page-subheading");
    this.billingAddressName = this.billingAddress
      .locator("li.address_firstname.address_lastname")
      .first();
    this.billingAddressLines = this.billingAddress.locator(
      "li.address_address1.address_address2",
    );
    this.billingAddressCityStateZip = this.billingAddress.locator(
      "li.address_city.address_state_name.address_postcode",
    );
    this.billingAddressCountry = this.billingAddress.locator(
      "li.address_country_name",
    );
    this.billingAddressPhone = this.billingAddress.locator("li.address_phone");

    // =========================
    // REVIEW ORDER SECTION
    // =========================
    this.reviewOrderHeading = this.page
      .locator(".step-one h2.heading")
      .filter({ hasText: "Review Your Order" });

    // =========================
    // CART TABLE
    // =========================
    this.cartInfo = this.page.locator("#cart_info");
    this.cartTable = this.cartInfo.locator("table");
    this.cartTableHead = this.cartTable.locator("thead");
    this.cartTableBody = this.cartTable.locator("tbody");

    // Table headers
    this.itemHeader = this.cartTableHead.locator("td.image");
    this.descriptionHeader = this.cartTableHead.locator("td.description");
    this.priceHeader = this.cartTableHead.locator("td.price");
    this.quantityHeader = this.cartTableHead.locator("td.quantity");
    this.totalHeader = this.cartTableHead.locator("td.total");

    // Cart rows (excluding total row)
    this.cartRows = this.cartTableBody.locator("tr[id^='product-']");

    // Dynamic product row by product ID
    this.productRow = (productId) =>
      this.cartTableBody.locator(`#product-${productId}`);

    // Product row elements (use with productRow)
    this.productImage = (row) => row.locator("td.cart_product img");
    this.productNameLink = (row) => row.locator("td.cart_description h4 a");
    this.productCategory = (row) => row.locator("td.cart_description p");
    this.productPrice = (row) => row.locator("td.cart_price p");
    this.productQuantity = (row) => row.locator("td.cart_quantity button");
    this.productTotal = (row) =>
      row.locator("td.cart_total p.cart_total_price");

    // Total Amount Row
    this.totalAmountRow = this.cartTableBody
      .locator("tr")
      .filter({ has: this.page.locator("h4 b", { hasText: "Total Amount" }) });
    this.totalAmountLabel = this.totalAmountRow.locator("h4 b");
    this.totalAmountPrice = this.totalAmountRow.locator("p.cart_total_price");

    // =========================
    // ORDER MESSAGE
    // =========================
    this.orderMessageSection = this.page.locator("#ordermsg");
    this.orderMessageLabel = this.orderMessageSection.locator("label");
    this.orderMessageTextArea = this.orderMessageSection.locator("textarea");

    // =========================
    // PLACE ORDER
    // =========================
    this.placeOrderButton = this.page.locator("a.check_out");
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

  // ---------- DELIVERY ADDRESS GETTERS ----------
  async getDeliveryAddressName() {
    await this.checkoutInformation.scrollIntoViewIfNeeded();
    await expect(this.deliveryAddressName).toBeVisible();
    return (await this.deliveryAddressName.textContent()).trim();
  }

  async getDeliveryAddressLines() {
    await this.checkoutInformation.scrollIntoViewIfNeeded();
    const lines = await this.deliveryAddressLines.all();
    const addressLines = [];
    for (const line of lines) {
      const text = (await line.textContent()).trim();
      if (text) {
        addressLines.push(text);
      }
    }
    return addressLines;
  }

  async getDeliveryAddressCityStateZip() {
    await this.checkoutInformation.scrollIntoViewIfNeeded();
    await expect(this.deliveryAddressCityStateZip).toBeVisible();
    return (await this.deliveryAddressCityStateZip.textContent()).trim();
  }

  async getDeliveryAddressCountry() {
    await this.checkoutInformation.scrollIntoViewIfNeeded();
    await expect(this.deliveryAddressCountry).toBeVisible();
    return (await this.deliveryAddressCountry.textContent()).trim();
  }

  async getDeliveryAddressPhone() {
    await this.checkoutInformation.scrollIntoViewIfNeeded();
    await expect(this.deliveryAddressPhone).toBeVisible();
    return (await this.deliveryAddressPhone.textContent()).trim();
  }

  // ---------- BILLING ADDRESS GETTERS ----------
  async getBillingAddressName() {
    await this.checkoutInformation.scrollIntoViewIfNeeded();
    await expect(this.billingAddressName).toBeVisible();
    return (await this.billingAddressName.textContent()).trim();
  }

  async getBillingAddressLines() {
    await this.checkoutInformation.scrollIntoViewIfNeeded();
    const lines = await this.billingAddressLines.all();
    const addressLines = [];
    for (const line of lines) {
      const text = (await line.textContent()).trim();
      if (text) {
        addressLines.push(text);
      }
    }
    return addressLines;
  }

  async getBillingAddressCityStateZip() {
    await this.checkoutInformation.scrollIntoViewIfNeeded();
    await expect(this.billingAddressCityStateZip).toBeVisible();
    return (await this.billingAddressCityStateZip.textContent()).trim();
  }

  async getBillingAddressCountry() {
    await this.checkoutInformation.scrollIntoViewIfNeeded();
    await expect(this.billingAddressCountry).toBeVisible();
    return (await this.billingAddressCountry.textContent()).trim();
  }

  async getBillingAddressPhone() {
    await this.checkoutInformation.scrollIntoViewIfNeeded();
    await expect(this.billingAddressPhone).toBeVisible();
    return (await this.billingAddressPhone.textContent()).trim();
  }

  // ---------- CART PRODUCT GETTERS ----------
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

  async clickProductNameByProductId(productId) {
    await this.cartInfo.scrollIntoViewIfNeeded();
    const row = this.productRow(productId);
    await expect(row).toBeVisible();
    const nameLink = this.productNameLink(row);
    await expect(nameLink).toBeVisible();
    await nameLink.click();
  }

  // ---------- TOTAL AMOUNT ----------
  async getTotalAmount() {
    await this.cartInfo.scrollIntoViewIfNeeded();
    await expect(this.totalAmountPrice).toBeVisible();
    return (await this.totalAmountPrice.textContent()).trim();
  }

  // ---------- ORDER MESSAGE ----------
  async fillOrderMessage(message) {
    await this.orderMessageSection.scrollIntoViewIfNeeded();
    await expect(this.orderMessageTextArea).toBeVisible();
    await this.orderMessageTextArea.clear();
    await this.orderMessageTextArea.fill(message);
  }

  async getOrderMessage() {
    await this.orderMessageSection.scrollIntoViewIfNeeded();
    await expect(this.orderMessageTextArea).toBeVisible();
    return await this.orderMessageTextArea.inputValue();
  }

  // ---------- PLACE ORDER ----------
  async clickPlaceOrder() {
    await expect(this.placeOrderButton).toBeVisible();
    await this.placeOrderButton.click();
  }

  // ---------- VALIDATION METHODS ----------
  async getCartItemsCount() {
    await this.cartInfo.scrollIntoViewIfNeeded();
    return await this.cartRows.count();
  }

  async isProductInOrder(productId) {
    await this.cartInfo.scrollIntoViewIfNeeded();
    const row = this.productRow(productId);
    return await row.isVisible();
  }

  async getAllProductIds() {
    await this.cartInfo.scrollIntoViewIfNeeded();
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

  async verifyDeliveryAddress(expectedAddress) {
    const name = await this.getDeliveryAddressName();
    expect(name).toContain(expectedAddress.name);

    const cityStateZip = (await this.getDeliveryAddressCityStateZip()).replace(
      /\s+/g,
      " ",
    );
    expect(cityStateZip).toContain(expectedAddress.cityStateZip);

    const country = await this.getDeliveryAddressCountry();
    expect(country).toContain(expectedAddress.country);

    const phone = await this.getDeliveryAddressPhone();
    expect(phone).toContain(expectedAddress.phone);
  }

  async verifyBillingAddress(expectedAddress) {
    const name = await this.getBillingAddressName();
    expect(name).toContain(expectedAddress.name);

    const cityStateZip = (await this.getBillingAddressCityStateZip()).replace(
      /\s+/g,
      " ",
    );
    expect(cityStateZip).toContain(expectedAddress.cityStateZip);

    const country = await this.getBillingAddressCountry();
    expect(country).toContain(expectedAddress.country);

    const phone = await this.getBillingAddressPhone();
    expect(phone).toContain(expectedAddress.phone);
  }

  async verifyAddressFieldsVisible() {
    await expect(this.deliveryAddressName).toBeVisible();
    await expect(this.deliveryAddressCityStateZip).toBeVisible();
    await expect(this.deliveryAddressCountry).toBeVisible();
    await expect(this.deliveryAddressPhone).toBeVisible();

    await expect(this.billingAddressName).toBeVisible();
    await expect(this.billingAddressCityStateZip).toBeVisible();
    await expect(this.billingAddressCountry).toBeVisible();
    await expect(this.billingAddressPhone).toBeVisible();
  }

  async verifyOrderHasItems() {
    const itemCount = await this.getCartItemsCount();
    expect(itemCount).toBeGreaterThan(0);

    const productIds = await this.getAllProductIds();
    expect(productIds.length).toBeGreaterThan(0);
  }

  async verifyTotalAmount() {
    const totalAmount = await this.getTotalAmount();
    expect(totalAmount).toBeTruthy();
    expect(totalAmount).toContain("Rs.");
  }

  async verifyOrderMessage(expectedMessage) {
    const savedMessage = await this.getOrderMessage();
    expect(savedMessage).toBe(expectedMessage);
  }
}
