const BasePage = require('./BasePage');

class AccountNavPage extends BasePage {
  constructor(page) {
    super(page);

    this.selectors = {
      // Header account/login trigger
      headerAccountTrigger: 'eb-header-login',
      headerAccountLink: 'eb-header-login a',
      // Logout link (stable ID from DOM)
      logoutLink: '#lnkSignOutNavNode',
      // User greeting in header
      userGreeting: 'eb-header-login .user-name, eb-header-login [class*="greeting"], eb-header-login span[class*="user"]',
      // Account dropdown/popup
      accountDropdown: 'eb-header-login .dropdown, eb-header-login nav, eb-header-login .account-menu',
      // Account page elements (for verifying logged-out state)
      accountPageContent: '.account-page, cx-page-layout[section*="Account"], [class*="account"]',
    };
  }

  /**
   * Hover over account nav to trigger dropdown
   */
  async hoverAccountNav() {
    await this.hover(this.selectors.headerAccountTrigger);
  }

  /**
   * Click logout link in the account dropdown
   */
  async clickLogout() {
    // First hover to open dropdown
    await this.hoverAccountNav();

    // Wait for logout link to become visible
    const logoutLink = this.page.locator(this.selectors.logoutLink);
    await logoutLink.waitFor({ state: 'visible', timeout: 5000 });
    await logoutLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Check if user is logged in by looking for user greeting
   */
  async isLoggedIn() {
    return this.isVisible(this.selectors.userGreeting, 5000);
  }

  /**
   * Check if user is logged out (guest state)
   */
  async isLoggedOut() {
    // After logout, the header should show login link instead of user name
    const hasGreeting = await this.isLoggedIn();
    return !hasGreeting;
  }

  /**
   * Navigate to account page and check if redirected to login (proving logged out)
   */
  async verifyLoggedOutByAccessingAccount() {
    await this.navigate('hesabim');
    await this.page.waitForLoadState('domcontentloaded');

    // Should be redirected to login page or see login form
    const url = this.page.url();
    const isOnLoginPage = url.includes('login') || url.includes('giris');
    const hasLoginForm = await this.isVisible('#txtPhoneNumberMobile', 5000);

    return isOnLoginPage || hasLoginForm;
  }

  async getUserName() {
    return this.getText(this.selectors.userGreeting);
  }
}

module.exports = AccountNavPage;
