const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const CartPage = require('../pages/CartPage');
const ProductPage = require('../pages/ProductPage');
const HomePage = require('../pages/HomePage');
const SearchResultsPage = require('../pages/SearchResultsPage');

When('{string} ürünü aranıp sepete eklenir', async function (searchTerm) {
  const homePage = this.getPage(HomePage);
  const searchPage = this.getPage(SearchResultsPage);
  const productPage = this.getPage(ProductPage);

  await homePage.searchFor(searchTerm);
  await searchPage.waitForResults();
  await searchPage.clickFirstProduct();
  await productPage.addToCart();

  // Store added product info in context
  if (!this.testContext.cartProducts) this.testContext.cartProducts = [];
  const name = await productPage.getProductName();
  this.testContext.cartProducts.push({ name, searchTerm });
});

When('sepet sayfasına gidilir', async function () {
  const cartPage = this.getPage(CartPage);
  await cartPage.navigateToCart();
});

When('sepetteki {int}. ürünün adedi artırılır', async function (index) {
  const cartPage = this.getPage(CartPage);
  await cartPage.increaseItemQuantity(index - 1);
});

When('sepetteki {int}. ürün silinir', async function (index) {
  const cartPage = this.getPage(CartPage);
  await cartPage.removeItem(index - 1);
});

Then('sepette {int} ürün olduğu doğrulanır', async function (expectedCount) {
  const cartPage = this.getPage(CartPage);
  const count = await cartPage.getCartItemCount();
  expect(count).toBe(expectedCount);
});

Then('sepet ara toplamının doğru olduğu kontrol edilir', async function () {
  const cartPage = this.getPage(CartPage);
  
  const count = await cartPage.getCartItemCount();
  let calculatedTotal = 0;

  // Calculate the total by summing up (price * quantity) for all items in the cart
  for (let i = 0; i < count; i++) {
    const price = await cartPage.getItemPrice(i);
    const qty = await cartPage.getItemQuantity(i);
    calculatedTotal += (price * qty);
  }

  // Get the actual subtotal displayed on the site
  const actualSubtotal = await cartPage.getSubtotal();

  // Mathematical assertion with a small tolerance for JS floating point inaccuracies (e.g. 0.1 + 0.2 = 0.30000004)
  expect(Math.abs(actualSubtotal - calculatedTotal)).toBeLessThan(0.01);
  
  // Store for later comparison
  this.testContext.lastSubtotal = actualSubtotal;
});

Then('sepet toplamının {string} TL üzerinde olduğu doğrulanır', async function (minAmount) {
  const cartPage = this.getPage(CartPage);
  const total = await cartPage.getSubtotal();
  expect(total).toBeGreaterThan(parseFloat(minAmount));
});

When('sepet ikonuna tıklanır', async function () {
  const cartPage = this.getPage(CartPage);
  await cartPage.clickCartIcon();
});

When('ürün sepete eklenir', async function () {
  const productPage = this.getPage(ProductPage);
  await productPage.addToCart();

  const name = await productPage.getProductName();
  if (!this.testContext.cartProducts) this.testContext.cartProducts = [];
  this.testContext.cartProducts.push({ name });
});

Then('sepetin boş olmadığı doğrulanır', async function () {
  const cartPage = this.getPage(CartPage);
  const count = await cartPage.getCartItemCount();
  expect(count).toBeGreaterThan(0);
});
