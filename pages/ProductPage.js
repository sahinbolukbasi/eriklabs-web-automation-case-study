const BasePage = require('./BasePage');

class ProductPage extends BasePage {
  constructor(page) {
    super(page);

    this.selectors = {
      productName: '.product-name, h1[class*="product"], eb-product-detail h1, [class*="product-title"]',
      productPrice: '.product-price, [class*="price"] .value, eb-product-detail [class*="price"]',
      addToCartButton: '#addToCartBtn, button[class*="add-to-cart"], button[class*="addToCart"], eb-product-detail button.btn-primary',
      quantityInput: 'input[type="number"][class*="quantity"], .quantity input, eb-product-detail input[type="number"]',
      quantityIncrease: '.quantity-increase, button[aria-label*="artır"], .qty-increase, [class*="increase"]',
      quantityDecrease: '.quantity-decrease, button[aria-label*="azalt"], .qty-decrease, [class*="decrease"]',
      addToCartSuccess: '.cart-success, .added-to-cart, [class*="success"], .toast-success',
    };
  }

  async getProductName() {
    return this.getText(this.selectors.productName);
  }

  async getProductPrice() {
    return this.getText(this.selectors.productPrice);
  }

  async addToCart() {
    await this.clickElement(this.selectors.addToCartButton);
    // Wait for cart update feedback
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async setQuantity(quantity) {
    const input = this.page.locator(this.selectors.quantityInput).first();
    await input.waitFor({ state: 'visible' });
    await input.clear();
    await input.fill(String(quantity));
  }

  async increaseQuantity() {
    await this.clickElement(this.selectors.quantityIncrease);
  }

  async decreaseQuantity() {
    await this.clickElement(this.selectors.quantityDecrease);
  }
}

module.exports = ProductPage;
