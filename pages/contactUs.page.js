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
    this.nameInput = this.contactForm.getByRole("textbox", {
      name: "Name",
      exact: true,
    });
    this.emailInput = this.contactForm.getByRole("textbox", {
      name: "Email",
      exact: true,
    });
    this.subjectInput = this.contactForm.getByRole("textbox", {
      name: "Subject",
      exact: true,
    });
    this.messageInput = this.contactForm.getByRole("textbox", {
      name: "Your Message Here",
    });

    // File input label is rendered by the browser, so match the field itself
    this.uploadFileInput = this.contactForm.locator(
      "input[name='upload_file']",
    );

    this.submitButton = this.contactForm.getByRole("button", {
      name: "Submit",
    });

    // =========================
    // SUCCESS STATE
    // =========================
    this.successMessage = this.contactForm.locator(".status.alert-success");
    this.homeButton = this.contactForm.getByRole("link", { name: "Home" });
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
