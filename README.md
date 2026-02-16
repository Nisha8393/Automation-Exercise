# Automation Exercise - Playwright Test Suite

End-to-end test automation for [automationexercise.com](https://automationexercise.com) using Playwright with the Page Object Model pattern.

---

## Project Structure

```
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
│   └── e2e/            # End-to-end flows
├── utils/
│   ├── helper/         # Data generators, network helpers
│   └── testData/       # Test data files
└── scripts/            # Custom reporters (Excel)
```

## Setup

```bash
npm install
npx playwright install
```

## Running Tests

```bash
# Run all tests
npx playwright test

# Run a specific test file
npx playwright test tests/regression/auth/login.spec.js

# Run tests in a specific folder
npx playwright test tests/regression/products/

# Run in headed mode (visible browser)
npx playwright test --headed

# Run in UI mode (interactive)
npx playwright test --ui

# Run in debug mode
npx playwright test --debug
```

## npm Scripts

```bash
npm run test          # Run all tests
npm run test:ui       # Run in UI mode
npm run test:debug    # Run in debug mode
```

## Configuration

Test configuration is in `playwright.config.js`:

- **Browser**: Chromium (Desktop Chrome)
- **Base URL**: https://automationexercise.com
- **Screenshots**: Captured on failure
- **Workers**: 1 (sequential to avoid rate limiting)
- **Retries**: 2 on CI, 0 locally

## Reports

- **HTML Report**: Opens automatically after test run
- **Excel Report**: Generated via custom reporter in `scripts/`
