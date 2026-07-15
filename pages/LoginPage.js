const BasePage = require('./BasePage');
const config = require('../support/config');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    // Locators — using stable IDs from the DOM
    this.selectors = {
      phoneInput: '#txtPhoneNumberMobile',
      passwordInput: '#txtPassword',
      continueButton: 'eb-login-username form button[type="submit"], eb-login-username form button',
      loginSubmitButton: 'eb-login-password form button[type="submit"], eb-login-password form button',
      authenticationError: 'eb-login-password .error-message, eb-login-password .alert-danger, eb-login-password [role="alert"], eb-login-password [class*="error"]',
      phoneError: 'eb-login-username .error-message, eb-login-username .invalid-feedback, eb-login-username [role="alert"], eb-login-username [class*="error"]',
    };
  }

  async navigateToLogin() {
    await this.navigate('login');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async enterPhone(phone) {
    if (phone === undefined || phone === null) {
      phone = config.credentials.phone;
    }
    await this.fillInput(this.selectors.phoneInput, phone);
  }

  async clickContinue() {
    const btn = this.page.locator(this.selectors.continueButton).first();
    await btn.waitFor({ state: 'visible' });
    await btn.click();
  }

  async enterPassword(password) {
    if (password === undefined || password === null) {
      password = config.credentials.password;
    }
    // Wait for password field to appear (page transition after phone step)
    await this.page.locator(this.selectors.passwordInput).waitFor({ state: 'visible', timeout: 10000 });
    await this.fillInput(this.selectors.passwordInput, password);
  }

  async clickLogin() {
    const btn = this.page.locator(this.selectors.loginSubmitButton).first();
    await btn.waitFor({ state: 'visible' });
    await btn.click();
  }

  async submitLoginForm() {
    await this.clickLogin();
    // Wait for navigation after login
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Full login flow: phone → continue → password → submit
   */
  async performLogin(phone, password) {
    await this.enterPhone(phone);
    await this.clickContinue();
    await this.enterPassword(password);
    await this.submitLoginForm();
  }

  getErrorLocator(errorType) {
    if (errorType === 'telefon hata mesajı') {
      return this.page.locator(this.selectors.phoneError).first();
    }
    if (errorType === 'giriş hata mesajı') {
      return this.page.locator(this.selectors.authenticationError).first();
    }
    throw new Error(`Bilinmeyen login hata türü: ${errorType}`);
  }

  async isPasswordFieldVisible() {
    return this.isVisible(this.selectors.passwordInput, 10000);
  }

}

module.exports = LoginPage;
