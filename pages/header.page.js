import { expect } from "@playwright/test";

export default class HeaderSection {
  constructor(page) {
    this.page = page;

    // Main header container
    this.header = this.page.getByRole("banner");

    // Logo section (alt text changes when logged in, so scope by class)
    this.logoContainer = this.header.locator(".logo");
    this.logoImage = this.logoContainer.getByRole("img");
    this.logoLink = this.logoContainer.getByRole("link");

    // Navigation menu
    this.navMenu = this.header.getByRole("list");

    // Dynamic navigation links
    this.navLink = (linkText) =>
      this.navMenu.getByRole("link", { name: linkText });

    // Specific navigation links for common use
    this.homeLink = this.navLink("Home");
    this.productsLink = this.navLink("Products");
    this.cartLink = this.navLink("Cart");
    this.loginSignupLink = this.navLink("Signup / Login");
    this.logoutLink = this.navLink("Logout");
    this.deleteAccountLink = this.navLink("Delete Account");
    this.testCasesLink = this.navLink("Test Cases");
    this.apiTestingLink = this.navLink("API Testing");
    this.videoTutorialsLink = this.navLink("Video Tutorials");
    this.contactUsLink = this.navLink("Contact us");

    // Logged in user text
    this.loggedInUserText = (username) =>
      this.navMenu.getByText(new RegExp(`Logged in as.*${username}`, "i"));
  }

  // ============================================================================
  // INTERACTION METHODS
  // ============================================================================

  async clickLogo() {
    await expect(this.header).toBeVisible();
    await expect(this.logoLink).toBeVisible();
    await this.logoLink.click();
  }

  async clickHome() {
    await expect(this.header).toBeVisible();
    await expect(this.homeLink).toBeVisible();
    await this.homeLink.click();
  }

  async clickProducts() {
    await expect(this.header).toBeVisible();
    await expect(this.productsLink).toBeVisible();
    await this.productsLink.click();
  }

  async clickCart() {
    await expect(this.header).toBeVisible();
    await expect(this.cartLink).toBeVisible();
    await this.cartLink.click();
  }

  async clickLoginSignup() {
    await expect(this.header).toBeVisible();
    await expect(this.loginSignupLink).toBeVisible();
    await this.loginSignupLink.click();
  }

  async clickLogout() {
    await expect(this.header).toBeVisible();
    await expect(this.logoutLink).toBeVisible();
    await this.logoutLink.click();
  }

  async clickDeleteAccount() {
    await expect(this.header).toBeVisible();
    await expect(this.deleteAccountLink).toBeVisible();
    await this.deleteAccountLink.click();
  }

  async clickTestCases() {
    await expect(this.header).toBeVisible();
    await expect(this.testCasesLink).toBeVisible();
    await this.testCasesLink.click();
  }

  async clickApiTesting() {
    await expect(this.header).toBeVisible();
    await expect(this.apiTestingLink).toBeVisible();
    await this.apiTestingLink.click();
  }

  async clickVideoTutorials() {
    await expect(this.header).toBeVisible();
    await expect(this.videoTutorialsLink).toBeVisible();
    await this.videoTutorialsLink.click();
  }

  async clickContactUs() {
    await expect(this.header).toBeVisible();
    await expect(this.contactUsLink).toBeVisible();
    await this.contactUsLink.click();
  }

  async clickNavLink(linkText) {
    await expect(this.header).toBeVisible();
    const link = this.navLink(linkText);
    await expect(link).toBeVisible();
    await link.click();
  }
}
