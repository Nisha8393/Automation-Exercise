import { test, expect } from "../../../fixtures/base.js";

const PRODUCT_A = "Blue Top";
const PRODUCT_B = "Men Tshirt";

test.describe("Add to Cart", () => {
  // ============================================================================
  // ADD FROM DIFFERENT PAGES
  // ============================================================================

  test("Add product from product detail page - Product appears in cart", async ({
    header,
    productsPage,
    productDetailsPage,
    viewCartPage,
    isolatedPage,
  }) => {
    await header.clickProducts();

    // Navigate to first product detail
    const firstProduct = productsPage.productCards.first();
    await firstProduct.scrollIntoViewIfNeeded();
    await firstProduct.hover();
    const viewLink = productsPage.productViewProductLink(firstProduct);
    await viewLink.click();

    // Get the product name before adding
    const expectedName = await productDetailsPage.getProductName();

    // Add to cart from detail page
    await productDetailsPage.clickAddToCart();
    await expect(productDetailsPage.cartModal).toBeVisible();
    await productDetailsPage.clickCartModalViewCart();

    // Verify the correct product is in the cart
    await expect(isolatedPage).toHaveURL(/view_cart/);
    const productIds = await viewCartPage.getAllProductIds();
    await viewCartPage.verifyCartItemsCount(1);
    await viewCartPage.verifyProductName(productIds[0], expectedName);
  });

  test("Add product from homepage - Product appears in cart", async ({
    home,
    viewCartPage,
    isolatedPage,
  }) => {
    await home.addProductToCart(PRODUCT_A);
    await expect(home.cartModal).toBeVisible();
    await home.clickCartModalViewCart();

    // Verify the correct product is in the cart
    await expect(isolatedPage).toHaveURL(/view_cart/);
    const productIds = await viewCartPage.getAllProductIds();
    await viewCartPage.verifyCartItemsCount(1);
    await viewCartPage.verifyProductName(productIds[0], PRODUCT_A);
  });

  test("Add product from recommended items - Product appears in cart", async ({
    home,
    viewCartPage,
    isolatedPage,
  }) => {
    await home.recommendedItemsSection.scrollIntoViewIfNeeded();
    await expect(home.recommendedItemsHeading).toBeVisible();

    // Get the recommended product name before adding
    const firstRecommended = home.recommendedItems.first();
    await expect(firstRecommended).toBeVisible();
    const expectedName = (
      await home.productName(firstRecommended).textContent()
    ).trim();

    const addBtn = home.recommendedProductAddToCartButton(firstRecommended);
    await addBtn.click();

    await expect(home.cartModal).toBeVisible();
    await home.clickCartModalViewCart();

    // Verify the correct product is in the cart
    await expect(isolatedPage).toHaveURL(/view_cart/);
    const productIds = await viewCartPage.getAllProductIds();
    await viewCartPage.verifyCartItemsCount(1);
    await viewCartPage.verifyProductName(productIds[0], expectedName);
  });

  // ============================================================================
  // MULTIPLE PRODUCTS
  // ============================================================================

  test("Add multiple different products - Both appear in cart", async ({
    home,
    viewCartPage,
    isolatedPage,
  }) => {
    // Add first product
    await home.addProductToCart(PRODUCT_A);
    await expect(home.cartModal).toBeVisible();
    await home.clickCartModalContinue();

    // Add second product
    await home.addProductToCart(PRODUCT_B);
    await expect(home.cartModal).toBeVisible();
    await home.clickCartModalViewCart();

    // Verify cart has 2 items with correct names
    await expect(isolatedPage).toHaveURL(/view_cart/);
    await viewCartPage.verifyCartItemsCount(2);
    await viewCartPage.verifyCartContainsProducts([PRODUCT_A, PRODUCT_B]);
  });

  test("Add same product twice - Quantity shows 2", async ({
    home,
    viewCartPage,
    isolatedPage,
  }) => {
    // Add product first time
    await home.addProductToCart(PRODUCT_A);
    await expect(home.cartModal).toBeVisible();
    await home.clickCartModalContinue();

    // Add same product again
    await home.addProductToCart(PRODUCT_A);
    await expect(home.cartModal).toBeVisible();
    await home.clickCartModalViewCart();

    // Verify correct product with quantity 2
    await expect(isolatedPage).toHaveURL(/view_cart/);
    const productIds = await viewCartPage.getAllProductIds();
    await viewCartPage.verifyCartItemsCount(1);
    await viewCartPage.verifyProductName(productIds[0], PRODUCT_A);
    await viewCartPage.verifyProductQuantity(productIds[0], "2");
  });
});
