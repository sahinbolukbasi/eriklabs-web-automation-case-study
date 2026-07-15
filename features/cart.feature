# language: tr

@regression @cart
Özellik: Sepet İş Akışı
  Sepete ürün ekleme, adet değiştirme, silme ve toplam doğrulama

  Senaryo: Sepete iki ürün ekle, adedini değiştir, birini sil, toplamı doğrula
    Diyelim ki "ana sayfa" sayfasına gidilir
    Ve "biberon" ürünü aranıp sepete eklenir
    Ve "ana sayfa" sayfasına gidilir
    Ve "emzik" ürünü aranıp sepete eklenir
    Ve sepet sayfasına gidilir
    Ve sepette 2 ürün olduğu doğrulanır
    Ve sepetteki 1. ürünün adedi artırılır
    Ve sepetteki 2. ürün silinir
    Ve sepette 1 ürün olduğu doğrulanır
    O zaman sepet ara toplamının doğru olduğu kontrol edilir
