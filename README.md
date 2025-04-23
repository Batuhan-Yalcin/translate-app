# Çeviri Uygulaması

Bu proje, kullanıcılara metin çevirisi yapma imkanı sağlayan modern bir web uygulamasıdır. Uygulama, modern bir arayüz, gelişmiş dil tespiti ve çeviri özellikleri sunar.

## Proje Hakkında

Çeviri Uygulaması, React ile geliştirilmiş bir web uygulamasıdır. Arka planda çeviri hizmetlerini kullanarak metinleri çeşitli diller arasında çevirebilir. Ayrıca otomatik dil algılama ve sesli okuma gibi ek özellikler de içerir.

### Özellikler

- **Modern Arayüz**: Estetik ve kullanıcı dostu tasarım
- **Dil Algılama**: Otomatik dil tespiti
- **Metin Çevirisi**: 10+ dil desteği
- **Sesli Okuma**: Çevrilen metni dinleme imkanı
- **Dil Değiştirme**: Kaynak ve hedef dili tek tıkla değiştirme
- **Responsive Tasarım**: Tüm cihazlara uyumlu arayüz
- **Yükleme Göstergeleri**: İşlem sürerken bilgilendirme
- **Metni Kopyalama**: Çevrilen metni panoya kopyalama

### Kullanılan Teknolojiler

- **React**: Kullanıcı arayüzü için
- **Bootstrap**: Responsive tasarım için
- **React-Bootstrap**: UI komponentleri için
- **Axios**: API istekleri için
- **Web Speech API**: Sesli okuma işlemleri için

## Nasıl Çalışır?

Uygulama, kullanıcının kaynak metni girdiği ve hedef dili seçtiği basit bir arayüz sunar. "Çevir" düğmesine tıkladığınızda, metin API aracılığıyla çevrilir ve sonuç ekranda gösterilir.

### Dil Tespiti

Uygulama, kaynak dil "Otomatik Tespit" olarak seçildiğinde gelişmiş bir algoritma kullanarak metni analiz eder:

1. Türkçe'ye özgü karakterleri kontrol eder (ş, ç, ğ, ü, ö, ı)
2. İngilizce'ye özgü karakterleri kontrol eder (w, x, q)
3. Yaygın Türkçe kelimeleri (ve, bir, bu, için) arar
4. Toplanan verilere göre dilin Türkçe mi yoksa İngilizce mi olduğuna karar verir

### Çeviri Motoru

Uygulama, çeviri için aşağıdaki adımları izler:

1. Kullanıcı tarafından girilen metni alır
2. Gerekirse dil tespiti yapar
3. Çeviri API'sine istek gönderir
4. Yanıtı işler ve kullanıcıya gösterir
5. API bağlantısı başarısız olursa basit bir sözlük kullanarak çalışmaya devam eder

### Gelişmiş Özellikler

- **Sesli Okuma**: Web Speech API kullanarak çevrilen metni seslendirir
- **Kopyalama**: Tek tıkla çevrilen metni panoya kopyalar
- **Dil Değiştirme**: Kaynak ve hedef dilleri yer değiştirir, çevrilmiş metinle birlikte
- **Animasyonlar**: Kullanıcı deneyimini artırmak için modern animasyonlar ve görsel efektler

## Kurulum ve Çalıştırma

### Gereksinimler

- Node.js (v12 veya üzeri)
- npm veya yarn

### Kurulum

1. Projeyi bilgisayarınıza klonlayın:
```
git clone https://github.com/kullaniciadi/ceviri-uygulamasi.git
cd ceviri-uygulamasi
```

2. Bağımlılıkları yükleyin:
```
npm install
```

3. Uygulamayı başlatın:
```
npm start
```

4. Tarayıcınızda şu adresi açın:
```
http://localhost:3000
```

## API Limitleri ve Dikkat Edilmesi Gerekenler

- API'ler, genellikle istek sınırlamaları koyar ve bu sınırlar aşıldığında geçici olarak erişim engellenebilir.
- Büyük metin çevirileri için, metni daha küçük parçalara bölüp birden fazla istek göndermek daha sağlıklı olabilir.
- API bağlantısı olmadığında uygulama, sınırlı bir kelime veritabanı ile basit çeviriler yapabilir.

## Katkıda Bulunma

Projeye katkıda bulunmak istiyorsanız:

1. Bu depoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Harika bir özellik ekle'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

Bu proje açık kaynaklıdır ve MIT lisansı altında dağıtılmaktadır.

## İletişim

Batuhan Yalçın - [batuhan@example.com](mailto:batuhan@example.com)

Proje Linki: [https://github.com/kullaniciadi/ceviri-uygulamasi](https://github.com/kullaniciadi/ceviri-uygulamasi)
