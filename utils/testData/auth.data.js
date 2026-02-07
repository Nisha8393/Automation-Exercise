/**
 * Authentication Test Data
 * Data-Driven Testing for Login and Registration
 */

// Helper to generate unique email
const generateEmail = (prefix = "user") => {
  return `${prefix}_${Date.now()}@testmail.com`;
};

// ============================================================================
// LOGIN TEST DATA
// ============================================================================

export const loginTestData = {
  // Valid credentials (update with actual test account)
  valid: {
    email: "***REMOVED***",
    password: "***REMOVED***",
    name: "Nisha7001",
  },

  // Invalid scenarios for DDT
  invalid: [
    {
      id: "LOGIN-01",
      scenario: "incorrect password",
      email: "***REMOVED***",
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
      email: "***REMOVED***",
      password: "***REMOVED***",
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
      email: "***REMOVED***", // Already registered
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
