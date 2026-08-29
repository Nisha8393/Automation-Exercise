import { test, expect } from "../../../fixtures/base.js";
import { removeCartItem } from "../../../utils/helper/cart.helper.js";

const PRODUCT_NAME = "Blue Top";

/**
 * Unhappy-path coverage. Every other spec exercises the happy path or the
 * browser's own validation; these drive what a real user hits on a bad
 * connection, by intercepting the site's ajax calls.
 *
 * Recorded behaviour: when add_to_cart fails the site shows no modal, adds
 * nothing, and gives the user no error at all - the click simply does nothing.
 * These tests pin that down, so a future change either fixes it deliberately or
 * fails here.
 */
test.describe("Unhappy Path - Network Failures", { tag: "@regression" }, () => {
  test(
    "Add to cart with a 500 response - nothing is added and no modal appears",
    { tag: "@R-NET-01" },
    async ({ isolatedPage, home, header, viewCartPage }) => {
      await isolatedPage.route("**/add_to_cart/**", (route) =>
        route.fulfill({ status: 500, body: "" }),
      );

      await home.addProductToCart(PRODUCT_NAME);

      await expect(home.cartModal).toBeHidden();

      await header.clickCart();
      expect(await viewCartPage.isCartEmpty()).toBe(true);
    },
  );

  test(
    "Add to cart with the request aborted - nothing is added and no modal appears",
    { tag: "@R-NET-02" },
    async ({ isolatedPage, home, header, viewCartPage }) => {
      await isolatedPage.route("**/add_to_cart/**", (route) => route.abort());

      // An aborted request never produces a response, so the page object's
      // add-to-cart wait would never settle - drive the click from its parts
      await home.hoverOverProduct(PRODUCT_NAME);
      const product = home.productCard(PRODUCT_NAME);
      await home.productAddToCartButton(product).click();

      await expect(home.cartModal).toBeHidden();

      await header.clickCart();
      expect(await viewCartPage.isCartEmpty()).toBe(true);
    },
  );

  test(
    "Add to cart over a slow connection - the modal still appears once it responds",
    { tag: "@R-NET-03" },
    async ({ isolatedPage, home }) => {
      await isolatedPage.route("**/add_to_cart/**", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await route.continue();
      });

      await home.addProductToCart(PRODUCT_NAME);

      // Passes because the page object waits on the response rather than a fixed
      // timeout - a 3s stall used to be enough to fail this
      await expect(home.cartModal).toBeVisible();
    },
  );

  test(
    "Remove from cart with a 500 response - the item stays in the cart",
    { tag: "@R-NET-04" },
    async ({ isolatedPage, home, header, viewCartPage }) => {
      await home.addProductToCart(PRODUCT_NAME);
      await expect(home.cartModal).toBeVisible();
      await home.clickCartModalViewCart();

      const [productId] = await viewCartPage.getAllProductIds();
      await viewCartPage.verifyCartItemsCount(1);

      await isolatedPage.route("**/delete_cart/**", (route) =>
        route.fulfill({ status: 500, body: "" }),
      );

      await removeCartItem(isolatedPage, viewCartPage, productId);

      // The row must survive a failed delete - dropping it would tell the user
      // the item was removed while the server still has it
      await header.clickCart();
      await expect(viewCartPage.productRow(productId)).toBeVisible();
    },
  );
});
