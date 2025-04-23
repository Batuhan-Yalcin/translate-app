import axios from 'axios';

// Google Translate için API servisi
class TranslateService {
  constructor() {
    // Doğrudan çeviri için URL'ler
    this.googleApiUrl = 'https://translate.googleapis.com/translate_a/single';
    this.libreApiUrl = 'https://libretranslate.de/translate';
    
    // Hata oluşursa bu URL'yi kullanacağız, bir sonraki istekte tekrar orijinal URL'yi deneriz
    this.useBackupMethod = false;
  }

  // Desteklenen dilleri getir
  async getLanguages() {
    // Statik dil listesi (API bağlantısı kesilirse veya CORS hatası oluşursa kullanılır)
    const staticLanguages = [
      { code: 'auto', name: 'Otomatik Tespit' },
      { code: 'en', name: 'İngilizce' },
      { code: 'tr', name: 'Türkçe' },
      { code: 'es', name: 'İspanyolca' },
      { code: 'fr', name: 'Fransızca' },
      { code: 'de', name: 'Almanca' },
      { code: 'it', name: 'İtalyanca' },
      { code: 'pt', name: 'Portekizce' },
      { code: 'ru', name: 'Rusça' },
      { code: 'zh', name: 'Çince' },
      { code: 'ja', name: 'Japonca' },
      { code: 'ar', name: 'Arapça' },
      { code: 'ko', name: 'Korece' }
    ];

    try {
      const response = await axios.get('https://libretranslate.com/languages');
      return response.data.map(lang => ({ 
        code: lang.code, 
        name: lang.name 
      }));
    } catch (error) {
      console.log('Dil listesi alınamadı, statik listeyi kullanıyoruz:', error);
      return staticLanguages;
    }
  }

  // Google Translate API kullanarak metni çevir
  async translateText(text, sourceLang, targetLang) {
    try {
      if (this.useBackupMethod) {
        return await this.translateTextWithLibreTranslate(text, sourceLang, targetLang);
      } else {
        try {
          const result = await this.translateTextWithGoogle(text, sourceLang, targetLang);
          return {
            translatedText: result.translatedText,
            detectedSourceLanguage: result.detectedSourceLanguage,
            apiMode: 'Google Translate'
          };
        } catch (error) {
          console.log('Ana çeviri metodu başarısız oldu, yedek metoda geçiliyor:', error);
          this.useBackupMethod = true;
          const result = await this.translateTextWithLibreTranslate(text, sourceLang, targetLang);
          return {
            translatedText: result.translatedText,
            detectedSourceLanguage: result.detectedSourceLanguage,
            apiMode: 'LibreTranslate'
          };
        }
      }
    } catch (error) {
      console.error('Çeviri yapılırken hata oluştu:', error);
      
      // Son çare olarak basit çeviri
      return {
        translatedText: this.simpleTranslate(text, sourceLang, targetLang),
        detectedSourceLanguage: sourceLang,
        apiMode: 'Basit Çevirici'
      };
    }
  }

  // Basit çeviri - API çağrıları başarısız olduğunda kullanılır
  simpleTranslate(text, from, to) {
    // Türkçe - İngilizce temel sözlük
    const dictionary = {
      'tr-en': {
        'merhaba': 'hello',
        'selam': 'hi',
        'nasılsın': 'how are you',
        'iyiyim': 'i am good',
        'teşekkürler': 'thank you'
      },
      'en-tr': {
        'hello': 'merhaba',
        'hi': 'selam',
        'how are you': 'nasılsın',
        'i am good': 'iyiyim',
        'thank you': 'teşekkürler'
      }
    };
    
    const dict = dictionary[`${from}-${to}`] || {};
    const words = text.toLowerCase().split(' ');
    const translated = words.map(word => dict[word] || word);
    
    return translated.join(' ');
  }

  // Google Translate ile çeviri
  async translateTextWithGoogle(text, sourceLang, targetLang) {
    try {
      // API proxy kullanmadan doğrudan API'ye bağlanmayı deneyelim
      // NOT: Bu CORS hatası verebilir, tarayıcı güvenliği bunu engeller
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      
      // Tarayıcıdan direkt API çağrısı CORS hatası verir, bu yüzden
      // bu işlemi normalde backend'de yapmalıyız, burada sadece deniyoruz
      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      // Google Translate API'nin yanıt formatına göre parse et
      let translatedText = '';
      if (response.data && Array.isArray(response.data[0])) {
        response.data[0].forEach(item => {
          if (item[0]) {
            translatedText += item[0];
          }
        });
      }
      
      return {
        translatedText,
        detectedSourceLanguage: response.data[2] || sourceLang
      };
    } catch (error) {
      console.error('Google Translate API hatası:', error);
      throw error;
    }
  }

  // Yedek çeviri metodu - LibreTranslate
  async translateTextWithLibreTranslate(text, sourceLang, targetLang) {
    try {
      // LibreTranslate API kullan
      const response = await axios.post(this.libreApiUrl, {
        q: text,
        source: sourceLang === 'auto' ? 'auto' : sourceLang,
        target: targetLang,
        format: 'text'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return {
        translatedText: response.data.translatedText,
        detectedSourceLanguage: sourceLang === 'auto' ? response.data.detectedLanguage?.language : sourceLang
      };
    } catch (error) {
      console.error('LibreTranslate API hatası:', error);
      throw error;
    }
  }

  // Dilin otomatik tespiti
  async detectLanguage(text) {
    try {
      // Basit dil tespit algoritması
      const turkishChars = (text.match(/[şçğüöıİ]/g) || []).length;
      const englishSpecificChars = (text.match(/[wxq]/g) || []).length;
      
      if (turkishChars > 0 && turkishChars > englishSpecificChars) {
        return [{ language: 'tr', confidence: 85 }];
      } else {
        return [{ language: 'en', confidence: 85 }];
      }
    } catch (error) {
      console.error('Dil tespiti yapılırken hata oluştu:', error);
      // Varsayılan olarak İngilizce döndür
      return [{ language: 'en', confidence: 70 }];
    }
  }
}

const translateService = new TranslateService();
export default translateService; 