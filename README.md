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
- `World.testContext` yalnızca aktif senaryonun ürün, arama ve sepet bilgisini taşır
- **Dinamik Ölçeklenebilir Paralel Koşum:** Sistem varsayılan 2 worker ile çalışır, ancak ortam değişkenleriyle worker sayısı istenildiği kadar artırılıp azaltılabilir. Worker sayısı artsa bile, **File-based Mutex (Kilit)** mimarisi sayesinde E-bebek sunucusunun "eşzamanlı hesap girişi" engeli aşılır. Aynı hesabı kullanan riskli senaryolar (`@exclusive` tag'li) birbirlerini uyum içinde (sekronize) beklerken, diğer worker'lar arama/sepet gibi risksiz testleri tam hızda paralel koşturmaya devam eder. Adımlar birbiriyle asla veri sızdırmadan mükemmel uyum içerisinde çalışır.
- `state.json` yalnızca `USE_STORAGE_STATE=true` **ve** `@use-storage-state` tag'i birlikte verildiğinde yüklenir. Misafir, negatif-login ve oturum-devamlılığı senaryoları state ile başlamaz.

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

**Çözüm:** `waitFor({ state: 'visible' })`, `expect(...).toHaveValue()` ve `expect(...).toHaveCount()` kullanılır. Karmaşık asenkron koşullar için `support/waitUtils.js` içindeki `retryUntilTrue`, Playwright `expect.poll` ile artan aralıklarda tekrar dener. Kodda `sleep` veya `waitForTimeout` kullanılmaz.

## Bot Korumasını (WAF/Cloudflare) Aşma Stratejileri

E-bebek agresif bot korumaları kullandığı için sisteme 3 seviyeli koruma atlatma mimarisi eklenmiştir:
1. **JavaScript Stealth (world.js):** `navigator.webdriver = false`, WebGL spoofing, sahte plugin'ler ile tarayıcı gerçek bir ev kullanıcısı gibi gösterilir.
2. **API+UI Hibrit Login (Bonus B1):** Ekranda CAPTCHA çıkması riskine karşı, `apiHelper.js` ile arkaplandan saniyeler içinde yetki (token) alınarak arayüze (localStorage) enjekte edilir.
3. **Session Injection (state.json):** Yerel koşumlarda `node scripts/generate-state.js` ile üretilen state, yalnızca açıkça `@use-storage-state` etiketlenmiş hızlandırılmış UI senaryolarına verilir. Dosya `.gitignore` içindedir ve normal test izolasyonunu etkilemez.

## CI/CD — GitHub Actions ve Docker

Testler her push/PR'da otomatik olarak GitHub Actions'da headless çalışır. Detaylar: [docs/ci-setup.md](docs/ci-setup.md)

**Canlı Rapor (GitHub Pages):** Test sonuçları anlık olarak yayınlanmaktadır: 👉 [Canlı Allure Raporu](https://sahinbolukbasi.github.io/eriklabs-web-automation-case-study/)

**Docker Desteği (Bonus B3):** Proje, kilitli Playwright bağımlılığıyla aynı sürümdeki Microsoft imajını (`mcr.microsoft.com/playwright:v1.61.1-jammy`) kullanır. Herhangi bir bilgisayarda ortam kurmadan direkt çalıştırılabilir.

## Senaryo Kapsamı ve Veri Yaklaşımı

- S1: `@smoke @login` — gerçek credential ile giriş ve kullanıcıya özgü header elementi.
- S2: `@negative @login` — tek bir `Scenario Outline`; yanlış şifre, kayıtlı olmayan telefon numarası ve boş alan Examples tablosunda parametriktir. Hatalı telefon/şifre her koşumda fixture ile üretilir.
- S3: `@smoke @search` — fixture tabanlı sonuçlu arama ile dinamik, sonuçsuz arama.
- S4: `@regression @cart` — iki fixture ürünü, adet değişimi, silme ve TL fiyatlarının sayısal ara toplam kontrolü.
- S5: `@regression @session` — misafir sepeti, aynı scenario `World` bağlamında girişten sonra doğrulanır.
- S6: `@regression @logout` — logout sonrasında hesap sayfasına erişimin login ekranına yönlenmesi kontrol edilir.

> e-bebek giriş ekranı telefon numarası kullandığı için negatif kullanıcı kimliği örneği telefon numarası olarak uygulanmıştır.

## CI ve PR Hesap Verebilirliği

GitHub Actions testleri iki worker ile çalıştırır, Allure raporu ve failure artefaktlarını her koşumda yükler. Test başarısızlığı workflow'u başarısız yapar; yalnızca `main` branch'inde rapor GitHub Pages'e yayımlanır.

[PR şablonu](.github/pull_request_template.md), AI kullanımı, gözden geçirilen değişiklikler ve doğrulama adımlarının açıklanmasını zorunlu alanlar olarak içerir. Push/PR işlemi, geliştiricinin kendi GitHub yetkileriyle yapılmalıdır.

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
