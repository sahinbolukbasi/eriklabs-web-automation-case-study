# language: tr

@regression @session @requires-auth
Özellik: Oturum Devamlılığı
  Misafir olarak sepete eklenen ürünlerin giriş sonrası korunması

  Senaryo: Misafir sepeti giriş sonrası korunur
    Diyelim ki misafir olarak bir ürün sepete eklenir
    Ve "header giriş linki" elementine tıklanır
    Ve telefon numarası girilir
    Ve "devam butonu" elementine tıklanır
    Ve şifre girilir
    Ve "giriş butonu" elementine tıklanır
    Ve "kullanıcı adı" elementinin görünür olduğu kontrol edilir
    O zaman sepetin korunduğu doğrulanır
