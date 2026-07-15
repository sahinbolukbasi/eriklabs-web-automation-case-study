const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);
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
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      extraHTTPHeaders: {
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Upgrade-Insecure-Requests': '1',
      },
      recordVideo: {
        dir: 'videos/',
        size: { width: 1440, height: 900 },
      },
    });
    this.page = await this.context.newPage();
    
    // Cloudflare/Bot protection bypass script injection (hide webdriver)
    await this.page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });
    
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
