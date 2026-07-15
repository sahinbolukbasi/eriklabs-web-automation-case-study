const { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { ContentType } = require('allure-js-commons');

// Playwright browser launch and cookie dismissal can take more than 5 seconds
setDefaultTimeout(60 * 1000);

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
  const videoPath = this.page ? await this.page.video()?.path() : null;

  // On failure: capture screenshot, trace, and keep video
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

  // retain-on-failure: delete video for passing scenarios
  if (scenario.result?.status !== Status.FAILED && videoPath) {
    const fs = require('fs');
    try {
      // Small delay to let Playwright finish writing the video file
      await new Promise(resolve => setTimeout(resolve, 500));
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    } catch {
      // Video cleanup is best-effort
    }
  }
});
