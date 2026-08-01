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

    this.loginEmailInput = this.loginForm.getByRole("textbox", {
      name: "Email Address",
    });
    this.loginPasswordInput = this.loginForm.getByRole("textbox", {
      name: "Password",
    });
    this.loginButton = this.loginForm.getByRole("button", { name: "Login" });

    // Error text is a styled <p> with no role or stable text
    this.loginErrorMessage = this.loginFormContainer.locator(
      "p[style*='color: red']",
    );

    // =========================
    // OR SEPARATOR
    // =========================
    this.orSeparator = this.formSection.getByRole("heading", {
      name: "OR",
      exact: true,
    });

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

    this.signupNameInput = this.signupForm.getByRole("textbox", {
      name: "Name",
      exact: true,
    });
    this.signupEmailInput = this.signupForm.getByRole("textbox", {
      name: "Email Address",
    });
    this.signupButton = this.signupForm.getByRole("button", { name: "Signup" });

    // Error text is a styled <p> with no role or stable text
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
