const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const AccountNavPage = require('../pages/AccountNavPage');

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
