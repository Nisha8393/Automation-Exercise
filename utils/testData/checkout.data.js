/**
 * Checkout & Payment Test Data
 * Data for checkout address verification and payment tests
 */

export const paymentTestData = {
  valid: {
    nameOnCard: "Nisha Shrestha",
    cardNumber: "4100000000000",
    cvc: "123",
    expiryMonth: "01",
    expiryYear: "2030",
  },
};

export const expectedAddress = {
  name: "Mrs. Nisha Shrestha",
  address1: "316-2485 Eglinton Ave W",
  address2: "Unit 316",
  cityStateZip: "Mississauga ON L5M 2T1",
  country: "Canada",
  phone: "4167228393",
};

export default {
  paymentTestData,
  expectedAddress,
};
