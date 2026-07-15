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
      errorMessage: '.error-message, .alert-danger, eb-login .error, .form-error, [class*="error"]',
      userGreeting: 'eb-header-login .user-name, eb-header-login [class*="greeting"], eb-header-login span',
      phoneError: 'eb-login-username .error-message, eb-login-username [class*="error"]',
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

  async getErrorMessage() {
    try {
      const errorLocator = this.page.locator(this.selectors.errorMessage).first();
      await errorLocator.waitFor({ state: 'visible', timeout: 5000 });
      return (await errorLocator.textContent()).trim();
    } catch {
      return '';
    }
  }

  async isErrorVisible() {
    return this.isVisible(this.selectors.errorMessage, 5000);
  }

  async isPhoneErrorVisible() {
    return this.isVisible(this.selectors.phoneError, 5000);
  }

  async isPasswordFieldVisible() {
    return this.isVisible(this.selectors.passwordInput, 10000);
  }

  async isUserGreetingVisible() {
    return this.isVisible(this.selectors.userGreeting, 15000);
  }

  async getUserGreetingText() {
    return this.getText(this.selectors.userGreeting);
  }
}

module.exports = LoginPage;
