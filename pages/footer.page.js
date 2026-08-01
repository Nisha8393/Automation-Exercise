import { expect } from "@playwright/test";

export default class FooterSection {
  constructor(page) {
    this.page = page;

    // Main footer container
    this.footer = this.page.getByRole("contentinfo");

    // Footer widget section
    this.footerWidget = this.footer.locator(".footer-widget");
    this.subscriptionSection = this.footerWidget.locator(".single-widget");
    this.subscriptionHeading = this.subscriptionSection.getByRole("heading", {
      name: "Subscription",
    });

    // Subscription form
    this.subscriptionForm = this.subscriptionSection.locator("form.searchform");
    this.subscriptionEmailInput = this.subscriptionForm.getByRole("textbox", {
      name: "Your email address",
    });
    this.subscriptionSubmitButton = this.subscriptionForm.getByRole("button");
    this.subscriptionDescriptionText =
      this.subscriptionForm.getByRole("paragraph");

    // Success message
    this.subscriptionSuccessMessage =
      this.footerWidget.locator("#success-subscribe");
    this.subscriptionSuccessAlert =
      this.subscriptionSuccessMessage.locator(".alert-success");

    // Footer bottom
    this.footerBottom = this.footer.locator(".footer-bottom");
    this.copyrightText = this.footerBottom.getByText(/Copyright/i);
  }

  // ============================================================================
  // INTERACTION METHODS
  // ============================================================================

  async fillSubscriptionEmail(email) {
    await expect(this.subscriptionForm).toBeVisible();
    await expect(this.subscriptionEmailInput).toBeVisible();
    await this.subscriptionEmailInput.clear();
    await this.subscriptionEmailInput.fill(email);
  }

  async clickSubscribe() {
    await expect(this.subscriptionForm).toBeVisible();
    await expect(this.subscriptionSubmitButton).toBeVisible();
    await this.subscriptionSubmitButton.click();
  }

  async subscribeWithEmail(email) {
    await this.fillSubscriptionEmail(email);
    await this.clickSubscribe();
  }

  async scrollToFooter() {
    await this.footer.scrollIntoViewIfNeeded();
  }
}
