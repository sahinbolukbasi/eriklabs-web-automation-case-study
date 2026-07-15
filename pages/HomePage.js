const BasePage = require('./BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);

    // Locators — stable IDs and short CSS selectors
    this.selectors = {
      searchBox: '#txtSearchBox',
      headerLoginLink: 'cx-page-layout eb-header-login a[href*="login"]',
      headerAccountNav: 'eb-header-login',
      logo: 'a.logo, cx-page-layout a[title*="e-bebek"], a[aria-label*="e-bebek"]',
    };
  }

  async navigateToHome() {
    await this.navigate('');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickLoginLink() {
    const loginLink = this.page.locator(this.selectors.headerLoginLink).first();
    // Use force: true to bypass visibility checks if the element is inside a hidden menu
    await loginLink.click({ force: true });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async searchFor(term) {
    await this.fillInput(this.selectors.searchBox, term);
    await this.pressKey('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isSearchBoxVisible() {
    return this.isVisible(this.selectors.searchBox);
  }
}

module.exports = HomePage;
