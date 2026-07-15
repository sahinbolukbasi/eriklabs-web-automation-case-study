const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const CartPage = require('../pages/CartPage');
const AccountNavPage = require('../pages/AccountNavPage');

// ─── Navigation ───

Given('{string} sayfasına gidilir', async function (pageName) {
  const paths = {
    'ana sayfa': '',
    'login': 'login',
    'giris': 'login',
    'sepetim': 'sepetim',
    'hesabim': 'hesabim',
  };
  const path = paths[pageName.toLowerCase()] ?? pageName;
  const homePage = this.getPage(HomePage);
  await homePage.navigate(path);
});

// ─── Click ───

When('{string} elementine tıklanır', async function (elementKey) {
  const elementMap = {
    'header giriş linki': async () => {
      const homePage = this.getPage(HomePage);
      await homePage.clickLoginLink();
    },
    'devam butonu': async () => {
      const loginPage = this.getPage(LoginPage);
      await loginPage.clickContinue();
    },
    'giriş butonu': async () => {
      const loginPage = this.getPage(LoginPage);
      await loginPage.clickLogin();
    },
    'çıkış linki': async () => {
      const accountNav = this.getPage(AccountNavPage);
      await accountNav.clickLogout();
    },
    'sepet ikonu': async () => {
      const cartPage = this.getPage(CartPage);
      await cartPage.clickCartIcon();
    },
    'ilk ürün': async () => {
      const searchPage = this.getPage(SearchResultsPage);
      await searchPage.clickFirstProduct();
    },
  };

  const action = elementMap[elementKey.toLowerCase()];
  if (action) {
    await action();
  } else {
    // Fallback: treat as CSS selector
    await this.page.locator(elementKey).first().click();
  }
});

// ─── Text Input ───

When('{string} input alanına {string} yazılır', async function (fieldKey, value) {
  const fieldMap = {
    'telefon': () => this.getPage(LoginPage).selectors.phoneInput,
    'şifre': () => this.getPage(LoginPage).selectors.passwordInput,
    'arama': () => this.getPage(HomePage).selectors.searchBox,
    'arama kutusu': () => this.getPage(HomePage).selectors.searchBox,
  };

  const selectorFn = fieldMap[fieldKey.toLowerCase()];
  const selector = selectorFn ? selectorFn() : fieldKey;

  // Replace env variable placeholders
  let finalValue = value;
  if (value === 'ENV_PHONE') finalValue = this.config.credentials.phone;
  if (value === 'ENV_PASSWORD') finalValue = this.config.credentials.password;

  const locator = this.page.locator(selector);
  await locator.waitFor({ state: 'visible' });
  await locator.clear();
  await locator.fill(finalValue);
});

// ─── Text Visibility ───

Then('{string} metninin görünür olduğu kontrol edilir', async function (text) {
  const locator = this.page.locator(`text=${text}`).first();
  await expect(locator).toBeVisible({ timeout: 10000 });
});

// ─── Element Visibility ───

Then('{string} elementinin görünür olduğu kontrol edilir', async function (elementKey) {
  const elementMap = {
    'kullanıcı adı': () => this.getPage(AccountNavPage).selectors.userGreeting,
    'şifre alanı': () => this.getPage(LoginPage).selectors.passwordInput,
    'arama sonuçları': () => this.getPage(SearchResultsPage).selectors.resultsContainer,
    'boş sepet mesajı': () => this.getPage(CartPage).selectors.emptyCartMessage,
  };

  const selectorFn = elementMap[elementKey.toLowerCase()];
  const selector = selectorFn ? selectorFn() : elementKey;

  await expect(this.page.locator(selector).first()).toBeVisible({ timeout: 10000 });
});

Then('{string} elementinin görünür olmadığı kontrol edilir', async function (elementKey) {
  const elementMap = {
    'kullanıcı adı': () => this.getPage(AccountNavPage).selectors.userGreeting,
  };

  const selectorFn = elementMap[elementKey.toLowerCase()];
  const selector = selectorFn ? selectorFn() : elementKey;

  await expect(this.page.locator(selector).first()).not.toBeVisible({ timeout: 10000 });
});

// ─── Keyboard ───

When('{string} tuşuna basılır', async function (key) {
  await this.page.keyboard.press(key);
});

// ─── Hover ───

When('{string} elementine hover yapılır', async function (elementKey) {
  const elementMap = {
    'hesap menüsü': () => this.getPage(AccountNavPage).selectors.headerAccountTrigger,
  };

  const selectorFn = elementMap[elementKey.toLowerCase()];
  const selector = selectorFn ? selectorFn() : elementKey;

  const locator = this.page.locator(selector).first();
  await locator.waitFor({ state: 'visible' });
  await locator.hover();
});

// ─── URL Check ───

Then("sayfa URL'inin {string} içerdiği kontrol edilir", async function (expectedPart) {
  await expect(this.page).toHaveURL(new RegExp(expectedPart), { timeout: 10000 });
});
