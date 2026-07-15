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
      args: ['--disable-blink-features=AutomationControlled'],
    });
    const fs = require('fs');
    const path = require('path');
    const statePath = path.join(__dirname, '..', 'state.json');
    const contextOptions = {
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
    };

    // Güvenilir oturum (Cookie/LocalStorage) varsa Playwright'a enjekte et
    if (fs.existsSync(statePath)) {
      contextOptions.storageState = statePath;
    }

    this.context = await this.browser.newContext(contextOptions);
    this.page = await this.context.newPage();
    
    // Advanced Bot Protection Evasion (Stealth Mode)
    await this.page.addInitScript(() => {
      // 1. Remove webdriver property
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      
      // 2. Mock languages
      Object.defineProperty(navigator, 'languages', { get: () => ['tr-TR', 'tr', 'en-US', 'en'] });
      
      // 3. Mock plugins (bots usually have 0 plugins)
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      
      // 4. Mock window.chrome (essential for Chrome spoofing)
      window.chrome = {
        app: { isInstalled: false },
        runtime: { PlatformOs: 'mac', PlatformArch: 'x86-64' }
      };

      // 5. Mock WebGL fingerprinting
      const getParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function(parameter) {
        if (parameter === 37445) return 'Intel Inc.'; // UNMASKED_VENDOR_WEBGL
        if (parameter === 37446) return 'Intel Iris OpenGL Engine'; // UNMASKED_RENDERER_WEBGL
        return getParameter.call(this, parameter);
      };
      
      // 6. Fix permissions API (Headless Chrome usually denies notifications)
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: Notification.permission }) :
          originalQuery(parameters)
      );
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
