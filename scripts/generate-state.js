const { chromium } = require('playwright');
const path = require('path');
const config = require('../support/config');

(async () => {
  console.log('🌐 Tarayıcı açılıyor...');
  console.log('Lütfen e-bebek sitesinde login olun ve karşınıza çıkan CAPTCHA vb. engelleri manuel olarak çözün.');
  console.log('İşiniz bittiğinde terminale dönüp herhangi bir tuşa basın...');

  const browser = await chromium.launch({
    headless: false, // Kullanıcının görebilmesi için headed açıyoruz
    args: ['--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'tr-TR',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();
  await page.goto(new URL('login', config.baseUrl).href);

  // Kullanıcının işlemi bitirmesini bekle
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.once('data', async () => {
    console.log('\n💾 State (Cookie & LocalStorage) kaydediliyor...');
    const statePath = path.join(__dirname, '..', 'state.json');
    
    await context.storageState({ path: statePath });
    
    console.log(`✅ Başarılı! Oturum bilgileri ${statePath} dosyasına kaydedildi.`);
    console.log('Artık testlerinizi çalıştırdığınızda Playwright otomatik olarak bu oturumu kullanacak ve bot olarak algılanmayacak.');
    
    await browser.close();
    process.exit(0);
  });
})();
