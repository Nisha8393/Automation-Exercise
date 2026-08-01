/**
 * Authentication Test Data
 * Data-Driven Testing for Login and Registration
 */
import "dotenv/config";

// Helper to generate unique email
const generateEmail = (prefix = "user") => {
  return `${prefix}_${Date.now()}@testmail.com`;
};

// Test account credentials - set in .env locally, GitHub Secrets on CI
const TEST_USER = {
  email: process.env.TEST_USER_EMAIL,
  password: process.env.TEST_USER_PASSWORD,
  name: process.env.TEST_USER_NAME,
};

// Fail loudly at load time instead of midway through a login test
for (const [key, value] of Object.entries(TEST_USER)) {
  if (!value) {
    throw new Error(
      `Missing TEST_USER_${key.toUpperCase()}. Copy .env.example to .env and fill it in.`,
    );
  }
}

// ============================================================================
// LOGIN TEST DATA
// ============================================================================

export const loginTestData = {
  // Valid credentials for the registered test account
  valid: {
    email: TEST_USER.email,
    password: TEST_USER.password,
    name: TEST_USER.name,
  },

  // Invalid scenarios for DDT
  invalid: [
    {
      id: "LOGIN-01",
      scenario: "incorrect password",
      email: TEST_USER.email,
      password: "WrongPassword",
      expectedError: "Your email or password is incorrect!",
    },
    {
      id: "LOGIN-02",
      scenario: "unregistered email",
      email: "notregistered@testmail.com",
      password: "AnyPassword123",
      expectedError: "Your email or password is incorrect!",
    },
    {
      id: "LOGIN-03",
      scenario: "invalid email format",
      email: "invalid-email",
      password: "Test@123",
      expectedError: null, // Browser validation
    },
    {
      id: "LOGIN-04",
      scenario: "incorrect email",
      email: `unknown_${TEST_USER.email}`,
      password: TEST_USER.password,
      expectedError: "Your email or password is incorrect!",
    },
  ],
};

// ============================================================================
// SIGNUP TEST DATA
// ============================================================================

export const signupTestData = {
  // Generate new user for each test
  generateNewUser: () => ({
    name: `TestUser_${Date.now()}`,
    email: generateEmail("newuser"),
  }),

  // Invalid scenarios for DDT
  invalid: [
    {
      id: "SIGNUP-01",
      scenario: "existing email",
      name: "Duplicate User",
      email: TEST_USER.email, // Already registered
      expectedError: "Email Address already exist!",
    },
  ],
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const errorMessages = {
  login: {
    invalidCredentials: "Your email or password is incorrect!",
  },
  signup: {
    emailExists: "Email Address already exist!",
  },
};

export default {
  loginTestData,
  signupTestData,
  errorMessages,
  generateEmail,
};
