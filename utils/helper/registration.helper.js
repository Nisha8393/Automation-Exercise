/**
 * Registration Helper
 * Creates a throwaway account so tests that assert on saved account data can
 * compare against what they entered, rather than a shared account's state.
 */
import { expect } from "@playwright/test";
import DataGenerator from "./dataGenerator.js";

/**
 * Register a new account with generated data and leave the browser logged in.
 * @returns {Object} the data the account was created with
 */
export async function registerNewUser({
  header,
  loginPage,
  registerPage,
  accountCreatedPage,
}) {
  const user = DataGenerator.generateUserData();

  await header.clickLoginSignup();
  await loginPage.signup(user.name, user.email);

  await registerPage.selectTitle(user.title);
  await registerPage.fillAccountInfo({
    name: user.name,
    password: user.password,
    day: user.dateOfBirth.day,
    month: user.dateOfBirth.month,
    year: user.dateOfBirth.year,
  });
  await registerPage.fillAddressInfo({
    firstName: user.firstName,
    lastName: user.lastName,
    company: user.company,
    address1: user.address,
    address2: user.address2,
    country: user.country,
    state: user.state,
    city: user.city,
    zipcode: user.zipcode,
    mobileNumber: user.mobileNumber,
  });
  await registerPage.clickCreateAccount();

  expect(await accountCreatedPage.isAccountCreated()).toBe(true);
  await accountCreatedPage.clickContinue();
  await expect(header.loggedInUserText(user.name)).toBeVisible();

  return user;
}

/**
 * The address the site renders for an account, in the shape the checkout
 * page object asserts against.
 * @param {Object} user - data returned by registerNewUser
 */
export function addressOf(user) {
  return {
    name: `${user.title}. ${user.firstName} ${user.lastName}`,
    cityStateZip: `${user.city} ${user.state} ${user.zipcode}`,
    country: user.country,
    phone: user.mobileNumber,
  };
}

export default { registerNewUser, addressOf };
