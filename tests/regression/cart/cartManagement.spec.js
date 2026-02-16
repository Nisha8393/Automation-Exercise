import { test, expect } from "../../../fixtures/base.js";

const PRODUCT_A = "Blue Top";
const PRODUCT_B = "Men Tshirt";

test.describe("Cart Management", () => {
  // ============================================================================
  // QUANTITY AND PRICE TESTS
  // ============================================================================

  test("Add product with quantity > 1 - Cart shows correct quantity", async ({
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

    // Set quantity to 4 and add
    await productDetailsPage.addToCartWithQuantity(4);
    await expect(productDetailsPage.cartModal).toBeVisible({ timeout: 30000 });
    await productDetailsPage.clickCartModalViewCart();

    // Verify correct product with correct quantity in cart
    await expect(isolatedPage).toHaveURL(/view_cart/);
    const productIds = await viewCartPage.getAllProductIds();
    await viewCartPage.verifyCartItemsCount(1);
    await viewCartPage.verifyProductName(productIds[0], expectedName);
    await viewCartPage.verifyProductQuantity(productIds[0], "4");
  });

  test("Verify total price calculation - Total equals price x quantity", async ({
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

    // Get the price before adding
    const priceText = await productDetailsPage.getProductPrice();
    const unitPrice = parseInt(priceText.replace(/[^\d]/g, ""), 10);

    // Set quantity to 3 and add
    await productDetailsPage.addToCartWithQuantity(3);
    await expect(productDetailsPage.cartModal).toBeVisible();
    await productDetailsPage.clickCartModalViewCart();

    // Verify total in cart
    await expect(isolatedPage).toHaveURL(/view_cart/);
    const productIds = await viewCartPage.getAllProductIds();
    await viewCartPage.verifyProductTotalPrice(productIds[0], unitPrice * 3);
  });

  test("Verify cart subtotal - Each product total is correct", async ({
    home,
    viewCartPage,
    isolatedPage,
  }) => {
    // Add two different products
    await home.addProductToCart(PRODUCT_A);
    await expect(home.cartModal).toBeVisible();
    await home.clickCartModalContinue();

    await home.addProductToCart(PRODUCT_B);
    await expect(home.cartModal).toBeVisible();
    await home.clickCartModalViewCart();

    await expect(isolatedPage).toHaveURL(/view_cart/);

    // Verify both products are in cart with correct names and totals
    await viewCartPage.verifyCartItemsCount(2);
    await viewCartPage.verifyCartContainsProducts([PRODUCT_A, PRODUCT_B]);

    const productIds = await viewCartPage.getAllProductIds();
    for (const id of productIds) {
      const priceText = await viewCartPage.getProductPriceByProductId(id);
      const expectedTotal = parseInt(priceText.replace(/[^\d]/g, ""), 10);
      await viewCartPage.verifyProductTotalPrice(id, expectedTotal);
    }
  });

  // ============================================================================
  // CHECKOUT WITHOUT LOGIN
  // ============================================================================

  test("Proceed to checkout without login - Shows Register/Login modal", async ({
    home,
    viewCartPage,
  }) => {
    await home.addProductToCart(PRODUCT_A);
    await expect(home.cartModal).toBeVisible();
    await home.clickCartModalViewCart();

    await viewCartPage.clickProceedToCheckout();

    // Verify modal content and Register/Login link
    await viewCartPage.verifyCheckoutModal();
  });

  // ============================================================================
  // REMOVE PRODUCT TESTS
  // ============================================================================

  test("Remove single product - Product removed from cart", async ({
    home,
    viewCartPage,
    isolatedPage,
  }) => {
    // Add a product
    await home.addProductToCart(PRODUCT_A);
    await expect(home.cartModal).toBeVisible();
    await home.clickCartModalViewCart();

    await expect(isolatedPage).toHaveURL(/view_cart/);
    await viewCartPage.verifyCartItemsCount(1);

    // Remove the product and wait for server to process
    const productIds = await viewCartPage.getAllProductIds();
    const deleteResponse = isolatedPage.waitForResponse(
      (resp) => resp.url().includes("delete_cart"),
      { timeout: 15000 },
    );
    await viewCartPage.clickProductDeleteByProductId(productIds[0]);
    await deleteResponse;
    await isolatedPage.waitForLoadState("domcontentloaded");
    const row = viewCartPage.productRow(productIds[0]);
    await expect(row).toHaveCount(0, { timeout: 10000 });
  });

  test("Remove all products - Cart is empty", async ({
    home,
    viewCartPage,
    isolatedPage,
  }) => {
    // Add two products
    await home.addProductToCart(PRODUCT_A);
    await expect(home.cartModal).toBeVisible();
    await home.clickCartModalContinue();

    await home.addProductToCart(PRODUCT_B);
    await expect(home.cartModal).toBeVisible();
    await home.clickCartModalViewCart();

    await expect(isolatedPage).toHaveURL(/view_cart/);

    // Remove all products one at a time, waiting for page update after each
    const productIds = await viewCartPage.getAllProductIds();
    for (const id of productIds) {
      const deleteResponse = isolatedPage.waitForResponse(
        (resp) => resp.url().includes("delete_cart"),
        { timeout: 15000 },
      );
      await viewCartPage.clickProductDeleteByProductId(id);
      await deleteResponse;
      await isolatedPage.waitForLoadState("domcontentloaded");
    }

    // Verify cart is empty
    const isEmpty = await viewCartPage.isCartEmpty();
    expect(isEmpty).toBe(true);
  });

  test("Verify empty cart state - Shows empty message and link", async ({
    home,
    viewCartPage,
    isolatedPage,
  }) => {
    // Add and immediately remove a product
    await home.addProductToCart(PRODUCT_A);
    await expect(home.cartModal).toBeVisible();
    await home.clickCartModalViewCart();

    await expect(isolatedPage).toHaveURL(/view_cart/);
    const productIds = await viewCartPage.getAllProductIds();
    const deleteResponse = isolatedPage.waitForResponse(
      (resp) => resp.url().includes("delete_cart"),
      { timeout: 15000 },
    );
    await viewCartPage.clickProductDeleteByProductId(productIds[0]);
    await deleteResponse;
    await isolatedPage.waitForLoadState("domcontentloaded");

    // Verify empty cart message and "here" link
    await viewCartPage.verifyEmptyCartState();
  });
});
