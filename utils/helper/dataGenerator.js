/**
 * Data Generator Utility
 * Generates dynamic test data for automation tests
 */

export class DataGenerator {
  /**
   * Generate a unique email address
   * @param {string} prefix - Email prefix (default: 'testuser')
   * @returns {string} Unique email address
   */
  static generateEmail(prefix = "testuser") {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}_${timestamp}_${random}@testmail.com`;
  }

  /**
   * Generate a unique username
   * @param {string} prefix - Username prefix (default: 'User')
   * @returns {string} Unique username
   */
  static generateUsername(prefix = "User") {
    const timestamp = Date.now();
    return `${prefix}_${timestamp}`;
  }

  /**
   * Generate a random password
   * @param {number} length - Password length (default: 12)
   * @returns {string} Random password
   */
  static generatePassword(length = 12) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Generate a random phone number
   * @returns {string} Random phone number
   */
  static generatePhone() {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const firstPart = Math.floor(Math.random() * 900) + 100;
    const secondPart = Math.floor(Math.random() * 9000) + 1000;
    return `${areaCode}${firstPart}${secondPart}`;
  }

  /**
   * Get a random item from an array
   * @param {Array} array - Array to pick from
   * @returns {*} Random item
   */
  static getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate random date of birth
   * @param {number} minAge - Minimum age (default: 18)
   * @param {number} maxAge - Maximum age (default: 60)
   * @returns {Object} Object with day, month, year
   */
  static generateDateOfBirth(minAge = 18, maxAge = 60) {
    const currentYear = new Date().getFullYear();
    const year = currentYear - Math.floor(Math.random() * (maxAge - minAge + 1)) - minAge;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;

    return {
      day: day.toString(),
      month: month.toString(),
      year: year.toString(),
    };
  }

  /**
   * Generate a complete user registration data
   * @returns {Object} Complete user data for registration
   */
  static generateUserData() {
    const firstName = this.getRandomItem([
      "John", "Jane", "Michael", "Sarah", "David", "Emma", "Robert", "Lisa"
    ]);
    const lastName = this.getRandomItem([
      "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"
    ]);
    const dob = this.generateDateOfBirth();

    return {
      title: this.getRandomItem(["Mr", "Mrs"]),
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email: this.generateEmail(firstName.toLowerCase()),
      password: this.generatePassword(),
      dateOfBirth: dob,
      newsletter: Math.random() > 0.5,
      specialOffers: Math.random() > 0.5,
      company: this.getRandomItem(["TechCorp", "DataSoft", "CloudNet", "WebDev Inc", ""]),
      address: `${Math.floor(Math.random() * 9999) + 1} ${this.getRandomItem(["Main St", "Oak Ave", "Elm Rd", "Park Blvd"])}`,
      address2: Math.random() > 0.5 ? `Apt ${Math.floor(Math.random() * 100) + 1}` : "",
      country: this.getRandomItem(["India", "United States", "Canada", "Australia", "Israel", "New Zealand", "Singapore"]),
      state: this.getRandomItem(["California", "New York", "Texas", "Florida", "Maharashtra"]),
      city: this.getRandomItem(["Los Angeles", "New York", "Houston", "Miami", "Mumbai"]),
      zipcode: (Math.floor(Math.random() * 90000) + 10000).toString(),
      mobileNumber: this.generatePhone(),
    };
  }
}

export default DataGenerator;
