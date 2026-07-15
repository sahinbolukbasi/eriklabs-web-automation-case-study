const BasePage = require('./BasePage');

class SearchResultsPage extends BasePage {
  constructor(page) {
    super(page);

    // Locators — stable IDs from the DOM
    this.selectors = {
      resultsContainer: '#pl-page-1',
      productItems: '#pl-page-1 eb-product-list-item',
      productTitle: '.product-name, .product-title, a[class*="name"], eb-product-list-item a',
      noResultsMessage: '.no-results, .empty-results, [class*="no-result"], [class*="empty"]',
      resultCount: '.result-count, .product-count, [class*="count"]',
    };
  }

  async waitForResults(timeout = 15000) {
    await this.page.locator(this.selectors.resultsContainer).waitFor({ state: 'visible', timeout });
  }

  async getProductCount() {
    await this.waitForResults();
    return this.page.locator(this.selectors.productItems).count();
  }

  async getProductTitles() {
    await this.waitForResults();
    const items = this.page.locator(this.selectors.productItems);
    const count = await items.count();
    const titles = [];
    for (let i = 0; i < count; i++) {
      const titleEl = items.nth(i).locator(this.selectors.productTitle).first();
      const text = await titleEl.textContent();
      if (text) titles.push(text.trim());
    }
    return titles;
  }

  /**
   * Verify that product titles contain at least one keyword from the search term
   * @param {string} searchTerm
   * @returns {Promise<boolean>}
   */
  async verifyResultsMatchSearch(searchTerm) {
    const titles = await this.getProductTitles();
    if (titles.length === 0) return false;

    // Extract keywords (3+ chars) from search term
    const keywords = searchTerm
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length >= 3);

    // At least some products should contain at least one keyword
    const matchingProducts = titles.filter(title => {
      const lowerTitle = title.toLowerCase();
      return keywords.some(keyword => lowerTitle.includes(keyword));
    });

    return matchingProducts.length > 0;
  }

  async isNoResultsVisible(timeout = 5000) {
    return this.isVisible(this.selectors.noResultsMessage, timeout);
  }

  async getNoResultsMessage() {
    return this.getText(this.selectors.noResultsMessage);
  }

  async clickFirstProduct() {
    const firstItem = this.page.locator(this.selectors.productItems).first();
    await firstItem.waitFor({ state: 'visible' });
    const link = firstItem.locator('a').first();
    await link.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = SearchResultsPage;
