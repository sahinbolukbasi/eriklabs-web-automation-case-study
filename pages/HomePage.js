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
    try {
      // Daha geniş ve kapsayıcı bir locator listesi
      const loginLink = this.page.locator('a[href*="/login"], #btnMyAccount, cx-page-layout eb-header-login a, .login-btn').first();
      // UI üzerinden tıklamayı 5 saniye dener (responsive menü vb. sorunlar varsa zorlar)
      await loginLink.click({ force: true, timeout: 5000 });
    } catch (e) {
      console.warn('UI Login butonu bulunamadı veya tıklanamadı. Direkt /login sayfasına gidiliyor (Fallback)...');
      await this.navigate('login');
    }
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
