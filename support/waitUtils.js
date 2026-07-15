/**
 * Custom retry helper for flaky UI elements or unpredictable asynchronous states.
 * This is useful when Playwright's native auto-wait is insufficient (e.g., Stale Element Reference,
 * layout shifts, or third-party iframe hydration).
 * 
 * @param {Function} action - Async function to execute. Must return truthy if successful, falsy if failed.
 * @param {number} timeout - Maximum polling time in milliseconds.
 * @returns {Promise<boolean>} - True if the action succeeded within the retry limit.
 */
async function retryUntilTrue(action, timeout = 15000) {
  await expect.poll(action, {
    timeout,
    intervals: [100, 250, 500, 1000],
    message: 'Koşul verilen süre içinde sağlanmadı.',
  }).toBeTruthy();
  return true;
}

module.exports = { retryUntilTrue };
const { expect } = require('@playwright/test');
