import { expect } from "@playwright/test";

export default class HeaderSection {
  constructor(page) {
    this.page = page;

    // Main header container
    this.header = this.page.locator("#header");

    // Logo section
    this.logoContainer = this.header.locator(".logo");
    this.logoImage = this.logoContainer.locator("img");
    this.logoLink = this.logoContainer.locator("a");

    // Navigation menu
    this.shopMenu = this.header.locator(".shop-menu");
    this.navMenu = this.shopMenu.locator("ul.nav.navbar-nav");

    // Dynamic navigation links
    this.navLink = (linkText) =>
      this.navMenu.getByRole("link", { name: new RegExp(linkText, "i") });

    // Specific navigation links for common use
    this.homeLink = this.navMenu.getByRole("link", { name: /Home/i });
    this.productsLink = this.navMenu.getByRole("link", { name: /Products/i });
    this.cartLink = this.navMenu.getByRole("link", { name: /Cart/i });
    this.loginSignupLink = this.navMenu.getByRole("link", {
      name: /Signup \/ Login/i,
    });
    this.logoutLink = this.navMenu.getByRole("link", { name: /Logout/i });
    this.deleteAccountLink = this.navMenu.getByRole("link", {
      name: /Delete Account/i,
    });
    this.testCasesLink = this.navMenu.getByRole("link", {
      name: /Test Cases/i,
    });
    this.apiTestingLink = this.navMenu.getByRole("link", {
      name: /API Testing/i,
    });
    this.videoTutorialsLink = this.navMenu.getByRole("link", {
      name: /Video Tutorials/i,
    });
    this.contactUsLink = this.navMenu.getByRole("link", {
      name: /Contact us/i,
    });

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
