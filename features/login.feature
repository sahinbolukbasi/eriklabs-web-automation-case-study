# language: tr

@smoke @login @requires-auth
Özellik: Kullanıcı Girişi
  e-bebek.com'da geçerli telefon ve şifre ile giriş yapılması

  Senaryo: Geçerli telefon ve şifre ile başarılı giriş
    Diyelim ki "ana sayfa" sayfasına gidilir
    Ve "header giriş linki" elementine tıklanır
    Ve telefon numarası girilir
    Ve "devam butonu" elementine tıklanır
    Ve "şifre alanı" elementinin görünür olduğu kontrol edilir
    Ve şifre girilir
    Ve "giriş butonu" elementine tıklanır
    O zaman "kullanıcı adı" elementinin görünür olduğu kontrol edilir
