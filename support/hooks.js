const { Before, After, BeforeAll, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// Playwright browser launch and cookie dismissal can take more than 5 seconds
setDefaultTimeout(60 * 1000);

BeforeAll(function () {
  // Allure environment bilgisi credential içermeden her koşumda rapora eklenir.
  const resultsDir = path.join(__dirname, '..', 'allure-results');
  fs.mkdirSync(resultsDir, { recursive: true });
  fs.writeFileSync(
    path.join(resultsDir, 'environment.properties'),
    `Base URL=${config.baseUrl}\nBrowser=Chromium\nHeadless=${config.browser.headless}\nWorkers=${config.parallel.workers}\n`,
  );
});

Before(async function (scenario) {
  this.scenarioTags = scenario.pickle.tags.map(({ name }) => name);

  if (scenario.pickle.tags.some(({ name }) => name === '@requires-auth')) {
    if (!this.config.credentials.phone || !this.config.credentials.password) {
      throw new Error('Bu senaryo için E_BEBEK_PHONE ve E_BEBEK_PASSWORD environment değişkenleri gereklidir.');
    }
  }

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
      // Scenario Outline örnekleri paralel çalışırken aynı görünen ada sahip olabilir.
      // Pickle id'si worker'lar arasında benzersiz olduğundan artefakt çakışmasını önler.
      tracePath = `traces/${scenario.pickle.id}.zip`;
      await this.context.tracing.stop({ path: tracePath });
    } catch (err) {
      console.error('Failed to capture failure artifacts:', err.message);
    }
  } else {
    await this.context.tracing.stop().catch(() => {});
  }

  // Close browser to ensure video and trace files are fully flushed to disk
  await this.closeBrowser();

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
        const videoData = fs.readFileSync(videoPath);
        await this.attach(videoData, 'video/webm');
      } catch (err) {
        console.error('Failed to attach video to Allure:', err.message);
      }
    }
  } else if (videoPath) {
    // retain-on-failure: delete video for passing scenarios
    try {
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    } catch {
      // Video cleanup is best-effort
    }
  }
});
