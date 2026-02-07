import { test, expect } from "../../../fixtures/base.js";

test.describe.serial("HomePage - Visibility Tests", () => {
  // ======================================================
  // HEADER SECTION
  // ======================================================
  test.describe("Header Section", () => {
    test("should display header", async ({ headerSection }) => {
      await expect(headerSection.header).toBeVisible();
    });

    test("should display logo container", async ({ headerSection }) => {
      await expect(headerSection.logoContainer).toBeVisible();
    });

    test("should display logo image", async ({ headerSection }) => {
      await expect(headerSection.logoImage).toBeVisible();
    });

    test("should display navigation menu", async ({ headerSection }) => {
      await expect(headerSection.navMenu).toBeVisible();
    });

    test("should display Home link", async ({ headerSection }) => {
      await expect(headerSection.homeLink).toBeVisible();
    });

    test("should display Products link", async ({ headerSection }) => {
      await expect(headerSection.productsLink).toBeVisible();
    });

    test("should display Cart link", async ({ headerSection }) => {
      await expect(headerSection.cartLink).toBeVisible();
    });

    test("should display Signup / Login link", async ({ headerSection }) => {
      await expect(headerSection.loginSignupLink).toBeVisible();
    });

    test("should display Test Cases link", async ({ headerSection }) => {
      await expect(headerSection.testCasesLink).toBeVisible();
    });

    test("should display API Testing link", async ({ headerSection }) => {
      await expect(headerSection.apiTestingLink).toBeVisible();
    });

    test("should display Video Tutorials link", async ({ headerSection }) => {
      await expect(headerSection.videoTutorialsLink).toBeVisible();
    });

    test("should display Contact Us link", async ({ headerSection }) => {
      await expect(headerSection.contactUsLink).toBeVisible();
    });
  });

  // ======================================================
  // SLIDER SECTION
  // ======================================================
  test.describe("Slider Section", () => {
    test("should display slider", async ({ homePage }) => {
      await expect(homePage.sliderSection).toBeVisible();
      await expect(homePage.sliderCarousel).toBeVisible();
      await expect(homePage.sliderPrevButton).toBeVisible();
      await expect(homePage.sliderNextButton).toBeVisible();

      const itemCount = await homePage.sliderItems.count();
      expect(itemCount).toBeGreaterThan(0);
    });

    test("should display Test Cases button", async ({ homePage }) => {
      await expect(homePage.sliderTestCasesButton).toBeVisible();
    });

    test("should display APIs button", async ({ homePage }) => {
      await expect(homePage.sliderApisButton).toBeVisible();
    });
  });

  // ======================================================
  // LEFT SIDEBAR - CATEGORIES
  // ======================================================
  test.describe("Left Sidebar - Categories", () => {
    test("should display left sidebar", async ({ sidebarSection }) => {
      await expect(sidebarSection.leftSidebar).toBeVisible();
    });

    test("should display Category heading", async ({ sidebarSection }) => {
      await expect(sidebarSection.categoryHeading).toBeVisible();
      await expect(sidebarSection.categoryHeading).toHaveText("Category");
    });

    test("should display category accordion", async ({ sidebarSection }) => {
      await expect(sidebarSection.categoryAccordion).toBeVisible();
    });

    test("should display Women category link", async ({ sidebarSection }) => {
      const womenCategory = sidebarSection.categoryLink("Women");
      await expect(womenCategory).toBeVisible();
    });

    test("should display Men category link", async ({ sidebarSection }) => {
      const menCategory = sidebarSection.categoryLink("Men");
      await expect(menCategory).toBeVisible();
    });

    test("should display Kids category link", async ({ sidebarSection }) => {
      const kidsCategory = sidebarSection.categoryLink("Kids");
      await expect(kidsCategory).toBeVisible();
    });
  });

  // ======================================================
  // LEFT SIDEBAR - BRANDS
  // ======================================================
  test.describe("Left Sidebar - Brands", () => {
    test("should display brands section", async ({ sidebarSection }) => {
      await expect(sidebarSection.brandsSection).toBeVisible();
    });

    test("should display Brands heading", async ({ sidebarSection }) => {
      await expect(sidebarSection.brandsHeading).toBeVisible();
      await expect(sidebarSection.brandsHeading).toHaveText("Brands");
    });

    test("should display brands menu", async ({ sidebarSection }) => {
      await expect(sidebarSection.brandsMenu).toBeVisible();
    });

    test("should display Polo brand link", async ({ sidebarSection }) => {
      const poloBrand = sidebarSection.brandLink("Polo");
      await expect(poloBrand).toBeVisible();
    });

    test("should display H&M brand link", async ({ sidebarSection }) => {
      const hmBrand = sidebarSection.brandLink("H&M");
      await expect(hmBrand).toBeVisible();
    });

    test("should display Madame brand link", async ({ sidebarSection }) => {
      const madameBrand = sidebarSection.brandLink("Madame");
      await expect(madameBrand).toBeVisible();
    });
  });

  // ======================================================
  // FEATURED ITEMS SECTION
  // ======================================================
  test.describe("Features Items Section", () => {
    test("should display features items section", async ({ homePage }) => {
      await expect(homePage.featuresItemsSection).toBeVisible();
    });

    test("should display Features Items heading", async ({ homePage }) => {
      await expect(homePage.featuresItemsHeading).toBeVisible();
      await expect(homePage.featuresItemsHeading).toHaveText("Features Items");
    });

    test("should display multiple product cards", async ({ homePage }) => {
      const count = await homePage.productCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should display product images", async ({ homePage }) => {
      const firstProduct = homePage.productCards.first();
      const productImage = homePage.productImage(firstProduct);
      await expect(productImage).toBeVisible();
    });

    test("should display product prices", async ({ homePage }) => {
      const firstProduct = homePage.productCards.first();
      const productPrice = homePage.productPrice(firstProduct);
      await expect(productPrice).toBeVisible();
    });

    test("should display product names", async ({ homePage }) => {
      const firstProduct = homePage.productCards.first();
      const productName = homePage.productName(firstProduct);
      await expect(productName).toBeVisible();
    });

    test("should display add to cart buttons", async ({ homePage }) => {
      const firstProduct = homePage.productCards.first();
      await firstProduct.hover();
      const addToCartBtn = homePage.productAddToCartButton(firstProduct);
      await expect(addToCartBtn).toBeVisible();
    });

    test("should display view product links", async ({ homePage }) => {
      const firstProduct = homePage.productCards.first();
      await firstProduct.hover();
      const viewProductLink = homePage.productViewProductLink(firstProduct);
      await expect(viewProductLink).toBeVisible();
    });
  });

  // ======================================================
  // CART MODAL
  // ======================================================
  test.describe("Cart Modal", () => {
    test("should display cart modal and its elements after adding a product", async ({
      homePage,
    }) => {
      // Add first product to cart
      const firstProduct = homePage.productCards.first();
      await firstProduct.scrollIntoViewIfNeeded();
      await firstProduct.hover();
      const addToCartBtn = homePage.productAddToCartButton(firstProduct);
      await addToCartBtn.click();

      // Check cart modal visibility
      await expect(homePage.cartModal).toBeVisible();

      // Check all modal elements
      await expect(homePage.cartModalIcon).toBeVisible();
      await expect(homePage.cartModalTitle).toBeVisible();
      await expect(homePage.cartModalMessage).toBeVisible();
      await expect(homePage.cartModalViewCartLink).toBeVisible();
      await expect(homePage.cartModalContinueButton).toBeVisible();

      // Close modal to prevent it blocking other tests
      await homePage.clickCartModalContinue();
    });
  });

  // ======================================================
  // RECOMMENDED ITEMS
  // ======================================================
  test.describe("Recommended Items Section", () => {
    test("should display recommended items section", async ({ homePage }) => {
      await homePage.recommendedItemsSection.scrollIntoViewIfNeeded();
      await expect(homePage.recommendedItemsSection).toBeVisible();
    });

    test("should display Recommended Items heading", async ({ homePage }) => {
      await homePage.recommendedItemsSection.scrollIntoViewIfNeeded();
      await expect(homePage.recommendedItemsHeading).toBeVisible();
    });

    test("should display recommended carousel", async ({ homePage }) => {
      await homePage.recommendedItemsSection.scrollIntoViewIfNeeded();
      await expect(homePage.recommendedCarousel).toBeVisible();
    });

    test("should display recommended items", async ({ homePage }) => {
      await homePage.recommendedItemsSection.scrollIntoViewIfNeeded();
      const count = await homePage.recommendedItems.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  // ======================================================
  // FOOTER SECTION
  // ======================================================
  test.describe("Footer Section", () => {
    test("should display footer", async ({ footerSection }) => {
      await footerSection.scrollToFooter();
      await expect(footerSection.footer).toBeVisible();
    });

    test("should display footer widget", async ({ footerSection }) => {
      await footerSection.scrollToFooter();
      await expect(footerSection.footerWidget).toBeVisible();
    });

    test("should display subscription section", async ({ footerSection }) => {
      await footerSection.scrollToFooter();
      await expect(footerSection.subscriptionSection).toBeVisible();
    });

    test("should display Subscription heading", async ({ footerSection }) => {
      await footerSection.scrollToFooter();
      await expect(footerSection.subscriptionHeading).toBeVisible();
    });

    test("should display subscription form", async ({ footerSection }) => {
      await footerSection.scrollToFooter();
      await expect(footerSection.subscriptionForm).toBeVisible();
    });

    test("should display subscription email input", async ({
      footerSection,
    }) => {
      await footerSection.scrollToFooter();
      await expect(footerSection.subscriptionEmailInput).toBeVisible();
    });

    test("should display subscription submit button", async ({
      footerSection,
    }) => {
      await footerSection.scrollToFooter();
      await expect(footerSection.subscriptionSubmitButton).toBeVisible();
    });

    test("should display footer bottom", async ({ footerSection }) => {
      await footerSection.scrollToFooter();
      await expect(footerSection.footerBottom).toBeVisible();
    });

    test("should display copyright text", async ({ footerSection }) => {
      await footerSection.scrollToFooter();
      await expect(footerSection.copyrightText).toBeVisible();
    });
  });
});
