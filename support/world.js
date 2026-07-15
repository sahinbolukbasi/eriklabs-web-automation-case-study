const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const config = require('./config');

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.config = config;
    this.testContext = {}; // Shared state within a scenario (e.g., cart items)
  }

  async openBrowser() {
    this.browser = await chromium.launch({
      headless: this.config.browser.headless,
      slowMo: this.config.browser.slowMo,
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1440, height: 900 },
      locale: 'tr-TR',
    });
    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(this.config.browser.timeout);
  }

  async closeBrowser() {
    if (this.page) await this.page.close().catch(() => {});
    if (this.context) await this.context.close().catch(() => {});
    if (this.browser) await this.browser.close().catch(() => {});
  }

  /**
   * Get a page object by name. Lazy-initialized and cached.
   */
  getPage(PageClass) {
    const name = PageClass.name;
    if (!this._pages) this._pages = {};
    if (!this._pages[name]) {
      this._pages[name] = new PageClass(this.page);
    }
    return this._pages[name];
  }
}

setWorldConstructor(CustomWorld);

module.exports = CustomWorld;
