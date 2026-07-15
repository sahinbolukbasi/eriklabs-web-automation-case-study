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

  cartProducts: [
    'biberon',
    'emzik',
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

  resolvePhone(value, credentials) {
    if (value === 'ENV_PHONE') return credentials.phone;
    if (value === 'UNREGISTERED_PHONE') return this.generateInvalidPhone();
    if (value === 'EMPTY') return '';
    return value;
  },

  resolvePassword(value, credentials) {
    if (value === 'ENV_PASSWORD') return credentials.password;
    if (value === 'INVALID_PASSWORD') return this.generateWrongPassword();
    if (value === 'EMPTY') return '';
    return value;
  },

  resolveSearchTerm(value) {
    if (value === 'SEARCH_PRODUCT') return this.validSearchTerms[0];
    if (value === 'NO_RESULT_TERM') return this.generateNoResultsTerm();
    if (value === 'CART_PRODUCT_ONE') return this.cartProducts[0];
    if (value === 'CART_PRODUCT_TWO') return this.cartProducts[1];
    return value;
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

};

module.exports = testData;
