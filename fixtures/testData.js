const { faker } = require('@faker-js/faker/locale/tr');

const testData = {
  /**
   * Valid search terms that should return results
   */
  validSearchTerms: [
    'Doğal Tepkili Cam Biberon 120ml 0-3 Ay',
    'bebek bezi',
    'mama sandalyesi',
  ],

  /**
   * Generate a nonsense search term guaranteed to return no results
   */
  generateNoResultsTerm() {
    return `xyzqwerty${Date.now()}${faker.string.alphanumeric(8)}`;
  },

  /**
   * Generate an invalid phone number for negative login tests
   */
  generateInvalidPhone() {
    return `50000${faker.string.numeric(5)}`;
  },

  /**
   * Generate a random wrong password
   */
  generateWrongPassword() {
    return faker.internet.password({ length: 12 });
  },

  /**
   * Negative login test scenarios
   */
  negativeLoginScenarios: {
    wrongPassword: {
      description: 'wrong password',
    },
    unregisteredPhone: {
      description: 'unregistered phone number',
    },
    emptyPhone: {
      phone: '',
      description: 'empty phone field',
    },
  },

  /**
   * Products to use in cart tests (search terms to find them)
   */
  cartProducts: [
    'biberon',
    'emzik',
  ],
};

module.exports = testData;
