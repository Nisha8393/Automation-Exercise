const { expect } = require("@playwright/test");

export default class NetworkHelper {
  constructor(page) {
    this.page = page;
  }

  /**
   * Waits for a request and asserts the response status
   * @param {string} method - HTTP method (GET, POST, etc.)
   * @param {string} endpointSubstring - part of the URL to match
   * @param {number} expectedStatus - expected HTTP status code
   */
  async waitForApi(method, endpointSubstring, expectedStatus = 200) {
    const response = await this.page.waitForResponse(
      //(resp) => resp.url().includes(endpointSubstring) && resp.status() === 200
      (resp) =>
        resp.url().includes(endpointSubstring) &&
        resp.request().method() === method &&
        resp.status() === expectedStatus
    );

    const status = response.status();
    try {
      expect(status).toBe(expectedStatus);
      // console.log(`${method} ${endpointSubstring} returned ${status}`);
    } catch (err) {
      console.error(`${method} ${endpointSubstring} returned ${status}`);
      throw err;
    }

    return { response };
  }
}
