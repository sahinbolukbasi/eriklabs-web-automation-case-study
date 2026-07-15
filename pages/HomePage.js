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
    const candidates = this.page.locator(
      'a[href*="/login"], #btnMyAccount, cx-page-layout eb-header-login a, .login-btn',
    );

    // Birden çok responsive/A-B varyantı içinden görünür olanı seç; ilk gizli
    // eşleşmenin testi bloke etmesine veya URL fallback'inin UI hatasını gizlemesine izin verme.
    for (let index = 0; index < await candidates.count(); index += 1) {
      const candidate = candidates.nth(index);
      if (await candidate.isVisible()) {
        await candidate.click();
        await this.page.waitForLoadState('domcontentloaded');
        return;
      }
    }

    throw new Error('Görünür bir header giriş bağlantısı bulunamadı.');
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
