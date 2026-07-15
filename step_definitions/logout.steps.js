const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const AccountNavPage = require('../pages/AccountNavPage');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');

When('çıkış yapılır', async function () {
  const accountNav = this.getPage(AccountNavPage);
  await accountNav.clickLogout();
});

Then('oturumun sonlandığı doğrulanır', async function () {
  const accountNav = this.getPage(AccountNavPage);

  // Verify by checking the account page redirects to login
  const redirectedToLogin = await accountNav.verifyLoggedOutByAccessingAccount();
  expect(redirectedToLogin).toBeTruthy();
});

Then('misafir durumuna dönüldüğü doğrulanır', async function () {
  const accountNav = this.getPage(AccountNavPage);
  const isLoggedOut = await accountNav.isLoggedOut();
  expect(isLoggedOut).toBeTruthy();
});
