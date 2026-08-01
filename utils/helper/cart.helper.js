/**
 * Cart Helper
 * Cart clean-up shared by the cart regression tests and the e2e purchase flow.
 */
import { expect } from "@playwright/test";

/**
 * Remove one product and wait for the server to confirm the deletion.
 * Removing an item is an ajax call, so waiting on the response avoids
 * asserting against a row the page has not dropped yet.
 * @param {import('@playwright/test').Page} page
 * @param {import('../../pages/viewCart.page.js').default} viewCartPage
 * @param {string} productId
 */
export async function removeCartItem(page, viewCartPage, productId) {
  const deleted = page.waitForResponse((resp) =>
    resp.url().includes("delete_cart"),
  );
  await viewCartPage.clickProductDeleteByProductId(productId);
  await deleted;
  await page.waitForLoadState("domcontentloaded");
}

/**
 * Empty the cart so a run starts from a known state - the test account is
 * shared, and an earlier failed run can leave items behind.
 * @param {import('@playwright/test').Page} page
 * @param {import('../../pages/viewCart.page.js').default} viewCartPage
 */
export async function emptyCart(page, viewCartPage) {
  if (await viewCartPage.isCartEmpty()) return;

  for (const id of await viewCartPage.getAllProductIds()) {
    await removeCartItem(page, viewCartPage, id);
  }

  expect(await viewCartPage.isCartEmpty()).toBe(true);
}

export default { removeCartItem, emptyCart };
