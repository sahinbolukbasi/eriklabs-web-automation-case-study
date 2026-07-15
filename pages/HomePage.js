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
    // Geniş ve kapsayıcı bir locator listesi (A/B testleri veya farklı ekran boyutları için)
    const loginLink = this.page.locator('a[href*="/login"], #btnMyAccount, cx-page-layout eb-header-login a, .login-btn').first();
    
    // UI hatalarını maskelememek (fail-fast) için fallback ve force:true kaldırıldı.
    // Butonun ekranda gerçekten tıklanabilir (görünür) olmasını bekliyoruz.
    await loginLink.waitFor({ state: 'visible', timeout: 15000 });
    await loginLink.click();
    
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
