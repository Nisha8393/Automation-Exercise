import { test, expect } from "../../../fixtures/base.js";

const PRODUCT_NAME = "Stylish Dress";
const PARTIAL_PRODUCT_NAME = "dre";
const INVALID_PRODUCT_NAME = "xyz123";

test.describe("Products Page", () => {
  test.beforeEach(async ({ header }) => {
    await header.clickProducts();
  });

  // ============================================================================
  // SEARCH TESTS
  // ============================================================================

  test.describe("Search Functionality", () => {
    test("Search with valid keyword - Related products shown", async ({
      productsPage,
    }) => {
      await productsPage.searchProduct(PRODUCT_NAME);

      const product = productsPage.productCard(PRODUCT_NAME);
      await expect(product).toBeVisible();
      await productsPage.verifyProductCardDetails(product);
    });

    test("Search with partial keyword - Related products are shown", async ({
      productsPage,
    }) => {
      await productsPage.searchProduct(PARTIAL_PRODUCT_NAME);

      const count = await productsPage.getProductCardsCount();
      expect(count).toBeGreaterThan(0);

      // Verify at least one product contains the search term
      const allNames = await productsPage.productCards
        .locator("p")
        .allTextContents();

      const hasMatchingProduct = allNames.some((name) =>
        name.toLowerCase().includes(PARTIAL_PRODUCT_NAME.toLowerCase()),
      );
      expect(hasMatchingProduct).toBe(true);

      // UI check on first product
      const firstProduct = productsPage.productCards.first();
      await productsPage.verifyProductCardDetails(firstProduct);
    });

    test("Search with invalid keyword - No matching products found", async ({
      productsPage,
    }) => {
      await productsPage.searchProduct(INVALID_PRODUCT_NAME);

      // Website shows products but none should match the invalid keyword
      const allNames = await productsPage.getAllProductNamesText();
      const hasMatch = allNames.some((name) =>
        name.toLowerCase().includes(INVALID_PRODUCT_NAME.toLowerCase()),
      );
      expect(hasMatch).toBe(false);
    });

    test("Search with empty keyword - All products remain visible", async ({
      productsPage,
    }) => {
      const initialCount = await productsPage.getProductCardsCount();

      await productsPage.searchProduct("");

      await expect(productsPage.productCards).toHaveCount(initialCount);

      // Check first product is visible
      await expect(productsPage.productCards.first()).toBeVisible();
    });

    test("Search case insensitivity - Same related products shown", async ({
      productsPage,
    }) => {
      await productsPage.searchProduct(PRODUCT_NAME.toUpperCase());

      const product = productsPage.productCard(PRODUCT_NAME);
      await expect(product).toBeVisible();
      await productsPage.verifyProductCardDetails(product);
    });
  });

  // ============================================================================
  // Products List
  // ============================================================================

  test.describe("Products List", () => {
    test("Verify all products page - Products list visible", async ({
      productsPage,
      isolatedPage,
    }) => {
      await expect(isolatedPage).toHaveURL(/products/);
      await expect(productsPage.allProductsHeading).toBeVisible();
      await expect(productsPage.featuresItemsSection).toBeVisible();

      const count = await productsPage.getProductCardsCount();
      expect(count).toBeGreaterThan(0);
    });

    test("Verify product card details - Image, name, price visible", async ({
      productsPage,
    }) => {
      const firstProduct = productsPage.productCards.first();
      await expect(firstProduct).toBeVisible();
      await productsPage.verifyProductCardDetails(firstProduct);
    });

    test("Verify sidebar is visible on products page", async ({ sidebar }) => {
      await sidebar.verifySidebarVisible();
    });

    test("Navigate to product detail - Detail page opens", async ({
      productsPage,
      isolatedPage,
    }) => {
      const firstProduct = productsPage.productCards.first();
      await firstProduct.scrollIntoViewIfNeeded();
      await firstProduct.hover();

      const viewLink = productsPage.productViewProductLink(firstProduct);
      await expect(viewLink).toBeVisible();
      await viewLink.click();

      await expect(isolatedPage).toHaveURL(/product_details/);
    });
  });

  // ============================================================================
  // ADD TO CART TESTS
  // ============================================================================

  test.describe("Add to Cart", () => {
    test("Add product from products page - Product Added modal", async ({
      productsPage,
    }) => {
      await productsPage.searchProduct(PRODUCT_NAME);
      await productsPage.addProductToCart(PRODUCT_NAME);

      await productsPage.verifyCartModalShown();
    });

    test("Continue shopping after adding to cart - Cart modal closes", async ({
      productsPage,
    }) => {
      await productsPage.searchProduct(PRODUCT_NAME);
      await productsPage.addProductToCart(PRODUCT_NAME);

      await productsPage.verifyCartModalShown();
      await productsPage.clickCartModalContinue();

      await expect(productsPage.cartModal).not.toBeVisible();
    });

    test("should navigate to cart after adding product", async ({
      productsPage,
      isolatedPage,
    }) => {
      await productsPage.searchProduct(PRODUCT_NAME);
      await productsPage.addProductToCart(PRODUCT_NAME);

      await productsPage.verifyCartModalShown();
      await productsPage.clickCartModalViewCart();

      await expect(isolatedPage).toHaveURL(/view_cart/);
    });
  });
});
