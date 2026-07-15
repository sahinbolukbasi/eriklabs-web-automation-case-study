# E-Bebek Test Otomasyon Projesi

[e-bebek.com](https://www.e-bebek.com/) için Playwright + Cucumber.js (BDD) + Allure ile yazılmış uçtan uca test otomasyon framework'ü. SAP Commerce Cloud / Spartacus altyapısına uygun locator stratejisi kullanır.

## Stack

- **Tarayıcı Otomasyonu:** Playwright
- **BDD Framework:** @cucumber/cucumber (Gherkin — Türkçe)
- **Raporlama:** Allure (allure-cucumberjs)
- **Dinamik Veri:** @faker-js/faker
- **Konfigürasyon:** dotenv

## Kurulum

```bash
# Bağımlılıkları kur
npm install

# Playwright tarayıcılarını kur
npx playwright install chromium

# .env dosyasını oluştur
cp .env.example .env
# .env dosyasını düzenle ve gerçek değerleri gir
```

## Çalıştırma

```bash
# Tüm testleri çalıştır
npm test

# Smoke testleri
npm run test:smoke

# Regression testleri
npm run test:regression

# Negatif senaryolar
npm run test:negative

# Paralel çalıştırma (2 worker)
npm run test:parallel

# Belirli tag ile çalıştır
npx cucumber-js --tags "@login"
```

## Allure Rapor

```bash
# Raporu oluştur ve aç
npm run allure:report

# Sadece oluştur
npm run allure:generate

# Sadece aç
npm run allure:open
```

## Test Senaryoları

| # | Senaryo | Tag | Açıklama |
|---|---|---|---|
| S1 | Başarılı Giriş | `@smoke @login` | Geçerli telefon/şifre ile login |
| S2 | Negatif Giriş | `@negative @login` | Hatalı şifre, kayıtsız telefon, boş alan |
| S3 | Ürün Arama | `@smoke @search` | Sonuç dönen ve dönmeyen arama |
| S4 | Sepet İş Akışı | `@regression @cart` | Ekleme, adet artırma, silme, toplam doğrulama |
| S5 | Oturum Devamlılığı | `@regression @session` | Misafir sepeti → login → sepet korunur |
| S6 | Çıkış | `@regression @logout` | Logout + oturum sonlanma doğrulaması |

## Test İzolasyonu

Her senaryo kendi browser context'inde çalışır:
- `Before` hook'unda yeni `BrowserContext` açılır
- `After` hook'unda context kapatılır
- Senaryolar arası cookie, localStorage, oturum paylaşımı yoktur
- Paralel koşumda (2+ worker) senaryolar birbirini etkilemez

## Locator Stratejisi

SAP Commerce / Spartacus'un custom element yapısına uygun öncelik sırası:
1. `data-testid` (varsa)
2. Stabil `id` → `#txtSearchBox`, `#txtPhoneNumberMobile`, `#txtPassword`, `#lnkSignOutNavNode`
3. Kısa CSS → `eb-login-username form button`, `#pl-page-1 eb-product-list-item`
4. **Yasak:** Derin, index'e dayalı xpath zincirleri

## Bekleme Stratejisi

- `sleep` / `waitForTimeout` **kesinlikle kullanılmaz**
- Playwright auto-wait mekanizması kullanılır
- `waitFor({ state: 'visible' })` ile element görünürlüğü beklenir
- `waitForLoadState('domcontentloaded')` ile sayfa geçişleri stabilize edilir
- Cookie banner `Before` hook'unda otomatik kapatılır

## Flaky Durum ve Çözümü

**Sorun:** Spartacus/Angular SPA'da sayfa geçişleri asenkron olduğu için login sonrası kullanıcı adı elementi hemen render olmayabiliyor.

**Çözüm:** `waitFor({ state: 'visible', timeout: 15000 })` ile Angular hydration'ın tamamlanması bekleniyor. Statik `sleep` yerine Playwright'ın akıllı bekleme mekanizması tercih edildi. Cookie/izin banner'ları da `Before` hook'unda preemptive olarak kapatılıyor — bu, sonraki tıklamaların overlay tarafından engellenmesini önlüyor.

## Proje Yapısı

```
├── features/           # Gherkin (.feature) dosyaları
├── step_definitions/   # Step tanımları
│   ├── generic.steps.js    # Tekrar kullanılabilir generic step'ler
│   ├── login.steps.js
│   ├── search.steps.js
│   ├── cart.steps.js
│   ├── session.steps.js
│   └── logout.steps.js
├── pages/              # Page Object'ler
│   ├── BasePage.js
│   ├── HomePage.js
│   ├── LoginPage.js
│   ├── SearchResultsPage.js
│   ├── ProductPage.js
│   ├── CartPage.js
│   └── AccountNavPage.js
├── support/            # Framework desteği
│   ├── world.js        # Cucumber World (Playwright lifecycle)
│   ├── hooks.js        # Before/After hooks
│   ├── config.js       # Ortam konfigürasyonu
│   └── priceParser.js  # TL fiyat parse helper
├── fixtures/           # Test verisi
│   └── testData.js     # Dinamik veri (faker)
├── cucumber.js         # Cucumber profilleri
├── .env.example        # Örnek env dosyası
└── README.md
```
