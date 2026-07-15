# CI/CD Setup — GitHub Actions

## GitHub Secrets Kurulumu

Testlerin CI'da çalışması için aşağıdaki secret'ların GitHub'da tanımlanması gerekir:

| Secret Adı | Açıklama |
|---|---|
| `BASE_URL` | Test edilen sitenin URL'si (ör. `https://www.e-bebek.com/`) |
| `E_BEBEK_PHONE` | Test hesabı telefon numarası |
| `E_BEBEK_PASSWORD` | Test hesabı şifresi |

### Secret Ekleme Adımları

1. GitHub repo sayfasında **Settings** → **Secrets and variables** → **Actions** sekmesine git
2. **New repository secret** butonuna tıkla
3. Yukarıdaki tablodan her bir secret için ad ve değeri gir, **Add secret** ile kaydet

> **Güvenlik:** Secret'lar workflow'da yalnızca `env:` bloğu üzerinden enjekte edilir. Hiçbir yerde `echo`, log veya plaintext olarak görünmezler.

## Workflow Tetikleme

| Tetikleyici | Koşul |
|---|---|
| `push` | `main` branch ve `feature/**` branch'lerine push |
| `pull_request` | `main` branch'ine açılan PR'lar |
| `workflow_dispatch` | Manuel tetikleme (Actions → E2E Tests → Run workflow) |

## Nasıl Çalışır

1. `ubuntu-latest` runner'da Node.js LTS kurulur
2. `npm ci` ile bağımlılıklar yüklenir
3. Playwright Chromium (sistem bağımlılıklarıyla birlikte) kurulur
4. Testler **headless** modda **2 worker paralel** çalışır
5. Allure raporu üretilir
6. Video, screenshot, trace ve Allure raporu artifact olarak yüklenir

## Artifact'lere Erişim

1. GitHub repo → **Actions** sekmesi
2. İlgili workflow run'ına tıkla
3. Sayfanın altındaki **Artifacts** bölümünden indir:

| Artifact | İçerik | Retention |
|---|---|---|
| `allure-report` | HTML Allure raporu (tarayıcıda açılabilir) | 14 gün |
| `test-videos` | Başarısız senaryoların video kayıtları | 7 gün |
| `failure-screenshots` | Başarısız senaryoların ekran görüntüleri | 7 gün |
| `failure-traces` | Playwright trace dosyaları (debug için) | 7 gün |

## Video Stratejisi

**Seçim: `retain-on-failure`**

Tüm senaryolarda video kaydı başlatılır ancak yalnızca başarısız senaryoların videoları tutulur; başarılı senaryoların videoları `After` hook'unda silinir.

**Neden bu strateji:**
- `video: 'on'` her senaryoda video tutar → artifact boyutu gereksiz yere şişer (her video ~5-15 MB)
- `retain-on-failure` hata ayıklama için yeterli bağlamı sağlarken disk/artifact kullanımını minimum tutar
- Eğer tüm koşumların videosunu istiyorsanız, `After` hook'undaki silme mantığını kaldırmanız yeterli

## Yerel vs CI Ortamı

| | Yerel | CI |
|---|---|---|
| Credential kaynağı | `.env` dosyası (dotenv) | GitHub Secrets → `env:` bloğu |
| Tarayıcı modu | Konfigüre edilebilir (`HEADLESS=false`) | Her zaman headless |
| Video | Yerel `videos/` klasöründe | Artifact olarak indirilir |

`dotenv` kütüphanesi `override: false` ile çalışır — CI'da enjekte edilen native env variable'lar `.env` dosyasından gelen değerleri ezmez.
