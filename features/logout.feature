# language: tr

@regression @logout @requires-auth
Özellik: Çıkış Yapma
  Giriş yapmış kullanıcının çıkış yapması ve oturumun sonlanması

  Senaryo: Başarılı çıkış ve oturum sonlanma doğrulaması
    Diyelim ki "ana sayfa" sayfasına gidilir
    Ve "header giriş linki" elementine tıklanır
    Ve telefon numarası girilir
    Ve "devam butonu" elementine tıklanır
    Ve şifre girilir
    Ve "giriş butonu" elementine tıklanır
    Ve "kullanıcı adı" elementinin görünür olduğu kontrol edilir
    Ve "çıkış linki" elementine tıklanır
    O zaman oturumun sonlandığı doğrulanır
    Ve misafir durumuna dönüldüğü doğrulanır
