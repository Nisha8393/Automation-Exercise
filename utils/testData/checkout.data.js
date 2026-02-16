/**
 * Checkout & Payment Test Data
 * Data for checkout address verification and payment tests
 */

export const paymentTestData = {
  valid: {
    nameOnCard: "***REMOVED***",
    cardNumber: "4100000000000",
    cvc: "123",
    expiryMonth: "01",
    expiryYear: "2030",
  },
};

export const expectedAddress = {
  name: "***REMOVED***",
  address1: "***REMOVED***",
  address2: "***REMOVED***",
  cityStateZip: "***REMOVED***",
  country: "Canada",
  phone: "***REMOVED***",
};

export default {
  paymentTestData,
  expectedAddress,
};
