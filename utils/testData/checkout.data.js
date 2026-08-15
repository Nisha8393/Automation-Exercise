/**
 * Checkout & Payment Test Data
 * Data for payment tests. The expected checkout address is derived from the
 * account each test registers - see utils/helper/registration.helper.js.
 */

export const paymentTestData = {
  valid: {
    nameOnCard: "Test User",
    cardNumber: "4100000000000",
    cvc: "123",
    expiryMonth: "01",
    expiryYear: "2030",
  },
};

export default {
  paymentTestData,
};
