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

    // Main category link (Women / Men / Kids) - word boundaries keep "Men" out of "Women"
    this.categoryLink = (categoryName) =>
      this.categoryAccordion.getByRole("link", {
        name: new RegExp(`\\b${categoryName}\\b`, "i"),
      });

    // Main category panel (accordion body, targeted by id used for collapse)
    this.categoryPanel = (categoryName) =>
      this.categoryAccordion.locator(`#${categoryName}`);

    // Sub-category link inside a category
    this.subCategoryLink = (categoryName, subCategoryName) =>
      this.categoryPanel(categoryName).getByRole("link", {
        name: subCategoryName,
      });

    // =========================
    // BRANDS SECTION
    // =========================
    this.brandsSection = this.leftSidebar.locator(".brands_products");
    this.brandsHeading = this.brandsSection.getByRole("heading", {
      name: "Brands",
    });
    this.brandsMenu = this.brandsSection.getByRole("list");

    this.brandLink = (brandName) =>
      this.brandsMenu.getByRole("link", { name: brandName });
  }

  // =================================================
  // INTERACTION METHODS
  // =================================================

  // ---------- CATEGORY ACTIONS ----------
  async clickCategory(categoryName) {
    const panel = this.categoryPanel(categoryName);

    // Skip click if panel is already expanded
    if (await panel.isVisible()) return;

    // Ensure Bootstrap collapse plugin is loaded before clicking
    await this.page.waitForLoadState("load");

    const category = this.categoryLink(categoryName);
    await category.scrollIntoViewIfNeeded();
    await expect(category).toBeVisible();
    await category.click();

    await expect(panel).toBeVisible();
  }

  async clickSubCategory(categoryName, subCategoryName) {
    await this.leftSidebar.scrollIntoViewIfNeeded();

    await this.clickCategory(categoryName);

    const subCategory = this.subCategoryLink(categoryName, subCategoryName);

    await expect(subCategory).toBeVisible();
    await subCategory.click();
  }

  // ---------- VERIFICATION METHODS ----------
  async verifySidebarVisible() {
    await expect(this.leftSidebar).toBeVisible();
    await expect(this.categoryHeading).toBeVisible();
    await expect(this.categoryAccordion).toBeVisible();
    await expect(this.brandsSection).toBeVisible();
    await expect(this.brandsHeading).toBeVisible();
  }

  // ---------- BRAND ACTIONS ----------
  async getBrandCount(brandName) {
    await this.brandsSection.scrollIntoViewIfNeeded();
    const brand = this.brandLink(brandName);
    await expect(brand).toBeVisible();
    const countText = await brand.locator("span.pull-right").textContent();
    return parseInt(countText.replace(/[()]/g, ""), 10);
  }

  async clickBrand(brandName) {
    await this.brandsSection.scrollIntoViewIfNeeded();
    const brand = this.brandLink(brandName);
    await expect(brand).toBeVisible();
    await brand.click();
  }
}
