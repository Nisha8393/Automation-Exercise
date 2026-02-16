import { expect } from "@playwright/test";

export default class AccountCreatedPage {
  constructor(page) {
    this.page = page;

    // =========================
    // MAIN FORM SECTION
    // =========================
    this.formSection = this.page.locator("#form");

    // =========================
    // ACCOUNT CREATED CONFIRMATION
    // =========================
    this.accountCreatedHeading = this.page.locator(
      "h2[data-qa='account-created']",
    );
    this.congratulationsText = this.formSection.locator("p").first();
    this.continueButton = this.page.locator("a[data-qa='continue-button']");
  }

  // =================================================
  // INTERACTION METHODS
  // =================================================

  async clickContinue() {
    await expect(this.continueButton).toBeVisible();
    await this.continueButton.click();
  }

  // =================================================
  // VERIFICATION METHODS
  // =================================================

  async getSuccessMessage() {
    await expect(this.accountCreatedHeading).toBeVisible();
    return (await this.accountCreatedHeading.textContent()).trim();
  }

  async isAccountCreated() {
    await expect(this.accountCreatedHeading).toBeVisible();
    const text = await this.accountCreatedHeading.textContent();
    return text.trim() === "Account Created!";
  }
}
