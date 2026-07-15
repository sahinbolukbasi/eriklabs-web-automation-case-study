# language: tr

@smoke @login
Özellik: Kullanıcı Girişi
  e-bebek.com'da geçerli telefon ve şifre ile giriş yapılması

  Senaryo: Geçerli telefon ve şifre ile başarılı giriş
    Diyelim ki "ana sayfa" sayfasına gidilir
    Ve header giriş linkine tıklanır
    Ve telefon numarası girilir
    Ve devam butonuna tıklanır
    Ve şifre alanının görünür olduğu doğrulanır
    Ve şifre girilir
    Ve giriş butonuna tıklanır
    O zaman kullanıcı adının görünür olduğu doğrulanır
