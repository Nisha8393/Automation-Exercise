import { expect } from "@playwright/test";

export default class SidebarPage {
  constructor(page) {
    this.page = page;

    // =========================
    // LEFT SIDEBAR
    // =========================
    this.leftSidebar = this.page.locator(".left-sidebar");

    // =========================
    // CATEGORIES SECTION
    // =========================
    this.categoryHeading = this.leftSidebar.getByRole("heading", {
      name: "Category",
    });
    this.categoryAccordion = this.leftSidebar.locator("#accordian");

    // Main category link (Women / Men / Kids)
    this.categoryLink = (categoryName) =>
      this.categoryAccordion.locator(`a[href="#${categoryName}"]`);

    // Main category panel (accordion body)
    this.categoryPanel = (categoryName) =>
      this.categoryAccordion.locator(`#${categoryName}`);

    // Sub-category link inside a category
    this.subCategoryLink = (categoryName, subCategoryName) =>
      this.categoryAccordion
        .locator(`#${categoryName}`)
        .locator("a", { hasText: subCategoryName });

    // =========================
    // BRANDS SECTION
    // =========================
    this.brandsSection = this.leftSidebar.locator(".brands_products");
    this.brandsHeading = this.brandsSection.getByRole("heading", {
      name: "Brands",
    });
    this.brandsMenu = this.brandsSection.locator(".brands-name ul");

    this.brandLink = (brandName) =>
      this.brandsMenu.getByRole("link", { name: new RegExp(brandName, "i") });
  }

  // =================================================
  // INTERACTION METHODS
  // =================================================

  // ---------- CATEGORY ACTIONS ----------
  async clickCategory(categoryName) {
    await this.leftSidebar.scrollIntoViewIfNeeded();

    const category = this.categoryLink(categoryName);
    await expect(category).toBeVisible();
    await category.click();

    await expect(this.categoryPanel(categoryName)).toBeVisible();
  }

  async clickSubCategory(categoryName, subCategoryName) {
    await this.leftSidebar.scrollIntoViewIfNeeded();

    await this.clickCategory(categoryName);

    const subCategory = this.subCategoryLink(categoryName, subCategoryName);

    await expect(subCategory).toBeVisible();
    await subCategory.click();
  }

  // ---------- BRAND ACTIONS ----------
  async clickBrand(brandName) {
    await this.brandsSection.scrollIntoViewIfNeeded();
    const brand = this.brandLink(brandName);
    await expect(brand).toBeVisible();
    await brand.click();
  }
}
