const config = require('../support/config');

class BasePage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    this.page = page;
    this.baseUrl = config.baseUrl;
  }

  /**
   * Navigate to a path relative to baseUrl
   * @param {string} path
   */
  async navigate(path = '') {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Click an element by locator
   * @param {string|import('playwright').Locator} selector
   */
  async clickElement(selector) {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /**
   * Fill an input field
   * @param {string} selector
   * @param {string} value
   */
  async fillInput(selector, value) {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(value);
  }

  /**
   * Get text content of an element
   * @param {string} selector
   * @returns {Promise<string>}
   */
  async getText(selector) {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent()).trim();
  }

  /**
   * Check if element is visible
   * @param {string} selector
   * @param {number} timeout
   * @returns {Promise<boolean>}
   */
  async isVisible(selector, timeout = 5000) {
    try {
      await this.page.locator(selector).waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for an element to be visible
   * @param {string} selector
   * @param {number} timeout
   */
  async waitForElement(selector, timeout) {
    await this.page.locator(selector).waitFor({
      state: 'visible',
      timeout: timeout || this.page.getDefaultTimeout?.() || 30000,
    });
  }

  /**
   * Hover over an element
   * @param {string} selector
   */
  async hover(selector) {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible' });
    await locator.hover();
  }

  /**
   * Press a keyboard key
   * @param {string} key
   */
  async pressKey(key) {
    await this.page.keyboard.press(key);
  }

  /**
   * Check if text is visible on the page
   * @param {string} text
   * @param {number} timeout
   * @returns {Promise<boolean>}
   */
  async isTextVisible(text, timeout = 10000) {
    try {
      await this.page.locator(`text=${text}`).first().waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Dismiss any overlay/popup that might block interaction
   */
  async dismissOverlays() {
    // Cookie consent
    try {
      const cookieBtn = this.page.locator('#onetrust-accept-btn-handler');
      if (await cookieBtn.isVisible({ timeout: 2000 })) {
        await cookieBtn.click();
      }
    } catch {
      // No cookie banner
    }

    // Generic close buttons for popups
    try {
      const closeBtn = this.page.locator('.modal-close, .popup-close, [aria-label="Kapat"]').first();
      if (await closeBtn.isVisible({ timeout: 1000 })) {
        await closeBtn.click();
      }
    } catch {
      // No popup
    }
  }
}

module.exports = BasePage;
