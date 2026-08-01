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
    this.accountCreatedHeading = this.formSection.getByRole("heading", {
      name: "Account Created!",
    });
    this.congratulationsText = this.formSection.getByRole("paragraph").first();
    this.continueButton = this.formSection.getByRole("link", {
      name: "Continue",
    });
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
