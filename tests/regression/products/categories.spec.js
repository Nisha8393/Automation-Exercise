import { test, expect } from "../../../fixtures/base.js";

test.describe("Category Filtering", () => {
  test.beforeEach(async ({ header }) => {
    await header.clickProducts();
  });

  // ============================================================================
  // CATEGORY FILTER TESTS
  // ============================================================================

  test("Filter by Women > Dress - Shows women dress products", async ({
    sidebar,
    productsPage,
    isolatedPage,
  }) => {
    await sidebar.clickSubCategory("Women", "Dress");

    await expect(isolatedPage).toHaveURL(/category_products/);
    await productsPage.verifyFilterHeading(/WOMEN.*DRESS/i);

    const count = await productsPage.getProductCardsCount();
    expect(count).toBeGreaterThan(0);
  });

  test("Filter by Men > Jeans - Shows men jeans products", async ({
    sidebar,
    productsPage,
    isolatedPage,
  }) => {
    await sidebar.clickSubCategory("Men", "Jeans");

    await expect(isolatedPage).toHaveURL(/category_products/);
    await productsPage.verifyFilterHeading(/MEN.*JEANS/i);

    const count = await productsPage.getProductCardsCount();
    expect(count).toBeGreaterThan(0);
  });

  test("Filter by Kids > Dress - Shows kids dress products", async ({
    sidebar,
    productsPage,
    isolatedPage,
  }) => {
    await sidebar.clickSubCategory("Kids", "Dress");

    await expect(isolatedPage).toHaveURL(/category_products/);
    await productsPage.verifyFilterHeading(/KIDS.*DRESS/i);

    const count = await productsPage.getProductCardsCount();
    expect(count).toBeGreaterThan(0);
  });

  test("Verify category breadcrumb - Matches selected category", async ({
    sidebar,
    productsPage,
    isolatedPage,
  }) => {
    await sidebar.clickSubCategory("Women", "Dress");

    await expect(isolatedPage).toHaveURL(/category_products/);
    await productsPage.verifyFilterHeading(/WOMEN.*DRESS/i);
  });

  test("Switch between categories - Heading updates correctly", async ({
    sidebar,
    productsPage,
    isolatedPage,
  }) => {
    // First: select Women > Dress
    await sidebar.clickSubCategory("Women", "Dress");

    await expect(isolatedPage).toHaveURL(/category_products/);
    await productsPage.verifyFilterHeading(/WOMEN.*DRESS/i);

    const womenCount = await productsPage.getProductCardsCount();
    expect(womenCount).toBeGreaterThan(0);

    // Then: switch to Men > Tshirts
    await sidebar.clickSubCategory("Men", "Tshirts");

    await productsPage.verifyFilterHeading(/MEN.*TSHIRTS/i);

    const menCount = await productsPage.getProductCardsCount();
    expect(menCount).toBeGreaterThan(0);
  });
});
