import { expect } from "@playwright/test";

export default class LoginSignupPage {
  constructor(page) {
    this.page = page;

    // =========================
    // MAIN FORM SECTION
    // =========================
    this.formSection = this.page.locator("#form");

    // =========================
    // LOGIN FORM
    // =========================
    this.loginFormContainer = this.formSection.locator(".login-form");
    this.loginHeading = this.loginFormContainer.getByRole("heading", {
      name: "Login to your account",
    });
    this.loginForm = this.loginFormContainer.locator("form[action='/login']");

    this.loginEmailInput = this.loginForm.locator(
      "input[data-qa='login-email']",
    );
    this.loginPasswordInput = this.loginForm.locator(
      "input[data-qa='login-password']",
    );
    this.loginButton = this.loginForm.locator("button[data-qa='login-button']");
    this.loginErrorMessage = this.loginFormContainer.locator(
      "p[style*='color: red']",
    );

    // =========================
    // OR SEPARATOR
    // =========================
    this.orSeparator = this.formSection.locator("h2.or");

    // =========================
    // SIGNUP FORM
    // =========================
    this.signupFormContainer = this.formSection.locator(".signup-form");
    this.signupHeading = this.signupFormContainer.getByRole("heading", {
      name: "New User Signup!",
    });
    this.signupForm = this.signupFormContainer.locator(
      "form[action='/signup']",
    );

    this.signupNameInput = this.signupForm.locator(
      "input[data-qa='signup-name']",
    );
    this.signupEmailInput = this.signupForm.locator(
      "input[data-qa='signup-email']",
    );
    this.signupButton = this.signupForm.locator(
      "button[data-qa='signup-button']",
    );
    this.signupErrorMessage = this.signupFormContainer.locator(
      "p[style*='color: red']",
    );
  }

  // =================================================
  // INTERACTION METHODS
  // =================================================

  // ---------- LOGIN ACTIONS ----------
  async fillLoginEmail(email) {
    await this.loginFormContainer.scrollIntoViewIfNeeded();
    await expect(this.loginEmailInput).toBeVisible();
    await this.loginEmailInput.clear();
    await this.loginEmailInput.fill(email);
  }

  async fillLoginPassword(password) {
    await this.loginFormContainer.scrollIntoViewIfNeeded();
    await expect(this.loginPasswordInput).toBeVisible();
    await this.loginPasswordInput.clear();
    await this.loginPasswordInput.fill(password);
  }

  async clickLogin() {
    await this.loginFormContainer.scrollIntoViewIfNeeded();
    await expect(this.loginButton).toBeVisible();
    await this.loginButton.click();
  }

  async login(email, password) {
    await this.fillLoginEmail(email);
    await this.fillLoginPassword(password);
    await this.clickLogin();
  }

  // ---------- SIGNUP ACTIONS ----------
  async fillSignupName(name) {
    await this.signupFormContainer.scrollIntoViewIfNeeded();
    await expect(this.signupNameInput).toBeVisible();
    await this.signupNameInput.clear();
    await this.signupNameInput.fill(name);
  }

  async fillSignupEmail(email) {
    await this.signupFormContainer.scrollIntoViewIfNeeded();
    await expect(this.signupEmailInput).toBeVisible();
    await this.signupEmailInput.clear();
    await this.signupEmailInput.fill(email);
  }

  async clickSignup() {
    await this.signupFormContainer.scrollIntoViewIfNeeded();
    await expect(this.signupButton).toBeVisible();
    await this.signupButton.click();
  }

  async signup(name, email) {
    await this.fillSignupName(name);
    await this.fillSignupEmail(email);
    await this.clickSignup();
  }

  // =================================================
  // VERIFICATION METHODS
  // =================================================

  async verifyLoginErrorMessage(expectedMessage) {
    await expect(this.loginErrorMessage).toBeVisible();
    await expect(this.loginErrorMessage).toHaveText(expectedMessage);
  }

  async verifySignupErrorMessage(expectedMessage) {
    await expect(this.signupErrorMessage).toBeVisible();
    await expect(this.signupErrorMessage).toHaveText(expectedMessage);
  }

  async verifyLoginFormVisible() {
    await expect(this.loginHeading).toBeVisible();
    await expect(this.loginEmailInput).toBeVisible();
    await expect(this.loginPasswordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async verifySignupFormVisible() {
    await expect(this.signupHeading).toBeVisible();
    await expect(this.signupNameInput).toBeVisible();
    await expect(this.signupEmailInput).toBeVisible();
    await expect(this.signupButton).toBeVisible();
  }
}
