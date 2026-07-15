# language: tr

@negative @login
Özellik: Hatalı Giriş Denemeleri
  Geçersiz bilgilerle giriş denemelerinde uygun hata mesajlarının gösterilmesi

  Senaryo Taslağı: Geçersiz bilgilerle giriş başarısız olur
    Diyelim ki "ana sayfa" sayfasına gidilir
    Ve header giriş linkine tıklanır
    Ve "<telefon>" telefon numarası girilir
    Ve devam butonuna tıklanır
    Ve "<şifre>" şifresi girilir
    Ve giriş butonuna tıklanır
    O zaman hata mesajının görünür olduğu doğrulanır

    Örnekler:
      | telefon     | şifre          |
      | 5348987073  | YanlışŞifre123 |
      | 5000000001  | -Eriklabs1234  |

  Senaryo: Boş telefon alanıyla giriş denemesi
    Diyelim ki "ana sayfa" sayfasına gidilir
    Ve header giriş linkine tıklanır
    Ve "" telefon numarası girilir
    Ve devam butonuna tıklanır
    O zaman telefon hata mesajının görünür olduğu doğrulanır
