const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const HomePage = require('../pages/HomePage');
const AccountNavPage = require('../pages/AccountNavPage');

When('header giriş linkine tıklanır', async function () {
  const homePage = this.getPage(HomePage);
  await homePage.clickLoginLink();
});

When('telefon numarası girilir', async function () {
  const loginPage = this.getPage(LoginPage);
  await loginPage.enterPhone();
});

When('devam butonuna tıklanır', async function () {
  const loginPage = this.getPage(LoginPage);
  await loginPage.clickContinue();
});

When('şifre girilir', async function () {
  const loginPage = this.getPage(LoginPage);
  await loginPage.enterPassword();
});

When('giriş butonuna tıklanır', async function () {
  const loginPage = this.getPage(LoginPage);
  await loginPage.submitLoginForm();
});

When('{string} telefon numarası girilir', async function (phone) {
  const loginPage = this.getPage(LoginPage);
  await loginPage.enterPhone(phone);
});

When('{string} şifresi girilir', async function (password) {
  const loginPage = this.getPage(LoginPage);
  await loginPage.enterPassword(password);
});

Then('kullanıcı adının görünür olduğu doğrulanır', async function () {
  const accountNav = this.getPage(AccountNavPage);
  const isVisible = await accountNav.isLoggedIn();
  expect(isVisible).toBeTruthy();
});

Then('hata mesajının görünür olduğu doğrulanır', async function () {
  const loginPage = this.getPage(LoginPage);
  const isVisible = await loginPage.isErrorVisible();
  expect(isVisible).toBeTruthy();
});

Then('şifre alanının görünür olduğu doğrulanır', async function () {
  const loginPage = this.getPage(LoginPage);
  const isVisible = await loginPage.isPasswordFieldVisible();
  expect(isVisible).toBeTruthy();
});

Then('telefon hata mesajının görünür olduğu doğrulanır', async function () {
  const loginPage = this.getPage(LoginPage);
  const isVisible = await loginPage.isPhoneErrorVisible();
  expect(isVisible).toBeTruthy();
});

When('tam login akışı gerçekleştirilir', async function () {
  const homePage = this.getPage(HomePage);
  const loginPage = this.getPage(LoginPage);

  await homePage.navigateToHome();
  await homePage.clickLoginLink();
  await loginPage.enterPhone();
  await loginPage.clickContinue();
  await loginPage.enterPassword();
  await loginPage.submitLoginForm();
});
