# Automation Exercise - Playwright Test Suite

[![Playwright Tests](https://github.com/Nisha7001/Automation-Exercise/actions/workflows/playwright.yml/badge.svg)](https://github.com/Nisha7001/Automation-Exercise/actions/workflows/playwright.yml)

End-to-end test automation for [automationexercise.com](https://automationexercise.com) using Playwright with the Page Object Model pattern.

**120 tests** covering registration, login, product search, category and brand filters, product details, reviews, cart management, checkout, payment and newsletter subscription — plus an end-to-end purchase flow that logs in, orders a product and verifies the downloaded invoice.

---

## Project Structure

```
├── .github/workflows/  # GitHub Actions CI pipeline
├── fixtures/           # Playwright test fixtures (base.js)
├── pages/              # Page Object Models
├── tests/
│   ├── smoke/          # Visibility & UI element checks
│   ├── regression/     # Functional regression tests
│   │   ├── auth/       # Login, registration
│   │   ├── cart/       # Add to cart, cart management
│   │   ├── checkout/   # Checkout flow
│   │   ├── contactUs/  # Contact us form
│   │   ├── products/   # Products, details, search, brands, categories, reviews
│   │   └── subscription/ # Newsletter subscription
│   └── e2e/            # End-to-end purchase journey
├── utils/
│   ├── helper/         # Data generators, cart clean-up, network helpers
│   └── testData/       # Test data files
└── scripts/            # Custom reporters (Excel)
```

## Locator Strategy

Locators follow Playwright's recommended priority: role-based first, then
user-visible text, and CSS only where the page gives us nothing better.

```js
// Role + accessible name - resilient to markup changes
this.loginButton = this.loginForm.getByRole("button", { name: "Login" });
this.header = this.page.getByRole("banner");
this.cartRows = this.cartTableBody.getByRole("row");
```

The site has a few spots where a role locator genuinely does not work, and each
one is marked with a short comment explaining why:

| Element | Why not `getByRole` |
| --- | --- |
| "Add to cart", "Proceed To Checkout", delete icon | `<a>` tags with no `href`, so they expose no `link` role |
| Zipcode field | Its `<label>` points at the City input, so the field has no accessible name |
| Date of birth selects | No labels at all |
| Payment name / card number | Labels are not tied to their inputs, so the site's `data-qa` hooks are used |
| Product name in carousels | Inactive carousel slides are `display:none` and sit outside the accessibility tree |

Two traps worth knowing about, both caught while migrating:

- `getByRole` name matching is **substring** by default, so `"Men"` also matches
  `"Women"`. The category links use a word-boundary regex.
- `getByRole` **only sees the accessibility tree**, so `display:none` elements
  are invisible to it in a way that CSS locators are not.

## Setup

```bash
npm install
npx playwright install chromium

cp .env.example .env   # then fill in the test account credentials
```

`.env` holds the credentials for a registered automationexercise.com account
used by the login, checkout and payment tests. It is gitignored; CI reads the
same values from GitHub Secrets.

## Running Tests

```bash
npm test                  # Run all 120 tests
npm run test:smoke        # @smoke  - visibility / UI checks (49)
npm run test:regression   # @regression - functional regression (70)
npm run test:e2e          # @e2e - full purchase journey (1)
npm run test:headed       # Visible browser
npm run test:ui           # Interactive UI mode
npm run test:debug        # Step-through debugger
npm run report            # Open the last HTML report
```

Every test carries a tag, applied on its top-level `describe` so it is inherited
by each test in the file:

```js
test.describe("Login Tests", { tag: "@regression" }, () => { ... });
```

Tags filter independently of folders, so any test can be pulled into a suite
without moving files:

```bash
npx playwright test --grep @smoke
npx playwright test --grep-invert @e2e
```

Run a single file or folder:

```bash
npx playwright test tests/regression/auth/login.spec.js
npx playwright test tests/regression/products/
```

## Configuration

Test configuration is in `playwright.config.js`:

- **Browser**: Chromium (Desktop Chrome)
- **Base URL**: https://automationexercise.com
- **Screenshots**: Captured on failure
- **Workers**: 1 (sequential to avoid rate limiting on the live site)
- **Retries**: 2 on CI, 0 locally

## Continuous Integration

`.github/workflows/playwright.yml` runs the suite on every push and pull request
to `main`, nightly at 06:00 UTC, and on demand via **Run workflow**.

The pipeline installs dependencies from the lockfile, restores the Chromium
build from cache, runs the suite, and uploads the HTML and Excel reports as
build artifacts. Traces and screenshots are uploaded only when something fails.

Add these repository secrets under **Settings → Secrets and variables → Actions**:

| Secret | Value |
| --- | --- |
| `TEST_USER_EMAIL` | Email of the registered test account |
| `TEST_USER_PASSWORD` | Its password |
| `TEST_USER_NAME` | The username shown in the "Logged in as" header |

## Reports

- **HTML Report**: `playwright-report/index.html`, opens automatically after a local run
- **Excel Report**: generated alongside it by the custom reporter in `scripts/`
