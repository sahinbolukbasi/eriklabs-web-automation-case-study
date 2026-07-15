# language: tr

@negative @login @requires-auth
Özellik: Hatalı Giriş Denemeleri
  Geçersiz bilgilerle giriş denemelerinde uygun hata mesajlarının gösterilmesi

  Senaryo taslağı: Geçersiz bilgilerle giriş başarısız olur
    Diyelim ki "ana sayfa" sayfasına gidilir
    Ve "header giriş linki" elementine tıklanır
    Ve "<telefon>" telefon numarası girilir
    Ve "devam butonu" elementine tıklanır
    Ve "<şifre>" şifresi, alan görünürse girilir
    Ve giriş butonu, alan görünürse tıklanır
    O zaman "<hata>" hata mesajının görünür olduğu doğrulanır

    Örnekler:
      | telefon            | şifre           | hata                 |
      | ENV_PHONE          | INVALID_PASSWORD | giriş hata mesajı    |
      | UNREGISTERED_PHONE | INVALID_PASSWORD | giriş hata mesajı    |
      | EMPTY              | EMPTY            | telefon hata mesajı  |
