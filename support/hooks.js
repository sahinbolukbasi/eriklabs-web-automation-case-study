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
  let tracePath = null;

  // On failure: capture screenshot and stop trace BEFORE closing browser
  if (scenario.result?.status === Status.FAILED) {
    try {
      const screenshot = await this.page.screenshot({ fullPage: true });
      await this.attach(screenshot, 'image/png');

      // Save trace for debugging
      tracePath = `traces/${scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.zip`;
      await this.context.tracing.stop({ path: tracePath });
    } catch (err) {
      console.error('Failed to capture failure artifacts:', err.message);
    }
  } else {
    await this.context.tracing.stop().catch(() => {});
  }

  // Close browser to ensure video and trace files are fully flushed to disk
  await this.closeBrowser();

  const fs = require('fs');

  if (scenario.result?.status === Status.FAILED) {
    // Attach Trace to Allure
    if (tracePath && fs.existsSync(tracePath)) {
      try {
        const traceData = fs.readFileSync(tracePath);
        await this.attach(traceData, 'application/zip');
      } catch (err) {
        console.error('Failed to attach trace to Allure:', err.message);
      }
    }

    // Attach Video to Allure
    if (videoPath && fs.existsSync(videoPath)) {
      try {
        // Small delay to ensure Playwright has released the file lock
        await new Promise(resolve => setTimeout(resolve, 500));
        const videoData = fs.readFileSync(videoPath);
        await this.attach(videoData, 'video/webm');
      } catch (err) {
        console.error('Failed to attach video to Allure:', err.message);
      }
    }
  } else if (videoPath) {
    // retain-on-failure: delete video for passing scenarios
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    } catch {
      // Video cleanup is best-effort
    }
  }
});
