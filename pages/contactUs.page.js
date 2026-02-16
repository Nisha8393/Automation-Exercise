import { expect } from "@playwright/test";

export default class ContactUsPage {
  constructor(page) {
    this.page = page;

    // =========================
    // MAIN FORM SECTION
    // =========================
    this.contactForm = this.page.locator("div.contact-form");
    this.getInTouchHeading = this.contactForm.getByRole("heading", {
      name: "Get In Touch",
    });

    // =========================
    // FORM INPUTS
    // =========================
    this.nameInput = this.contactForm.locator("input[data-qa='name']");
    this.emailInput = this.contactForm.locator("input[data-qa='email']");
    this.subjectInput = this.contactForm.locator("input[data-qa='subject']");
    this.messageInput = this.contactForm.locator("textarea#message");
    this.uploadFileInput = this.contactForm.locator(
      "input[name='upload_file']",
    );
    this.submitButton = this.contactForm.locator(
      "input[data-qa='submit-button']",
    );

    // =========================
    // SUCCESS STATE
    // =========================
    this.successMessage = this.contactForm.locator(".status.alert-success");
    this.homeButton = this.contactForm.locator("a.btn-success");
  }

  // =================================================
  // INTERACTION METHODS
  // =================================================

  async fillContactForm(name, email, subject, message) {
    await this.contactForm.scrollIntoViewIfNeeded();
    await expect(this.nameInput).toBeVisible();
    await this.nameInput.fill(name);
    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(email);
    await expect(this.subjectInput).toBeVisible();
    await this.subjectInput.fill(subject);
    await expect(this.messageInput).toBeVisible();
    await this.messageInput.fill(message);
  }

  async uploadFile(filePath) {
    await this.uploadFileInput.setInputFiles(filePath);
  }

  async clickSubmit() {
    // Ensure jQuery submit handler is attached before clicking
    await this.page.waitForLoadState("load");
    await expect(this.submitButton).toBeVisible();
    await this.submitButton.click();
  }

  async submitContactForm(name, email, subject, message) {
    await this.fillContactForm(name, email, subject, message);
    await this.clickSubmit();
  }

  async clickHome() {
    await expect(this.homeButton).toBeVisible();
    await this.homeButton.click();
  }
}
