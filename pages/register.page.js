import { expect } from "@playwright/test";

export default class RegisterPage {
  constructor(page) {
    this.page = page;

    // =========================
    // MAIN FORM SECTION
    // =========================
    this.formSection = this.page.locator("#form");

    // =========================
    // LOGIN / SIGNUP FORM CONTAINER
    // =========================
    this.loginFormContainer = this.formSection.locator(".login-form");

    // =========================
    // ACCOUNT INFO SECTION
    // =========================
    this.accountInfoHeading = this.loginFormContainer.getByRole("heading", {
      name: "Enter Account Information",
    });

    // Title Radio Buttons
    this.titleMr = this.loginFormContainer.locator("input#id_gender1");
    this.titleMrs = this.loginFormContainer.locator("input#id_gender2");

    // Name / Email / Password
    this.nameInput = this.loginFormContainer.locator("input[name='name']");
    this.emailInput = this.loginFormContainer.locator("input[name='email']");
    this.passwordInput = this.loginFormContainer.locator(
      "input[name='password']",
    );

    // Date of Birth Selectors
    this.daySelect = this.loginFormContainer.locator("select#days");
    this.monthSelect = this.loginFormContainer.locator("select#months");
    this.yearSelect = this.loginFormContainer.locator("select#years");

    // Newsletter / Offers Checkboxes
    this.newsletterCheckbox =
      this.loginFormContainer.locator("input#newsletter");
    this.optinCheckbox = this.loginFormContainer.locator("input#optin");

    // =========================
    // ADDRESS SECTION
    // =========================
    this.addressHeading = this.loginFormContainer.getByRole("heading", {
      name: "Address Information",
    });

    this.firstNameInput = this.loginFormContainer.locator("input#first_name");
    this.lastNameInput = this.loginFormContainer.locator("input#last_name");
    this.companyInput = this.loginFormContainer.locator("input#company");
    this.address1Input = this.loginFormContainer.locator("input#address1");
    this.address2Input = this.loginFormContainer.locator("input#address2");
    this.countrySelect = this.loginFormContainer.locator("select#country");
    this.stateInput = this.loginFormContainer.locator("input#state");
    this.cityInput = this.loginFormContainer.locator("input#city");
    this.zipcodeInput = this.loginFormContainer.locator("input#zipcode");
    this.mobileNumberInput = this.loginFormContainer.locator(
      "input#mobile_number",
    );

    // Submit button
    this.createAccountButton = this.loginFormContainer.locator(
      "button[data-qa='create-account']",
    );
  }

  // =================================================
  // INTERACTION METHODS
  // =================================================

  async selectTitle(title = "Mr") {
    if (title === "Mr") await this.titleMr.check();
    else if (title === "Mrs") await this.titleMrs.check();
  }

  async fillAccountInfo({ name, password, day, month, year }) {
    await this.nameInput.fill(name);
    await this.passwordInput.fill(password);
    if (day) await this.daySelect.selectOption(day.toString());
    if (month) await this.monthSelect.selectOption(month.toString());
    if (year) await this.yearSelect.selectOption(year.toString());
  }

  async setNewsletterOptin({ newsletter = false, optin = false }) {
    if (newsletter) await this.newsletterCheckbox.check();
    if (optin) await this.optinCheckbox.check();
  }

  async fillAddressInfo({
    firstName,
    lastName,
    company,
    address1,
    address2,
    country,
    state,
    city,
    zipcode,
    mobileNumber,
  }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    if (company) await this.companyInput.fill(company);
    await this.address1Input.fill(address1);
    if (address2) await this.address2Input.fill(address2);
    if (country) await this.countrySelect.selectOption(country);
    await this.stateInput.fill(state);
    await this.cityInput.fill(city);
    await this.zipcodeInput.fill(zipcode);
    await this.mobileNumberInput.fill(mobileNumber);
  }

  async clickCreateAccount() {
    await this.createAccountButton.click();
  }
}
