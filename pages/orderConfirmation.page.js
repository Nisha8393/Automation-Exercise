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
    this.orderPlacedHeading = this.formSection.getByRole("heading", {
      name: "Order Placed!",
    });
    this.congratulationsText = this.formSection.getByRole("paragraph").first();

    // =========================
    // ACTION BUTTONS
    // =========================
    this.downloadInvoiceButton = this.formSection.getByRole("link", {
      name: "Download Invoice",
    });
    this.continueButton = this.formSection.getByRole("link", {
      name: "Continue",
    });
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
