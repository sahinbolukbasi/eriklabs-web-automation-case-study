/**
 * Custom retry helper for flaky UI elements or unpredictable asynchronous states.
 * This is useful when Playwright's native auto-wait is insufficient (e.g., Stale Element Reference,
 * layout shifts, or third-party iframe hydration).
 * 
 * @param {Function} action - Async function to execute. Must return truthy if successful, falsy if failed.
 * @param {number} maxRetries - Maximum number of retries.
 * @param {number} delayMs - Delay between retries in milliseconds.
 * @returns {Promise<boolean>} - True if the action succeeded within the retry limit.
 */
async function retryUntilTrue(action, maxRetries = 5, delayMs = 1000) {
  let lastError = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await action();
      if (result) return true;
    } catch (e) {
      lastError = e;
    }
    // Controlled sleep only between retry intervals
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  
  if (lastError) {
    throw new Error(`İşlem ${maxRetries} denemede başarısız oldu. Son hata: ${lastError.message}`);
  } else {
    throw new Error(`İşlem ${maxRetries} denemede koşulu sağlayamadı (false döndü).`);
  }
}

module.exports = { retryUntilTrue };
