import { test, expect } from "../../fixtures/base.js";
import { loginTestData } from "../../utils/testData/auth.data.js";
import {
  paymentTestData,
  expectedAddress,
} from "../../utils/testData/checkout.data.js";
import { emptyCart } from "../../utils/helper/cart.helper.js";

const PRODUCT_NAME = "Blue Top";
const QUANTITY = 2;
const ORDER_COMMENT = "Please deliver between 9 AM and 5 PM.";

test.describe("E2E - Purchase Flow", { tag: "@e2e" }, () => {
  test("Registered user can order a product from login to invoice", async ({
    isolatedPage,
    header,
    loginPage,
    productsPage,
    productDetailsPage,
    viewCartPage,
    checkoutPage,
    paymentPage,
    paymentDonePage,
  }) => {
    const { email, password, name } = loginTestData.valid;
    let unitPrice;

    await test.step("Log in with a registered account", async () => {
      await header.clickLoginSignup();
      await loginPage.login(email, password);

      await expect(header.loggedInUserText(name)).toBeVisible();
      await expect(header.logoutLink).toBeVisible();
    });

    await test.step("Start from an empty cart", async () => {
      await header.clickCart();
      await emptyCart(isolatedPage, viewCartPage);
    });

    await test.step(`Open the product page for "${PRODUCT_NAME}"`, async () => {
      await header.clickProducts();
      await productsPage.searchProduct(PRODUCT_NAME);
      await productsPage.viewProduct(PRODUCT_NAME);

      await expect(isolatedPage).toHaveURL(/product_details/);
      expect(await productDetailsPage.getProductName()).toBe(PRODUCT_NAME);
      expect(await productDetailsPage.isProductInStock()).toBe(true);

      const priceText = await productDetailsPage.getProductPrice();
      unitPrice = parseInt(priceText.replace(/[^\d]/g, ""), 10);
      expect(unitPrice).toBeGreaterThan(0);
    });

    await test.step(`Add ${QUANTITY} to the cart`, async () => {
      await productDetailsPage.addToCartWithQuantity(QUANTITY);

      await expect(productDetailsPage.cartModal).toBeVisible();
      await expect(productDetailsPage.cartModalTitle).toHaveText("Added!");
      await productDetailsPage.clickCartModalViewCart();

      await expect(isolatedPage).toHaveURL(/view_cart/);
    });

    await test.step("Cart holds the right product, quantity and line total", async () => {
      await viewCartPage.verifyCartItemsCount(1);

      const [productId] = await viewCartPage.getAllProductIds();
      await viewCartPage.verifyProductName(productId, PRODUCT_NAME);
      await viewCartPage.verifyProductQuantity(productId, String(QUANTITY));
      await viewCartPage.verifyProductTotalPrice(
        productId,
        unitPrice * QUANTITY,
      );
    });

    await test.step("Proceed to checkout and confirm the saved addresses", async () => {
      await viewCartPage.clickProceedToCheckout();

      await expect(isolatedPage).toHaveURL(/checkout/);
      await expect(checkoutPage.addressDetailsHeading).toBeVisible();
      await checkoutPage.verifyDeliveryAddress(expectedAddress);
      await checkoutPage.verifyBillingAddress(expectedAddress);
    });

    await test.step("Review the order and leave a comment", async () => {
      await expect(checkoutPage.reviewOrderHeading).toBeVisible();
      await checkoutPage.verifyOrderHasItems();

      const totalText = await checkoutPage.getTotalAmount();
      const total = parseInt(totalText.replace(/[^\d]/g, ""), 10);
      expect(total).toBe(unitPrice * QUANTITY);

      await checkoutPage.fillOrderMessage(ORDER_COMMENT);
      await checkoutPage.verifyOrderMessage(ORDER_COMMENT);
    });

    await test.step("Place the order and pay", async () => {
      await checkoutPage.clickPlaceOrder();

      await expect(isolatedPage).toHaveURL(/payment/);
      await expect(paymentPage.paymentHeading).toBeVisible();
      await paymentPage.completePayment(paymentTestData.valid);
    });

    await test.step("Order is confirmed", async () => {
      await expect(paymentDonePage.orderPlacedHeading).toBeVisible();
      expect(await paymentDonePage.getOrderPlacedMessage()).toBe(
        "Order Placed!",
      );
      expect(await paymentDonePage.getCongratulationsMessage()).toContain(
        "Your order has been confirmed",
      );
      await expect(isolatedPage).toHaveURL(/payment_done/);
    });

    await test.step("Invoice is downloadable", async () => {
      const downloadPromise = isolatedPage.waitForEvent("download");
      await paymentDonePage.clickDownloadInvoice();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toBe("invoice.txt");

      const contents = await download.createReadStream();
      const chunks = [];
      for await (const chunk of contents) chunks.push(chunk);
      const invoice = Buffer.concat(chunks).toString("utf8");

      // e.g. "Hi <name>, Your total purchase amount is 1000. Thank you"
      expect(invoice).toContain(
        `Your total purchase amount is ${unitPrice * QUANTITY}`,
      );
    });

    await test.step("Return home with an empty cart", async () => {
      await paymentDonePage.clickContinue();
      await expect(isolatedPage).toHaveURL(/automationexercise\.com\/?$/);

      await header.clickCart();
      expect(await viewCartPage.isCartEmpty()).toBe(true);
    });
  });
});
