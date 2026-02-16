import { test as base, expect } from "@playwright/test";

// Page Object Imports
import HeaderSection from "../pages/header.page.js";
import FooterSection from "../pages/footer.page.js";
import HomePage from "../pages/home.page.js";
import LoginSignupPage from "../pages/loginRegister.page.js";
import SidebarPage from "../pages/sidebar.page.js";
import ProductsPage from "../pages/product.page.js";
import ProductDetailsPage from "../pages/productDetails.page.js";
import ViewCartPage from "../pages/viewCart.page.js";
import CheckoutPage from "../pages/checkout.page.js";
import RegisterPage from "../pages/register.page.js";
import ContactUsPage from "../pages/contactUs.page.js";
import AccountCreatedPage from "../pages/accountCreated.page.js";
import PaymentPage from "../pages/payment.page.js";
import PaymentDonePage from "../pages/orderConfirmation.page.js";

const BASE_URL = "https://automationexercise.com";

export const test = base.extend({
  // ============================================================================
  // ISOLATED FIXTURES (Test-scoped)
  // Use for: regression, e2e, auth tests - anything that modifies state
  // Each test gets a fresh page and context
  // ============================================================================

  isolatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Block ads and tracking
    await page.route(
      /googleads|googlesyndication|doubleclick|adservice|analytics|facebook.*pixel|ads\./,
      (route) => route.abort(),
    );

    await page.goto(BASE_URL);
    await page.waitForLoadState("domcontentloaded");
    await use(page);
    await context.close();
  },
  header: async ({ isolatedPage }, use) => {
    await use(new HeaderSection(isolatedPage));
  },
  footer: async ({ isolatedPage }, use) => {
    await use(new FooterSection(isolatedPage));
  },
  home: async ({ isolatedPage }, use) => {
    await use(new HomePage(isolatedPage));
  },
  loginPage: async ({ isolatedPage }, use) => {
    await use(new LoginSignupPage(isolatedPage));
  },
  sidebar: async ({ isolatedPage }, use) => {
    await use(new SidebarPage(isolatedPage));
  },
  productsPage: async ({ isolatedPage }, use) => {
    await use(new ProductsPage(isolatedPage));
  },
  productDetailsPage: async ({ isolatedPage }, use) => {
    await use(new ProductDetailsPage(isolatedPage));
  },
  viewCartPage: async ({ isolatedPage }, use) => {
    await use(new ViewCartPage(isolatedPage));
  },
  checkoutPage: async ({ isolatedPage }, use) => {
    await use(new CheckoutPage(isolatedPage));
  },
  paymentPage: async ({ isolatedPage }, use) => {
    await use(new PaymentPage(isolatedPage));
  },
  paymentDonePage: async ({ isolatedPage }, use) => {
    await use(new PaymentDonePage(isolatedPage));
  },
  registerPage: async ({ isolatedPage }, use) => {
    await use(new RegisterPage(isolatedPage));
  },
  contactUsPage: async ({ isolatedPage }, use) => {
    await use(new ContactUsPage(isolatedPage));
  },
  accountCreatedPage: async ({ isolatedPage }, use) => {
    await use(new AccountCreatedPage(isolatedPage));
  },

  // ============================================================================
  // SHARED FIXTURES (Worker-scoped)
  // Use for: smoke tests, visibility tests - read-only checks
  // Same page shared across tests in worker - faster but stateful
  // ============================================================================

  sharedContext: [
    async ({ browser }, use) => {
      const context = await browser.newContext();
      await use(context);
      await context.close();
    },
    { scope: "worker" },
  ],

  sharedPage: [
    async ({ sharedContext }, use) => {
      const page = await sharedContext.newPage();

      // Block ads and tracking
      await page.route(
        /googleads|googlesyndication|doubleclick|adservice|analytics|facebook.*pixel|ads\./,
        (route) => route.abort(),
      );

      await page.goto(BASE_URL);
      await page.waitForLoadState("domcontentloaded");
      await use(page);
      await page.close();
    },
    { scope: "worker" },
  ],

  headerSection: [
    async ({ sharedPage }, use) => {
      await use(new HeaderSection(sharedPage));
    },
    { scope: "worker" },
  ],

  footerSection: [
    async ({ sharedPage }, use) => {
      await use(new FooterSection(sharedPage));
    },
    { scope: "worker" },
  ],

  homePage: [
    async ({ sharedPage }, use) => {
      await use(new HomePage(sharedPage));
    },
    { scope: "worker" },
  ],

  loginSignupPage: [
    async ({ sharedPage }, use) => {
      await use(new LoginSignupPage(sharedPage));
    },
    { scope: "worker" },
  ],

  sidebarSection: [
    async ({ sharedPage }, use) => {
      await use(new SidebarPage(sharedPage));
    },
    { scope: "worker" },
  ],

  productsPageWorker: [
    async ({ sharedPage }, use) => {
      await use(new ProductsPage(sharedPage));
    },
    { scope: "worker" },
  ],

  productDetailsPageWorker: [
    async ({ sharedPage }, use) => {
      await use(new ProductDetailsPage(sharedPage));
    },
    { scope: "worker" },
  ],
});

export { expect };
