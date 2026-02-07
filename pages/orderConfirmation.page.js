import { expect } from "@playwright/test";

export default class PaymentDonePage {
  constructor(page) {
    this.page = page;

    // =========================
    // FORM SECTION
    // =========================
    this.formSection = this.page.locator("#form");

    // =========================
    // ORDER CONFIRMATION
    // =========================
    this.orderPlacedHeading = this.formSection.locator(
      "h2[data-qa='order-placed']",
    );
    this.congratulationsText = this.formSection.locator("p").first();

    // =========================
    // ACTION BUTTONS
    // =========================
    this.downloadInvoiceButton = this.formSection.locator(
      "a.check_out[href*='download_invoice']",
    );
    this.continueButton = this.formSection.locator(
      "a[data-qa='continue-button']",
    );
  }

  // =================================================
  // INTERACTION METHODS
  // =================================================

  // ---------- DOWNLOAD INVOICE ----------
  async clickDownloadInvoice() {
    await this.formSection.scrollIntoViewIfNeeded();
    await expect(this.downloadInvoiceButton).toBeVisible();
    await this.downloadInvoiceButton.click();
  }

  async getInvoiceDownloadUrl() {
    await this.formSection.scrollIntoViewIfNeeded();
    await expect(this.downloadInvoiceButton).toBeVisible();
    return await this.downloadInvoiceButton.getAttribute("href");
  }

  // ---------- CONTINUE ----------
  async clickContinue() {
    await this.formSection.scrollIntoViewIfNeeded();
    await expect(this.continueButton).toBeVisible();
    await this.continueButton.click();
  }

  // ---------- VALIDATION METHODS ----------
  async getOrderPlacedMessage() {
    await this.formSection.scrollIntoViewIfNeeded();
    await expect(this.orderPlacedHeading).toBeVisible();
    return (await this.orderPlacedHeading.textContent()).trim();
  }

  async getCongratulationsMessage() {
    await this.formSection.scrollIntoViewIfNeeded();
    await expect(this.congratulationsText).toBeVisible();
    return (await this.congratulationsText.textContent()).trim();
  }

  async isOrderPlacedSuccessfully() {
    await this.formSection.scrollIntoViewIfNeeded();
    return await this.orderPlacedHeading.isVisible();
  }
}
