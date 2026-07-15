const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const testData = require('../fixtures/testData');

When('telefon numarası girilir', async function () {
  const loginPage = this.getPage(LoginPage);
  await loginPage.enterPhone();
});

When('şifre girilir', async function () {
  const loginPage = this.getPage(LoginPage);
  await loginPage.enterPassword();
});

Given('API üzerinden giriş yapılıp oturum arayüze aktarılır', async function () {
  const ApiHelper = require('../support/apiHelper');
  const api = new ApiHelper(this.config.baseUrl, this.config.api.clientAuthorization);
  
  const phone = this.config.credentials.phone;
  const password = this.config.credentials.password;
  
  // API oturum alınamazsa senaryo başarısız olur; mock token gerçek login sonucu değildir.
  const token = await api.loginViaApi(phone, password);

  // 2. Go to the domain first so we can set localStorage
  await this.page.goto(this.config.baseUrl);
  
  // 3. Inject token into browser's localStorage
  const injectionScript = api.generateLocalStorageInjectionScript(token);
  await this.page.evaluate(injectionScript);
  
  // 4. Reload page to apply the session
  await this.page.reload();
  await this.page.waitForLoadState('domcontentloaded');
});

When('{string} telefon numarası girilir', async function (phone) {
  const loginPage = this.getPage(LoginPage);
  await loginPage.enterPhone(testData.resolvePhone(phone, this.config.credentials));
});

When('{string} şifresi girilir', async function (password) {
  const loginPage = this.getPage(LoginPage);
  await loginPage.enterPassword(testData.resolvePassword(password, this.config.credentials));
});

When('{string} şifresi, alan görünürse girilir', async function (password) {
  const loginPage = this.getPage(LoginPage);
  if (await loginPage.isPasswordFieldVisible()) {
    await loginPage.enterPassword(testData.resolvePassword(password, this.config.credentials));
  }
});

When('giriş butonu, alan görünürse tıklanır', async function () {
  const loginPage = this.getPage(LoginPage);
  if (await loginPage.isPasswordFieldVisible()) {
    await loginPage.submitLoginForm();
  }
});

Then('{string} hata mesajının görünür olduğu doğrulanır', async function (errorType) {
  const loginPage = this.getPage(LoginPage);
  const error = loginPage.getErrorLocator(errorType);
  await expect(error).toBeVisible();
  expect((await error.textContent())?.trim()).not.toBe('');
});
