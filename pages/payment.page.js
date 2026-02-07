import { expect } from "@playwright/test";

export default class PaymentPage {
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
    this.breadcrumbPaymentText = this.breadcrumbList.locator("li.active");

    // =========================
    // PAYMENT HEADING
    // =========================
    this.paymentHeading = this.page
      .locator(".step-one h2.heading")
      .filter({ hasText: "Payment" });

    // =========================
    // PAYMENT FORM
    // =========================
    this.paymentInformation = this.page.locator(".payment-information");
    this.paymentForm = this.paymentInformation.locator("#payment-form");

    // Name on Card
    this.nameOnCardLabel = this.paymentForm.locator("label", {
      hasText: "Name on Card",
    });
    this.nameOnCardInput = this.paymentForm.locator(
      "input[data-qa='name-on-card']",
    );

    // Card Number
    this.cardNumberLabel = this.paymentForm.locator("label", {
      hasText: "Card Number",
    });
    this.cardNumberInput = this.paymentForm.locator(
      "input[data-qa='card-number']",
    );

    // CVC
    this.cvcLabel = this.paymentForm.locator("label", { hasText: "CVC" });
    this.cvcInput = this.paymentForm.locator("input[data-qa='cvc']");

    // Expiration
    this.expirationLabel = this.paymentForm.locator("label", {
      hasText: "Expiration",
    });
    this.expiryMonthInput = this.paymentForm.locator(
      "input[data-qa='expiry-month']",
    );
    this.expiryYearInput = this.paymentForm.locator(
      "input[data-qa='expiry-year']",
    );

    // Success Message
    this.successMessageSection = this.paymentForm.locator("#success_message");
    this.successMessageAlert =
      this.successMessageSection.locator(".alert-success");

    // Submit Button
    this.payAndConfirmButton = this.paymentForm.locator(
      "button[data-qa='pay-button']",
    );
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

  // ---------- PAYMENT FORM ACTIONS ----------
  async fillNameOnCard(name) {
    await this.paymentInformation.scrollIntoViewIfNeeded();
    await expect(this.nameOnCardInput).toBeVisible();
    await this.nameOnCardInput.clear();
    await this.nameOnCardInput.fill(name);
  }

  async fillCardNumber(cardNumber) {
    await this.paymentInformation.scrollIntoViewIfNeeded();
    await expect(this.cardNumberInput).toBeVisible();
    await this.cardNumberInput.clear();
    await this.cardNumberInput.fill(cardNumber);
  }

  async fillCVC(cvc) {
    await this.paymentInformation.scrollIntoViewIfNeeded();
    await expect(this.cvcInput).toBeVisible();
    await this.cvcInput.clear();
    await this.cvcInput.fill(cvc);
  }

  async fillExpiryMonth(month) {
    await this.paymentInformation.scrollIntoViewIfNeeded();
    await expect(this.expiryMonthInput).toBeVisible();
    await this.expiryMonthInput.clear();
    await this.expiryMonthInput.fill(month);
  }

  async fillExpiryYear(year) {
    await this.paymentInformation.scrollIntoViewIfNeeded();
    await expect(this.expiryYearInput).toBeVisible();
    await this.expiryYearInput.clear();
    await this.expiryYearInput.fill(year);
  }

  async clickPayAndConfirm() {
    await this.paymentInformation.scrollIntoViewIfNeeded();
    await expect(this.payAndConfirmButton).toBeVisible();
    await this.payAndConfirmButton.click();
  }

  // ---------- COMBINED PAYMENT ACTION ----------
  async fillPaymentDetails(paymentInfo) {
    await this.fillNameOnCard(paymentInfo.nameOnCard);
    await this.fillCardNumber(paymentInfo.cardNumber);
    await this.fillCVC(paymentInfo.cvc);
    await this.fillExpiryMonth(paymentInfo.expiryMonth);
    await this.fillExpiryYear(paymentInfo.expiryYear);
  }

  async completePayment(paymentInfo) {
    await this.fillPaymentDetails(paymentInfo);
    await this.clickPayAndConfirm();
  }

  // ---------- VALIDATION METHODS ----------
  async getNameOnCard() {
    await this.paymentInformation.scrollIntoViewIfNeeded();
    await expect(this.nameOnCardInput).toBeVisible();
    return await this.nameOnCardInput.inputValue();
  }

  async getCardNumber() {
    await this.paymentInformation.scrollIntoViewIfNeeded();
    await expect(this.cardNumberInput).toBeVisible();
    return await this.cardNumberInput.inputValue();
  }

  async getCVC() {
    await this.paymentInformation.scrollIntoViewIfNeeded();
    await expect(this.cvcInput).toBeVisible();
    return await this.cvcInput.inputValue();
  }

  async getExpiryMonth() {
    await this.paymentInformation.scrollIntoViewIfNeeded();
    await expect(this.expiryMonthInput).toBeVisible();
    return await this.expiryMonthInput.inputValue();
  }

  async getExpiryYear() {
    await this.paymentInformation.scrollIntoViewIfNeeded();
    await expect(this.expiryYearInput).toBeVisible();
    return await this.expiryYearInput.inputValue();
  }

  async isSuccessMessageVisible() {
    return await this.successMessageAlert.isVisible();
  }

  async getSuccessMessage() {
    await expect(this.successMessageAlert).toBeVisible();
    return (await this.successMessageAlert.textContent()).trim();
  }
}
