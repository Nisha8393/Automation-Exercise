# Automation Exercise - Playwright Test Suite

[![Playwright Tests](https://github.com/Nisha7001/Automation-Exercise/actions/workflows/playwright.yml/badge.svg)](https://github.com/Nisha7001/Automation-Exercise/actions/workflows/playwright.yml)

End-to-end test automation for [automationexercise.com](https://automationexercise.com) using Playwright with the Page Object Model pattern.

**88 tests** covering registration, login, product search, category and brand filters, product details, reviews, cart management, checkout, payment and newsletter subscription — plus an end-to-end purchase flow that logs in, orders a product and verifies the downloaded invoice, unhappy-path coverage for backend failures, and a WCAG 2.1 A/AA accessibility scan of the main pages.

The smoke suite also runs on Firefox and WebKit, so a full run executes 105 tests.

---

## Project Structure

```
├── .github/workflows/  # GitHub Actions CI pipeline
├── fixtures/           # Playwright test fixtures (base.js)
├── pages/              # Page Object Models
├── tests/
│   ├── auth.setup.js   # Logs in once per run, saves the session
│   ├── smoke/          # Visibility & UI element checks
│   ├── regression/     # Functional regression tests
│   │   ├── auth/       # Login, registration
│   │   ├── cart/       # Add to cart, cart management
│   │   ├── checkout/   # Checkout flow
│   │   ├── contactUs/  # Contact us form
│   │   ├── products/   # Products, details, search, brands, categories, reviews
│   │   ├── subscription/ # Newsletter subscription
│   │   └── unhappyPath/  # Behaviour when the backend fails
│   ├── a11y/           # Accessibility scans (axe-core)
│   └── e2e/            # End-to-end purchase journey
├── utils/
│   ├── helper/         # Data generation, cart clean-up, account registration
│   ├── testData/       # Test data files
│   └── authState.js    # Path to the saved session
└── scripts/            # Custom reporters (Excel)
```

## Fixture Design

`fixtures/base.js` exposes each Page Object twice, over two different page
lifetimes, and tests pick the one that matches what they do:

| | Isolated (test-scoped) | Shared (worker-scoped) |
| --- | --- | --- |
| Fixtures | `isolatedPage`, `header`, `home`, `productsPage`… | `sharedPage`, `headerSection`, `homePage`, `productsPageWorker`… |
| Lifetime | fresh page per test | one page for the whole worker |
| Used by | regression, e2e — anything that changes state | smoke visibility checks (read-only) |

The isolated variant is built on Playwright's own `page` fixture rather than a
hand-rolled `browser.newContext()`, so `test.use({ storageState })`, the
project viewport and trace capture all apply to it.

## Authentication

The `setup` project logs in once per run and saves the session to
`playwright/.auth/user.json`. Specs that need an account opt in:

```js
import { STORAGE_STATE } from "../../../utils/authState.js";

test.use({ storageState: STORAGE_STATE });
```

The checkout order-review tests use this instead of signing in through the UI in
a `beforeEach`. The e2e journey still logs in through the UI on purpose —
testing that path is the point of the test.

## Test Data

Tests that assert on saved account data register their own account rather than
depending on a shared one. `utils/helper/registration.helper.js` creates an
account from generated data, hands the test what it entered, and the test
deletes it afterwards:

```js
user = await registerNewUser({ header, loginPage, registerPage, accountCreatedPage });
// ...
await checkoutPage.verifyDeliveryAddress(addressOf(user));
```

This is why no address is stored in the repo, in `.env`, or in CI secrets — the
expected value is simply what the test just typed in, which also makes the
assertion stronger: it proves the site saved and rendered the exact address
entered at registration.

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

## Accessibility Tests

`tests/a11y/` scans the main pages with axe-core against WCAG 2.1 A/AA.

The site is third-party and has pre-existing accessibility debt, so asserting
"zero violations" would only paint the suite red. Each page instead carries a
baseline of already-known rule IDs — a **new** critical or serious violation
fails the test, existing debt is recorded. Every run attaches the full axe JSON
so the baseline can be reviewed and trimmed.

The `label` violation on Contact Us is the same defect noted in the locator
table above: inputs whose labels are not tied to them.

## Setup

```bash
npm install
npx playwright install chromium firefox webkit

cp .env.example .env   # then fill in the test account details
```

`.env` holds the credentials for a registered automationexercise.com account,
used by the login, order-review and payment tests. It is gitignored; CI reads
the same values from GitHub Secrets.

## Running Tests

```bash
npm test                  # Run everything (105 incl. cross-browser smoke)
npm run test:smoke        # @smoke - visibility / UI checks (8, x3 browsers)
npm run test:regression   # @regression - functional regression (74)
npm run test:a11y         # @a11y - accessibility scans (5)
npm run test:e2e          # @e2e - full purchase journey (1)
npm run test:headed       # Visible browser
npm run test:ui           # Interactive UI mode
npm run test:debug        # Step-through debugger
npm run report            # Open the last HTML report
```

Lint and formatting:

```bash
npm run lint              # ESLint (incl. eslint-plugin-playwright)
npm run lint:fix
npm run format            # Prettier
npm run format:check      # CI runs this
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

### A note on the smoke suite

The visibility checks are grouped one test per page region rather than one per
element, using `expect.soft` so every assertion in a region runs and a failure
reports all the missing elements at once instead of stopping at the first.

Smoke is also the only suite that runs cross-browser. Those tests are read-only,
so they touch no account state, and running the full suite on three browsers
would triple the load on a live third-party site.

## Unhappy Path Tests

`tests/regression/unhappyPath/` intercepts the site's own ajax calls to cover
what a user hits on a bad connection — a 500, an aborted request, a slow
response — rather than only the happy path.

Recorded finding: when `add_to_cart` fails, the site shows no modal, adds
nothing, and surfaces **no error to the user at all**. The click simply does
nothing. These tests pin that behaviour down so a future change either fixes it
deliberately or fails here.

## Configuration

Test configuration is in `playwright.config.js`:

- **Browser**: Chromium (Desktop Chrome)
- **Base URL**: https://automationexercise.com
- **Screenshots**: Captured on failure
- **Workers**: 1 (sequential, to avoid rate limiting and bot checks on the live site)
- **Retries**: 2 on CI, 0 locally

## Continuous Integration

`.github/workflows/playwright.yml` runs on every push and pull request to
`main`, nightly at 06:00 UTC, and on demand via **Run workflow**.

The pipeline has three jobs:

1. **Secret scan** — gitleaks over the full history, not just the diff.
2. **Lint** — `npm run lint` and `npm run format:check`.
3. **Test** — the whole suite on a single runner, producing the HTML and Excel
   reports. Deliberately one runner: the site serves a bot-check interstitial to
   datacenter IPs, so each extra concurrent runner is another chance of being
   challenged. Sharding was tried and reverted for exactly that reason — the
   suite finishes in about six minutes, which is not worth trading for flake.
Traces and screenshots are uploaded only when something fails.

The HTML and Excel reports are uploaded as build artifacts. Publishing them to
GitHub Pages is deliberately not enabled: failure screenshots and traces would
become public, and the test account's saved address appears on the checkout
page. That can be revisited once the account holds only synthetic data.

Add these repository secrets under **Settings → Secrets and variables → Actions**:

| Secret | Value |
| --- | --- |
| `TEST_USER_EMAIL` | Email of the registered test account |
| `TEST_USER_PASSWORD` | Its password |
| `TEST_USER_NAME` | The username shown in the "Logged in as" header |

## Reports

- **HTML Report**: `playwright-report/index.html`, opens automatically after a local run
- **Excel Report**: generated alongside it by the custom reporter in `scripts/`
