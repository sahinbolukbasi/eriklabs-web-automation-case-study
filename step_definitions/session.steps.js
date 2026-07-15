const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const CartPage = require('../pages/CartPage');
const HomePage = require('../pages/HomePage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const ProductPage = require('../pages/ProductPage');
const testData = require('../fixtures/testData');

Given('misafir olarak bir ürün sepete eklenir', async function () {
  const homePage = this.getPage(HomePage);
  const searchPage = this.getPage(SearchResultsPage);
  const productPage = this.getPage(ProductPage);

  await homePage.navigateToHome();
  await homePage.searchFor(testData.resolveSearchTerm('CART_PRODUCT_ONE'));
  await searchPage.waitForResults();
  await searchPage.clickFirstProduct();
  await productPage.addToCart();

  // Store the product name in context
  const name = await productPage.getProductName();
  this.testContext.guestCartProduct = name;
  this.testContext.guestCartCount = 1;
});

Then('sepetin korunduğu doğrulanır', async function () {
  const cartPage = this.getPage(CartPage);
  await cartPage.navigateToCart();

  const count = await cartPage.getCartItemCount();
  expect(count).toBeGreaterThanOrEqual(this.testContext.guestCartCount || 1);
});
