const BasePage = require('./BasePage');
const { parsePrice } = require('../support/priceParser');

class CartPage extends BasePage {
  constructor(page) {
    super(page);

    this.selectors = {
      cartContainer: 'eb-cart, cx-page-layout[section="CartPageTemplate"], .cart-page',
      cartItems: '.cart-item, eb-cart-item, cx-cart-item, [class*="cart-entry"], [class*="cart-item"]',
      itemName: '.cart-item-name, .product-name, [class*="item-name"], a[class*="name"]',
      itemPrice: '.cart-item-price, [class*="item-price"], [class*="price"]',
      itemQuantityInput: 'input[type="number"], .quantity input',
      itemQuantityIncrease: '.qty-increase, [class*="increase"], button[aria-label*="artır"]',
      itemQuantityDecrease: '.qty-decrease, [class*="decrease"], button[aria-label*="azalt"]',
      removeButton: '.remove-btn, button[class*="remove"], [aria-label*="Sil"], [aria-label*="Kaldır"], button[class*="delete"]',
      subtotal: '.cart-subtotal, .order-summary [class*="subtotal"], [class*="sub-total"], .summary [class*="total"]',
      cartTotal: '.cart-total, .order-total, [class*="grand-total"], .summary .total',
      emptyCartMessage: '.empty-cart, [class*="empty"], [class*="boş"]',
      cartIcon: '#miniCartBtn, .mini-cart, [class*="cart-icon"], eb-mini-cart a, cx-page-slot eb-mini-cart',
      cartItemCount: '.cart-count, .cart-badge, eb-mini-cart .count, [class*="cart-count"]',
    };
  }

  async navigateToCart() {
    await this.navigate('sepetim');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickCartIcon() {
    await this.clickElement(this.selectors.cartIcon);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getCartItemCount() {
    return this.page.locator(this.selectors.cartItems).count();
  }

  async getCartItemNames() {
    const items = this.page.locator(this.selectors.cartItems);
    const count = await items.count();
    const names = [];
    for (let i = 0; i < count; i++) {
      const nameEl = items.nth(i).locator(this.selectors.itemName).first();
      const text = await nameEl.textContent();
      if (text) names.push(text.trim());
    }
    return names;
  }

  async getSubtotal() {
    const text = await this.getText(this.selectors.subtotal);
    return parsePrice(text);
  }

  async getCartTotal() {
    const text = await this.getText(this.selectors.cartTotal);
    return parsePrice(text);
  }

  /**
   * Increase quantity of the nth cart item (0-indexed)
   */
  async increaseItemQuantity(index = 0) {
    const item = this.page.locator(this.selectors.cartItems).nth(index);
    const increaseBtn = item.locator(this.selectors.itemQuantityIncrease).first();
    await increaseBtn.waitFor({ state: 'visible' });
    await increaseBtn.click();
    // Wait for cart recalculation
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /**
   * Remove the nth cart item (0-indexed)
   */
  async removeItem(index = 0) {
    const item = this.page.locator(this.selectors.cartItems).nth(index);
    const removeBtn = item.locator(this.selectors.removeButton).first();
    await removeBtn.waitFor({ state: 'visible' });
    await removeBtn.click();
    // Wait for cart update
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /**
   * Get item quantity for the nth cart item
   */
  async getItemQuantity(index = 0) {
    const item = this.page.locator(this.selectors.cartItems).nth(index);
    const input = item.locator(this.selectors.itemQuantityInput).first();
    const value = await input.inputValue();
    return parseInt(value, 10);
  }

  /**
   * Get individual item price for the nth cart item
   */
  async getItemPrice(index = 0) {
    const item = this.page.locator(this.selectors.cartItems).nth(index);
    const priceEl = item.locator(this.selectors.itemPrice).first();
    const text = await priceEl.textContent();
    return parsePrice(text.trim());
  }

  async isCartEmpty() {
    return this.isVisible(this.selectors.emptyCartMessage, 5000);
  }

  async getCartBadgeCount() {
    try {
      const badge = this.page.locator(this.selectors.cartItemCount).first();
      const text = await badge.textContent();
      return parseInt(text.trim(), 10) || 0;
    } catch {
      return 0;
    }
  }
}

module.exports = CartPage;
