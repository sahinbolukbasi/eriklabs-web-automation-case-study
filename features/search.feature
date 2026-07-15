# language: tr

@smoke @search
Özellik: Ürün Arama
  e-bebek.com'da ürün arama ve sonuç doğrulama

  Senaryo: Sonuç dönen arama
    Diyelim ki "ana sayfa" sayfasına gidilir
    Ve "SEARCH_PRODUCT" terimi aranır
    O zaman arama sonuçlarının görüntülendiği doğrulanır
    Ve arama sonuçlarının arama terimiyle ilişkili olduğu doğrulanır

  Senaryo: Sonuç dönmeyen arama
    Diyelim ki "ana sayfa" sayfasına gidilir
    Ve "NO_RESULT_TERM" terimi aranır
    O zaman sonuç bulunamadı mesajının görüntülendiği doğrulanır
