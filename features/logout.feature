# language: tr

@regression @logout
Özellik: Çıkış Yapma
  Giriş yapmış kullanıcının çıkış yapması ve oturumun sonlanması

  Senaryo: Başarılı çıkış ve oturum sonlanma doğrulaması
    Diyelim ki "ana sayfa" sayfasına gidilir
    Ve tam login akışı gerçekleştirilir
    Ve kullanıcı adının görünür olduğu doğrulanır
    Ve çıkış yapılır
    O zaman oturumun sonlandığı doğrulanır
    Ve misafir durumuna dönüldüğü doğrulanır
