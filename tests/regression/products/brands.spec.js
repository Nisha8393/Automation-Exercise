import { test, expect } from "../../../fixtures/base.js";

test.describe("Brand Filtering", () => {
  test.beforeEach(async ({ header }) => {
    await header.clickProducts();
  });

  // ============================================================================
  // BRAND FILTER TESTS
  // ============================================================================

  test("Filter by Polo brand - Shows Polo products", async ({
    sidebar,
    productsPage,
    isolatedPage,
  }) => {
    const expectedCount = await sidebar.getBrandCount("Polo");
    await sidebar.clickBrand("Polo");

    await expect(isolatedPage).toHaveURL(/brand_products\/Polo/);
    await productsPage.verifyFilterHeading(/POLO/i);
    await productsPage.verifyProductCount(expectedCount);
  });

  test("Filter by H&M brand - Shows H&M products", async ({
    sidebar,
    productsPage,
    isolatedPage,
  }) => {
    const expectedCount = await sidebar.getBrandCount("H&M");
    await sidebar.clickBrand("H&M");

    await expect(isolatedPage).toHaveURL(/brand_products/);
    await productsPage.verifyFilterHeading(/H&M/i);
    await productsPage.verifyProductCount(expectedCount);
  });

  test("Filter by Madame brand - Shows Madame products", async ({
    sidebar,
    productsPage,
    isolatedPage,
  }) => {
    const expectedCount = await sidebar.getBrandCount("Madame");
    await sidebar.clickBrand("Madame");

    await expect(isolatedPage).toHaveURL(/brand_products\/Madame/);
    await productsPage.verifyFilterHeading(/MADAME/i);
    await productsPage.verifyProductCount(expectedCount);
  });

  test("Filter by Babyhug brand - Shows Babyhug products", async ({
    sidebar,
    productsPage,
    isolatedPage,
  }) => {
    const expectedCount = await sidebar.getBrandCount("Babyhug");
    await sidebar.clickBrand("Babyhug");

    await expect(isolatedPage).toHaveURL(/brand_products\/Babyhug/);
    await productsPage.verifyFilterHeading(/BABYHUG/i);
    await productsPage.verifyProductCount(expectedCount);
  });

  test("Filtered product belongs to the brand - Detail page confirms", async ({
    sidebar,
    productsPage,
    productDetailsPage,
    isolatedPage,
  }) => {
    await sidebar.clickBrand("Polo");

    await expect(isolatedPage).toHaveURL(/brand_products\/Polo/);

    // Navigate to first product's detail page
    const firstProduct = productsPage.productCards.first();
    await firstProduct.scrollIntoViewIfNeeded();
    await firstProduct.hover();

    const viewLink = productsPage.productViewProductLink(firstProduct);
    await viewLink.click();

    await expect(isolatedPage).toHaveURL(/product_details/);

    const brand = await productDetailsPage.getBrand();
    expect(brand).toMatch(/Polo/i);
  });

  test("Switch between brands - Heading updates correctly", async ({
    sidebar,
    productsPage,
    isolatedPage,
  }) => {
    // First: select Polo
    const poloExpected = await sidebar.getBrandCount("Polo");
    await sidebar.clickBrand("Polo");

    await expect(isolatedPage).toHaveURL(/brand_products\/Polo/);
    await productsPage.verifyFilterHeading(/POLO/i);
    await productsPage.verifyProductCount(poloExpected);

    // Then: switch to H&M
    const hmExpected = await sidebar.getBrandCount("H&M");
    await sidebar.clickBrand("H&M");

    await productsPage.verifyFilterHeading(/H&M/i);
    await productsPage.verifyProductCount(hmExpected);
  });
});
