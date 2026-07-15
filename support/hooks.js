const { Before, After, BeforeAll, AfterAll, Status } = require('@cucumber/cucumber');
const { ContentType } = require('allure-js-commons');

Before(async function (scenario) {
  await this.openBrowser();

  // Start tracing for debugging on failure
  await this.context.tracing.start({ screenshots: true, snapshots: true });

  // Dismiss cookie banner if it appears
  try {
    const cookieBtn = this.page.locator('#onetrust-accept-btn-handler');
    await cookieBtn.waitFor({ state: 'visible', timeout: 5000 });
    await cookieBtn.click();
  } catch {
    // Cookie banner may not appear — that's fine
  }
});

After(async function (scenario) {
  // On failure: capture screenshot and attach to Allure
  if (scenario.result?.status === Status.FAILED) {
    try {
      const screenshot = await this.page.screenshot({ fullPage: true });
      await this.attach(screenshot, 'image/png');

      // Save trace for debugging
      const tracePath = `traces/${scenario.pickle.name.replace(/\s+/g, '_')}_${Date.now()}.zip`;
      await this.context.tracing.stop({ path: tracePath });
    } catch (err) {
      // Screenshot/trace might fail if browser already crashed
      console.error('Failed to capture failure artifacts:', err.message);
    }
  } else {
    await this.context.tracing.stop().catch(() => {});
  }

  await this.closeBrowser();
});
