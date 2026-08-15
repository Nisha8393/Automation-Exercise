import { test, expect } from "../../fixtures/base.js";
import AxeBuilder from "@axe-core/playwright";

// automationexercise.com is a third-party site with pre-existing accessibility
// debt, so asserting "zero violations" would just paint the suite red and tell
// us nothing. Instead each page is scanned against a baseline of already-known
// rule IDs: anything new fails, existing debt is recorded and tracked.
// To refresh a baseline, read the JSON attachment on the test result.
// Baselines captured 2026-08-15 against the live site.
const PAGES = [
  {
    name: "Home",
    path: "/",
    baseline: ["button-name", "color-contrast", "link-name"],
  },
  {
    name: "Products",
    path: "/products",
    baseline: ["button-name", "color-contrast"],
  },
  {
    name: "Cart",
    path: "/view_cart",
    baseline: ["button-name", "color-contrast"],
  },
  {
    name: "Signup / Login",
    path: "/login",
    baseline: ["button-name", "color-contrast"],
  },
  // "label" here is the same defect the README documents: the Contact Us
  // inputs have labels that are not tied to them
  {
    name: "Contact Us",
    path: "/contact_us",
    baseline: ["button-name", "color-contrast", "label"],
  },
];

const IMPACTS_THAT_FAIL = ["critical", "serious"];

test.describe("Accessibility", { tag: "@a11y" }, () => {
  for (const { name, path, baseline } of PAGES) {
    test(`${name} has no new WCAG 2.1 A/AA violations`, async ({
      isolatedPage,
    }, testInfo) => {
      await isolatedPage.goto(path);
      await isolatedPage.waitForLoadState("domcontentloaded");

      const { violations } = await new AxeBuilder({ page: isolatedPage })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      // Always attach the full scan so the baseline can be reviewed and trimmed
      await testInfo.attach(`axe-${name}.json`, {
        body: JSON.stringify(violations, null, 2),
        contentType: "application/json",
      });

      const regressions = violations
        .filter((v) => IMPACTS_THAT_FAIL.includes(v.impact))
        .filter((v) => !baseline.includes(v.id));

      const summary = regressions
        .map((v) => `${v.id} (${v.impact}, ${v.nodes.length} nodes): ${v.help}`)
        .join("\n");

      expect(regressions, `New accessibility violations:\n${summary}`).toEqual(
        [],
      );
    });
  }
});
