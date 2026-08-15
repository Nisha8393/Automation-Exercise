import { test, expect } from "../../../fixtures/base.js";
import { STORAGE_STATE } from "../../../utils/authState.js";
import { emptyCart } from "../../../utils/helper/cart.helper.js";
import {
  registerNewUser,
  addressOf,
} from "../../../utils/helper/registration.helper.js";

const PRODUCT_NAME = "Blue Top";

/** Put one product in the cart and open the checkout page. */
async function checkoutWithProduct({ header, home, viewCartPage }) {
  await header.clickHome();
  await home.addProductToCart(PRODUCT_NAME);
  await expect(home.cartModal).toBeVisible();
  await home.clickCartModalViewCart();
  await viewCartPage.clickProceedToCheckout();
}

// ============================================================================
// ADDRESS VERIFICATION
// Registers a fresh account per test so the expected address is simply the
// data the test just entered - no address is stored in the repo or in .env.
// ============================================================================

test.describe("Checkout - Address Verification", { tag: "@regression" }, () => {
  let user;

  test.beforeEach(
    async ({
      header,
      loginPage,
      registerPage,
      accountCreatedPage,
      home,
      viewCartPage,
    }) => {
      user = await registerNewUser({
        header,
        loginPage,
        registerPage,
        accountCreatedPage,
      });
      await checkoutWithProduct({ header, home, viewCartPage });
    },
  );

  test.afterEach(async ({ header }) => {
    await header.clickDeleteAccount();
  });

  test("Delivery address matches the address used at registration", async ({
    checkoutPage,
  }) => {
    await checkoutPage.verifyDeliveryAddress(addressOf(user));
  });

  test("Billing address matches the address used at registration", async ({
    checkoutPage,
  }) => {
    await checkoutPage.verifyBillingAddress(addressOf(user));
  });

  test("Verify address format - All address fields shown", async ({
    checkoutPage,
  }) => {
    await checkoutPage.verifyAddressFieldsVisible();
  });
});

// ============================================================================
// ORDER REVIEW
// These only need to be logged in, so they reuse the session saved by the
// setup project rather than paying for a registration or a UI login.
// ============================================================================

test.describe("Checkout - Order Review", { tag: "@regression" }, () => {
  test.use({ storageState: STORAGE_STATE });

  test.beforeEach(async ({ isolatedPage, header, home, viewCartPage }) => {
    // The account is shared, so an earlier failed run can leave items behind
    await header.clickCart();
    await emptyCart(isolatedPage, viewCartPage);

    await checkoutWithProduct({ header, home, viewCartPage });
  });

  test("Verify order items - Product present in order review", async ({
    checkoutPage,
  }) => {
    await checkoutPage.verifyOrderHasItems();
  });

  test("Verify order total - Total amount visible", async ({
    checkoutPage,
  }) => {
    await checkoutPage.verifyTotalAmount();
  });

  test("Add order comment - Comment accepted", async ({ checkoutPage }) => {
    const comment = "Please deliver between 9 AM and 5 PM.";

    await checkoutPage.fillOrderMessage(comment);
    await checkoutPage.verifyOrderMessage(comment);
  });
});
