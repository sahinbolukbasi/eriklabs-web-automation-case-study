const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const SearchResultsPage = require('../pages/SearchResultsPage');

When('{string} terimi aranır', async function (searchTerm) {
  const homePage = this.getPage(HomePage);
  await homePage.searchFor(searchTerm);
  this.testContext.lastSearchTerm = searchTerm;
});

Then('arama sonuçlarının görüntülendiği doğrulanır', async function () {
  const searchPage = this.getPage(SearchResultsPage);
  await searchPage.waitForResults();
  const count = await searchPage.getProductCount();
  expect(count).toBeGreaterThan(0);
});

Then('arama sonuçlarının arama terimiyle ilişkili olduğu doğrulanır', async function () {
  const searchPage = this.getPage(SearchResultsPage);
  const searchTerm = this.testContext.lastSearchTerm;
  const isRelevant = await searchPage.verifyResultsMatchSearch(searchTerm);
  expect(isRelevant).toBeTruthy();
});

Then('sonuç bulunamadı mesajının görüntülendiği doğrulanır', async function () {
  const searchPage = this.getPage(SearchResultsPage);
  const isVisible = await searchPage.isNoResultsVisible(10000);
  expect(isVisible).toBeTruthy();
});

Then('ilk ürüne tıklanır', async function () {
  const searchPage = this.getPage(SearchResultsPage);
  await searchPage.clickFirstProduct();
});
