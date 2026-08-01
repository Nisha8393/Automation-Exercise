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
    this.titleMr = this.loginFormContainer.getByRole("radio", {
      name: "Mr.",
      exact: true,
    });
    this.titleMrs = this.loginFormContainer.getByRole("radio", {
      name: "Mrs.",
      exact: true,
    });

    // Name / Email / Password (labels end with a "*" marker)
    this.nameInput = this.loginFormContainer.getByRole("textbox", {
      name: "Name *",
      exact: true,
    });
    this.emailInput = this.loginFormContainer.getByRole("textbox", {
      name: "Email *",
      exact: true,
    });
    this.passwordInput = this.loginFormContainer.getByRole("textbox", {
      name: "Password *",
      exact: true,
    });

    // Date of Birth selectors have no label, so they are targeted by id
    this.daySelect = this.loginFormContainer.locator("select#days");
    this.monthSelect = this.loginFormContainer.locator("select#months");
    this.yearSelect = this.loginFormContainer.locator("select#years");

    // Newsletter / Offers Checkboxes
    this.newsletterCheckbox = this.loginFormContainer.getByRole("checkbox", {
      name: "Sign up for our newsletter!",
    });
    this.optinCheckbox = this.loginFormContainer.getByRole("checkbox", {
      name: "Receive special offers from our partners!",
    });

    // =========================
    // ADDRESS SECTION
    // =========================
    this.addressHeading = this.loginFormContainer.getByRole("heading", {
      name: "Address Information",
    });

    this.firstNameInput = this.loginFormContainer.getByRole("textbox", {
      name: "First name *",
      exact: true,
    });
    this.lastNameInput = this.loginFormContainer.getByRole("textbox", {
      name: "Last name *",
      exact: true,
    });
    this.companyInput = this.loginFormContainer.getByRole("textbox", {
      name: "Company",
      exact: true,
    });
    this.address1Input = this.loginFormContainer.getByRole("textbox", {
      name: /^Address \*/,
    });
    this.address2Input = this.loginFormContainer.getByRole("textbox", {
      name: "Address 2",
      exact: true,
    });
    this.countrySelect = this.loginFormContainer.getByRole("combobox", {
      name: /^Country/,
    });
    this.stateInput = this.loginFormContainer.getByRole("textbox", {
      name: "State *",
      exact: true,
    });

    // The site points both City and Zipcode labels at the City input, so the
    // City name swallows "Zipcode *" and the Zipcode field has no name at all
    this.cityInput = this.loginFormContainer.getByRole("textbox", {
      name: /^City \*/,
    });
    this.zipcodeInput = this.loginFormContainer.locator("input#zipcode");

    this.mobileNumberInput = this.loginFormContainer.getByRole("textbox", {
      name: "Mobile Number *",
      exact: true,
    });

    // Submit button
    this.createAccountButton = this.loginFormContainer.getByRole("button", {
      name: "Create Account",
    });
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
