const fs = require('fs');
const path = require('path');

const lockDir = path.join(__dirname, '..', '.login.lock');

/**
 * Dosya sistemi tabanlı atomik kilit (Mutex) alır.
 * @param {number} timeout Maksimum bekleme süresi (ms)
 */
async function acquireLock(timeout = 60000) {
  const start = Date.now();
  console.log(`[MUTEX] Lock (Kilit) alma deneniyor... (${process.pid})`);

  while (Date.now() - start < timeout) {
    try {
      // mkdirSync atomiktir. Klasör varsa fırlatır (EEXIST).
      fs.mkdirSync(lockDir);
      console.log(`[MUTEX] 🟢 Lock (Kilit) BAŞARIYLA ALINDI! (${process.pid})`);
      return true;
    } catch (e) {
      if (e.code === 'EEXIST') {
        // Kilit başka bir worker'da, bekle ve tekrar dene
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        throw e;
      }
    }
  }
  throw new Error(`[MUTEX] 🔴 Kilit zaman aşımı! ${timeout}ms boyunca kilit alınamadı.`);
}

/**
 * Kilidi serbest bırakır.
 */
function releaseLock() {
  try {
    if (fs.existsSync(lockDir)) {
      fs.rmdirSync(lockDir);
      console.log(`[MUTEX] 🔓 Lock (Kilit) SERBEST BIRAKILDI. (${process.pid})`);
    }
  } catch (e) {
    // Ignore if not exists or another error
  }
}

module.exports = { acquireLock, releaseLock };
