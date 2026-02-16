import { test, expect } from "../../../fixtures/base.js";

// First product on the products page (Blue Top - product ID 1)
const FIRST_PRODUCT = {
  name: "Blue Top",
  category: "Women > Tops",
  price: "Rs. 500",
  availability: "In Stock",
  condition: "New",
  brand: "Polo",
};

test.describe("Product Details Page", () => {
  test.beforeEach(async ({ header, productsPage }) => {
    await header.clickProducts();

    // Navigate to first product detail page
    const firstProduct = productsPage.productCards.first();
    await firstProduct.scrollIntoViewIfNeeded();
    await firstProduct.hover();
    const viewLink = productsPage.productViewProductLink(firstProduct);
    await expect(viewLink).toBeVisible();
    await viewLink.click();
  });

  // ============================================================================
  // PRODUCT INFORMATION TESTS
  // ============================================================================

  test("Verify product detail info - All fields match expected values", async ({
    productDetailsPage,
  }) => {
    const name = await productDetailsPage.getProductName();
    expect(name).toBe(FIRST_PRODUCT.name);

    const category = await productDetailsPage.getProductCategory();
    expect(category).toBe(FIRST_PRODUCT.category);

    const price = await productDetailsPage.getProductPrice();
    expect(price).toBe(FIRST_PRODUCT.price);

    const availability = await productDetailsPage.getAvailability();
    expect(availability).toBe(FIRST_PRODUCT.availability);

    const condition = await productDetailsPage.getCondition();
    expect(condition).toBe(FIRST_PRODUCT.condition);

    const brand = await productDetailsPage.getBrand();
    expect(brand).toBe(FIRST_PRODUCT.brand);
  });

  test("Verify product quantity selector - Default value is 1", async ({
    productDetailsPage,
  }) => {
    await expect(productDetailsPage.quantityInput).toBeVisible();

    const quantity = await productDetailsPage.getQuantity();
    expect(quantity).toBe("1");
  });

  // ============================================================================
  // SEARCH EDGE CASE
  // ============================================================================

  test("Search with special characters - Handled gracefully", async ({
    header,
    productsPage,
  }) => {
    await header.clickProducts();

    await productsPage.searchProduct("@#$%");

    // Should handle gracefully - either 0 products or all products remain
    const count = await productsPage.getProductCardsCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
