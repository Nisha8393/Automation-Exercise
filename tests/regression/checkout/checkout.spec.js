import { test, expect } from "../../../fixtures/base.js";
import { loginTestData } from "../../../utils/testData/auth.data.js";
import { expectedAddress } from "../../../utils/testData/checkout.data.js";

const PRODUCT_NAME = "Blue Top";

test.describe("Checkout Tests", () => {
  test.beforeEach(async ({ header, loginPage }) => {
    // Login first
    await header.clickLoginSignup();
    const { email, password } = loginTestData.valid;
    await loginPage.login(email, password);
    await expect(header.loggedInUserText(loginTestData.valid.name)).toBeVisible();
  });

  // ============================================================================
  // ADDRESS VERIFICATION TESTS
  // ============================================================================

  test.describe("Address Verification", () => {
    test.beforeEach(async ({ header, home, viewCartPage }) => {
      // Add product and go to checkout
      await header.clickHome();
      await home.addProductToCart(PRODUCT_NAME);
      await expect(home.cartModal).toBeVisible({ timeout: 30000 });
      await home.clickCartModalViewCart();
      await viewCartPage.clickProceedToCheckout();
    });

    test("Verify delivery address - Matches registered address", async ({
      checkoutPage,
    }) => {
      await checkoutPage.verifyDeliveryAddress(expectedAddress);
    });

    test("Verify billing address - Matches registered address", async ({
      checkoutPage,
    }) => {
      await checkoutPage.verifyBillingAddress(expectedAddress);
    });

    test("Verify address format - All address fields shown", async ({
      checkoutPage,
    }) => {
      await checkoutPage.verifyAddressFieldsVisible();
    });
  });

  // ============================================================================
  // ORDER REVIEW TESTS
  // ============================================================================

  test("Verify order items - Product present in order review", async ({
    header,
    home,
    viewCartPage,
    checkoutPage,
  }) => {
    await header.clickHome();
    await home.addProductToCart(PRODUCT_NAME);
    await expect(home.cartModal).toBeVisible({ timeout: 30000 });
    await home.clickCartModalViewCart();
    await viewCartPage.clickProceedToCheckout();

    await checkoutPage.verifyOrderHasItems();
  });

  test("Verify order total - Total amount visible", async ({
    header,
    home,
    viewCartPage,
    checkoutPage,
  }) => {
    await header.clickHome();
    await home.addProductToCart(PRODUCT_NAME);
    await expect(home.cartModal).toBeVisible({ timeout: 30000 });
    await home.clickCartModalViewCart();
    await viewCartPage.clickProceedToCheckout();

    await checkoutPage.verifyTotalAmount();
  });

  test("Add order comment - Comment accepted", async ({
    header,
    home,
    viewCartPage,
    checkoutPage,
  }) => {
    await header.clickHome();
    await home.addProductToCart(PRODUCT_NAME);
    await expect(home.cartModal).toBeVisible({ timeout: 30000 });
    await home.clickCartModalViewCart();
    await viewCartPage.clickProceedToCheckout();

    const comment = "Please deliver between 9 AM and 5 PM.";
    await checkoutPage.fillOrderMessage(comment);
    await checkoutPage.verifyOrderMessage(comment);
  });
});
