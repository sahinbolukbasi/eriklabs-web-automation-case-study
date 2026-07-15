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

## Flaky Durum ve Çözümü (Özel Wait Helper)

**Sorun:** Spartacus/Angular SPA'da sayfa geçişleri asenkron olduğu için login sonrası kullanıcı adı elementi hemen render olmayabiliyor veya A/B testlerinden dolayı butonlar anlık kaybolabiliyor.

**Çözüm:** `waitFor({ state: 'visible', timeout: 15000 })` ile statik beklemelere ek olarak, karmaşık asenkron durumlar için `support/waitUtils.js` içerisine **Custom Retry (Poller)** helper'ı yazılmıştır. Bu yapı, elementi bulana kadar 1'er saniyelik aralıklarla işlemi tekrar dener (Örn: `retryUntilTrue`).

## Bot Korumasını (WAF/Cloudflare) Aşma Stratejileri

E-bebek agresif bot korumaları kullandığı için sisteme 3 seviyeli koruma atlatma mimarisi eklenmiştir:
1. **JavaScript Stealth (world.js):** `navigator.webdriver = false`, WebGL spoofing, sahte plugin'ler ile tarayıcı gerçek bir ev kullanıcısı gibi gösterilir.
2. **API+UI Hibrit Login (Bonus B1):** Ekranda CAPTCHA çıkması riskine karşı, `apiHelper.js` ile arkaplandan saniyeler içinde yetki (token) alınarak arayüze (localStorage) enjekte edilir.
3. **Session Injection (state.json):** Yerel koşumlarda bot koruması aşılmazsa, `node scripts/generate-state.js` çalıştırılarak bir kez gerçek insan gibi login olunur ve üretilen çerezler tüm testlere dağıtılır.

## CI/CD — GitHub Actions ve Docker

Testler her push/PR'da otomatik olarak GitHub Actions'da headless çalışır. Detaylar: [docs/ci-setup.md](docs/ci-setup.md)

**Canlı Rapor (GitHub Pages):** Test sonuçları anlık olarak yayınlanmaktadır: 👉 [Canlı Allure Raporu](https://sahinbolukbasi.github.io/eriklabs-web-automation-case-study/)

**Docker Desteği (Bonus B3):** Proje, Microsoft'un resmi Playwright imajına (`mcr.microsoft.com/playwright:v1.41.0-jammy`) sahip bir `Dockerfile` barındırır. Herhangi bir bilgisayarda ortam kurmadan direkt çalıştırılabilir.

## Proje Yapısı

```
├── .github/workflows/  # GitHub Actions CI pipeline
├── docs/               # CI kurulum dokümantasyonu
├── features/           # Gherkin (.feature) dosyaları
├── step_definitions/   # Step tanımları
├── pages/              # Page Object'ler
├── scripts/
│   └── generate-state.js # Yerel bot atlatma için State Generator
├── support/            # Framework desteği
│   ├── world.js        # Cucumber World (Playwright lifecycle + Stealth)
│   ├── hooks.js        # Video/Trace yakalama
│   ├── config.js       # Ortam konfigürasyonu
│   ├── apiHelper.js    # API+UI Hybrid login servisi (Bonus B1)
│   ├── waitUtils.js    # Flaky operasyonlar için poller (Bonus B4)
│   └── priceParser.js  # TL fiyat parse helper
├── Dockerfile          # Container mimarisi (Bonus B3)
├── .dockerignore       # Docker performans optimizasyonu
├── cucumber.js         # Cucumber profilleri
├── .env.example        # Örnek env dosyası
└── README.md
```
