import { test, expect } from "../../../fixtures/base.js";

// One test per page region rather than one per element. expect.soft keeps every
// assertion in a region running, so a failure reports all the missing elements
// at once instead of stopping at the first.
test.describe.serial("HomePage - Visibility Tests", { tag: "@smoke" }, () => {
  // ======================================================
  // HEADER SECTION
  // ======================================================
  test(
    "Header shows the logo and full navigation",
    { tag: "@S-HP-02" },
    async ({ headerSection }) => {
      await expect.soft(headerSection.header).toBeVisible();
      await expect.soft(headerSection.logoContainer).toBeVisible();
      await expect.soft(headerSection.logoImage).toBeVisible();
      await expect.soft(headerSection.navMenu).toBeVisible();

      const navLinks = {
        Home: headerSection.homeLink,
        Products: headerSection.productsLink,
        Cart: headerSection.cartLink,
        "Signup / Login": headerSection.loginSignupLink,
        "Test Cases": headerSection.testCasesLink,
        "API Testing": headerSection.apiTestingLink,
        "Video Tutorials": headerSection.videoTutorialsLink,
        "Contact us": headerSection.contactUsLink,
      };

      for (const [name, link] of Object.entries(navLinks)) {
        await expect.soft(link, `nav link "${name}"`).toBeVisible();
      }
    },
  );

  // ======================================================
  // SLIDER SECTION
  // ======================================================
  test(
    "Slider shows carousel controls and call-to-action buttons",
    { tag: "@S-HP-03" },
    async ({ homePage }) => {
      await expect.soft(homePage.sliderSection).toBeVisible();
      await expect.soft(homePage.sliderCarousel).toBeVisible();
      await expect.soft(homePage.sliderPrevButton).toBeVisible();
      await expect.soft(homePage.sliderNextButton).toBeVisible();
      await expect.soft(homePage.sliderTestCasesButton).toBeVisible();
      await expect.soft(homePage.sliderApisButton).toBeVisible();

      expect.soft(await homePage.sliderItems.count()).toBeGreaterThan(0);
    },
  );

  // ======================================================
  // LEFT SIDEBAR - CATEGORIES
  // ======================================================
  test(
    "Sidebar shows the category accordion and its top-level categories",
    { tag: "@S-HP-04" },
    async ({ sidebarSection }) => {
      await expect.soft(sidebarSection.leftSidebar).toBeVisible();
      await expect.soft(sidebarSection.categoryHeading).toBeVisible();
      await expect.soft(sidebarSection.categoryHeading).toHaveText("Category");
      await expect.soft(sidebarSection.categoryAccordion).toBeVisible();

      for (const category of ["Women", "Men", "Kids"]) {
        await expect
          .soft(sidebarSection.categoryLink(category), `category "${category}"`)
          .toBeVisible();
      }
    },
  );

  // ======================================================
  // LEFT SIDEBAR - BRANDS
  // ======================================================
  test(
    "Sidebar shows the brands menu and its brand links",
    { tag: "@S-HP-05" },
    async ({ sidebarSection }) => {
      await expect.soft(sidebarSection.brandsSection).toBeVisible();
      await expect.soft(sidebarSection.brandsHeading).toBeVisible();
      await expect.soft(sidebarSection.brandsHeading).toHaveText("Brands");
      await expect.soft(sidebarSection.brandsMenu).toBeVisible();

      for (const brand of ["Polo", "H&M", "Madame"]) {
        await expect
          .soft(sidebarSection.brandLink(brand), `brand "${brand}"`)
          .toBeVisible();
      }
    },
  );

  // ======================================================
  // FEATURED ITEMS SECTION
  // ======================================================
  test(
    "Features Items shows product cards with image, name, price and hover actions",
    { tag: ["@S-HP-06", "@S-HP-09"] },
    async ({ homePage }) => {
      await expect.soft(homePage.featuresItemsSection).toBeVisible();
      await expect.soft(homePage.featuresItemsHeading).toBeVisible();
      await expect
        .soft(homePage.featuresItemsHeading)
        .toHaveText("Features Items");

      expect.soft(await homePage.productCards.count()).toBeGreaterThan(0);

      const firstProduct = homePage.productCards.first();
      await expect.soft(homePage.productImage(firstProduct)).toBeVisible();
      await expect.soft(homePage.productName(firstProduct)).toBeVisible();
      await expect.soft(homePage.productPrice(firstProduct)).toBeVisible();

      // Add to cart and View Product only render in the hover overlay
      await firstProduct.hover();
      await expect
        .soft(homePage.productAddToCartButton(firstProduct))
        .toBeVisible();
      await expect
        .soft(homePage.productViewProductLink(firstProduct))
        .toBeVisible();
    },
  );

  // ======================================================
  // CART MODAL
  // ======================================================
  test(
    "Cart modal shows all of its elements after adding a product",
    { tag: "@S-HP-13" },
    async ({ homePage }) => {
      const firstProduct = homePage.productCards.first();
      await firstProduct.scrollIntoViewIfNeeded();
      await firstProduct.hover();
      await homePage.productAddToCartButton(firstProduct).click();

      await expect(homePage.cartModal).toBeVisible();

      await expect.soft(homePage.cartModalIcon).toBeVisible();
      await expect.soft(homePage.cartModalTitle).toBeVisible();
      await expect.soft(homePage.cartModalMessage).toBeVisible();
      await expect.soft(homePage.cartModalViewCartLink).toBeVisible();
      await expect.soft(homePage.cartModalContinueButton).toBeVisible();

      // Close it so it cannot block the tests that follow on the shared page
      await homePage.clickCartModalContinue();
    },
  );

  // ======================================================
  // RECOMMENDED ITEMS
  // ======================================================
  test(
    "Recommended Items shows its carousel and items",
    { tag: "@S-HP-07" },
    async ({ homePage }) => {
      await homePage.recommendedItemsSection.scrollIntoViewIfNeeded();

      await expect.soft(homePage.recommendedItemsSection).toBeVisible();
      await expect.soft(homePage.recommendedItemsHeading).toBeVisible();
      await expect.soft(homePage.recommendedCarousel).toBeVisible();

      expect.soft(await homePage.recommendedItems.count()).toBeGreaterThan(0);
    },
  );

  // ======================================================
  // FOOTER SECTION
  // ======================================================
  test(
    "Footer shows the subscription form and copyright",
    { tag: "@S-HP-08" },
    async ({ footerSection }) => {
      await footerSection.scrollToFooter();

      await expect.soft(footerSection.footer).toBeVisible();
      await expect.soft(footerSection.footerWidget).toBeVisible();
      await expect.soft(footerSection.subscriptionSection).toBeVisible();
      await expect.soft(footerSection.subscriptionHeading).toBeVisible();
      await expect.soft(footerSection.subscriptionForm).toBeVisible();
      await expect.soft(footerSection.subscriptionEmailInput).toBeVisible();
      await expect.soft(footerSection.subscriptionSubmitButton).toBeVisible();
      await expect.soft(footerSection.footerBottom).toBeVisible();
      await expect.soft(footerSection.copyrightText).toBeVisible();
    },
  );
});
