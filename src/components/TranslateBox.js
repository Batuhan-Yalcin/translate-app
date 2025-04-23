import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import TranslateService from '../services/TranslateService';

const TranslateBox = () => {
  const [languages, setLanguages] = useState([]);
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('tr');
  const [loading, setLoading] = useState(false);
  const [detectedLang, setDetectedLang] = useState(null);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // 3D efektler için ref
  const cardRef = useRef(null);
  const floatingShapesRef = useRef(null);

  // Dil listesini yükle
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const data = await TranslateService.getLanguages();
        setLanguages(data);
        setLoading(false);
      } catch (err) {
        console.error('Dil listesi yüklenirken hata:', err);
        setError('Dil listesi yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
        setLoading(false);
      }
    };

    fetchLanguages();
    
    // Yüzen şekilleri oluştur
    createFloatingShapes();
    
    // Fare hareketini takip etme efekti ekle
    document.addEventListener('mousemove', handleMouseMove);
    
    // Yıldız efektleri için olay dinleyici
    document.addEventListener('click', createStars);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', createStars);
      if (floatingShapesRef.current) {
        floatingShapesRef.current.remove();
      }
    };
  }, []);
  
  // Fare hareketi ile 3D hareket
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;
    
    // Fare pozisyonunu kart merkezine göre hesapla (-1 ile 1 arasında)
    const mouseX = (e.clientX - cardCenterX) / (cardRect.width / 2);
    const mouseY = (e.clientY - cardCenterY) / (cardRect.height / 2);
    
    // Rotasyon açısı (maksimum 5 derece)
    const rotateY = mouseX * 5;
    const rotateX = -mouseY * 5;
    
    // Kartı hareket ettir
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
  };
  
  // Tıklama efekti - Yıldızlar
  const createStars = (e) => {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    starsContainer.style.position = 'absolute';
    starsContainer.style.left = `${e.clientX}px`;
    starsContainer.style.top = `${e.clientY}px`;
    starsContainer.style.pointerEvents = 'none';
    starsContainer.style.zIndex = '9999';
    
    // 15 yıldız oluştur
    for (let i = 0; i < 15; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 60 - 30}px`;
      star.style.top = `${Math.random() * 60 - 30}px`;
      star.style.width = `${Math.random() * 4 + 1}px`;
      star.style.height = `${Math.random() * 4 + 1}px`;
      star.style.animationDelay = `${Math.random() * 0.5}s`;
      starsContainer.appendChild(star);
    }
    
    document.body.appendChild(starsContainer);
    
    // Animasyon bittikten sonra temizle
    setTimeout(() => {
      starsContainer.remove();
    }, 5000);
  };
  
  // Yüzen şekilleri oluştur
  const createFloatingShapes = () => {
    const floatingShapes = document.createElement('div');
    floatingShapes.className = 'floating-shapes';
    floatingShapesRef.current = floatingShapes;
    
    // 5 şekil oluştur
    for (let i = 0; i < 5; i++) {
      const shape = document.createElement('div');
      shape.className = 'floating-shape';
      shape.style.top = `${Math.random() * 100}vh`;
      shape.style.left = `${Math.random() * 100}vw`;
      shape.style.animationDelay = `${i * 3}s`;
      
      // Farklı boyutlar
      const size = Math.random() * 300 + 100;
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      
      // Farklı renkler
      const colors = [
        'radial-gradient(circle at center, rgba(74, 108, 224, 0.1), transparent)',
        'radial-gradient(circle at center, rgba(141, 92, 245, 0.1), transparent)',
        'radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent)',
        'radial-gradient(circle at center, rgba(231, 60, 126, 0.1), transparent)',
        'radial-gradient(circle at center, rgba(35, 166, 213, 0.1), transparent)'
      ];
      shape.style.background = colors[i % colors.length];
      
      floatingShapes.appendChild(shape);
    }
    
    document.body.appendChild(floatingShapes);
  };

  // Metinden sese dönüştürme fonksiyonu
  const speakText = (text, lang) => {
    // Konuşma devam ediyorsa durdur
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Tarayıcı desteğini kontrol et
    if (!window.speechSynthesis) {
      setError('Tarayıcınız sesli okuma özelliğini desteklemiyor.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Dil kodunu ayarla
    utterance.lang = mapLanguageCodeForSpeech(lang);
    
    // Konuşma tamamlandığında çalışacak fonksiyon
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    // Konuşmayı başlat
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Dil kodunu Speech API için dönüştürme
  const mapLanguageCodeForSpeech = (langCode) => {
    // Dil kodları için gerekli dönüşümler
    const langMap = {
      'en': 'en-US',
      'tr': 'tr-TR',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-PT',
      'ru': 'ru-RU',
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'ar': 'ar-SA',
      'ko': 'ko-KR'
    };
    
    return langMap[langCode] || langCode;
  };

  // Çeviri işlemi
  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      // Gelişmiş dil tespiti algoritması
      let sourceLanguage = sourceLang;
      if (sourceLang === 'auto') {
        // Türkçe karakterlerini daha hassas kontrol et
        const turkishChars = sourceText.match(/[şŞçÇğĞüÜöÖıİ]/g) || [];
        const englishSpecificChars = sourceText.match(/[wxqWXQ]/g) || [];
        
        // Türkçe kelimeler için kontrol
        const turkishCommonWords = ['ve', 'bir', 'bu', 'için', 'ile', 'ama', 'de', 'çok', 'gibi', 'kadar', 'sonra', 'daha'];
        const wordsInText = sourceText.toLowerCase().split(/\s+/);
        const turkishWordCount = wordsInText.filter(word => turkishCommonWords.includes(word)).length;
        
        // Türkçe olma olasılığını hesapla
        const isTurkish = turkishChars.length > 0 || (turkishWordCount > 0 && englishSpecificChars.length === 0);
        
        // API ile dil tespiti
        const detected = await TranslateService.detectLanguage(sourceText);
        if (detected && detected.length > 0) {
          // API sonucu ile kendi tespitimizi karşılaştır
          if (isTurkish && detected[0].language !== 'tr') {
            sourceLanguage = 'tr'; // Kendi tespitimize güven
          } else {
            sourceLanguage = detected[0].language;
          }
          setDetectedLang(sourceLanguage);
        } else if (isTurkish) {
          sourceLanguage = 'tr';
          setDetectedLang('tr');
        } else {
          sourceLanguage = 'en';
          setDetectedLang('en');
        }
      }

      const result = await TranslateService.translateText(
        sourceText,
        sourceLanguage,
        targetLang
      );

      setTranslatedText(result.translatedText);
      
      setLoading(false);
      
      // Çeviri başarılı animasyonu
      if (cardRef.current) {
        cardRef.current.classList.add('translation-success');
        setTimeout(() => {
          cardRef.current.classList.remove('translation-success');
        }, 1000);
      }
    } catch (err) {
      console.error('Çeviri hatası:', err);
      setError('Çeviri yapılırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      setLoading(false);
    }
  };

  // Metni temizle
  const clearText = () => {
    // Silme animasyonu
    if (cardRef.current) {
      cardRef.current.classList.add('clear-animation');
      setTimeout(() => {
        setSourceText('');
        setTranslatedText('');
        setDetectedLang(null);
        cardRef.current.classList.remove('clear-animation');
      }, 300);
    } else {
      setSourceText('');
      setTranslatedText('');
      setDetectedLang(null);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="shadow glass-card" ref={cardRef}>
        <div className="card-glow"></div>
        <Card.Header className="bg-primary text-white">
          <h3 className="mb-0">Çeviri Uygulaması</h3>
          <div className="pulse-effect"></div>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" className="error-alert">
              <strong>Hata:</strong> {error}
            </Alert>
          )}

          <Row className="mb-3">
            <Col md={5} sm={12}>
              <Form.Group className="mb-3">
                <Form.Label className="animated-label">Kaynak Dil</Form.Label>
                <Form.Select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  disabled={loading}
                  className="glow-input"
                >
                  <option value="auto">Otomatik Tespit</option>
                  {languages.filter(lang => lang.code !== 'auto').map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </Form.Select>
                {detectedLang && sourceLang === 'auto' && (
                  <small className="text-muted detected-language">
                    <span className="detected-badge">
                      Tespit edilen dil: {languages.find(l => l.code === detectedLang)?.name || detectedLang}
                    </span>
                  </small>
                )}
              </Form.Group>
            </Col>

            <Col md={2} sm={12} className="d-flex align-items-center justify-content-center swap-btn-container">
              <Button 
                variant="primary"
                onClick={() => {
                  if (sourceLang !== 'auto') {
                    const tempLang = sourceLang;
                    const tempText = sourceText;
                    
                    setSourceLang(targetLang);
                    setTargetLang(tempLang);
                    setSourceText(translatedText);
                    setTranslatedText(tempText);
                  }
                }}
                disabled={loading || sourceLang === 'auto'}
                className="rounded-circle swap-languages-btn"
                style={{
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                aria-label="Dilleri değiştir"
              >
                <i className="bi bi-arrow-left-right"></i>
              </Button>
            </Col>

            <Col md={5} sm={12}>
              <Form.Group className="mb-3">
                <Form.Label className="animated-label">Hedef Dil</Form.Label>
                <Form.Select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  disabled={loading}
                  className="glow-input"
                >
                  {languages.filter(lang => lang.code !== 'auto').map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col lg={6} md={12} className="mb-4">
              <Form.Group className="mb-3">
                <Form.Label className="animated-label">Çevrilecek Metin</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Çevrilecek metni buraya girin..."
                  disabled={loading}
                  className="text-input-area"
                />
                <div className="input-bubble-effect"></div>
              </Form.Group>
              <div className="d-flex justify-content-between flex-wrap action-buttons-container">
                <Button variant="danger" onClick={clearText} disabled={loading || !sourceText} className="action-btn mb-2 mb-sm-0">
                  <i className="bi bi-trash"></i> Temizle
                </Button>
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <Button 
                    variant="outline-info" 
                    className="action-btn speak-btn" 
                    onClick={() => speakText(sourceText, sourceLang === 'auto' ? detectedLang || 'en' : sourceLang)}
                    disabled={loading || !sourceText.trim()}
                  >
                    <i className={`bi ${isSpeaking ? 'bi-pause-fill' : 'bi-volume-up-fill'}`}></i>
                    {isSpeaking ? ' Durdur' : ' Dinle'}
                    <span className="btn-glow"></span>
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleTranslate} 
                    disabled={loading || !sourceText.trim()}
                    className="action-btn translate-btn"
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span className="ms-2">Çevriliyor...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-translate"></i> Çevir
                      </>
                    )}
                    <span className="btn-glow"></span>
                  </Button>
                </div>
              </div>
            </Col>

            <Col lg={6} md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="animated-label">Çevrilmiş Metin</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={translatedText}
                  readOnly
                  placeholder="Çeviri burada görünecek..."
                  className="text-result-area"
                />
                <div className="result-bubble-effect"></div>
              </Form.Group>
              <div className="d-flex justify-content-end flex-wrap action-buttons-container">
                <Button
                  variant="outline-info"
                  className="me-2 action-btn speak-btn mb-2 mb-sm-0"
                  onClick={() => speakText(translatedText, targetLang)}
                  disabled={!translatedText}
                >
                  <i className={`bi ${isSpeaking ? 'bi-pause-fill' : 'bi-volume-up-fill'}`}></i>
                  {isSpeaking ? ' Durdur' : ' Dinle'}
                  <span className="btn-glow"></span>
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(translatedText);
                    // Kopyalama animasyonu
                    const btn = document.activeElement;
                    btn.classList.add('copy-animation');
                    setTimeout(() => btn.classList.remove('copy-animation'), 500);
                  }}
                  disabled={!translatedText}
                  className="action-btn copy-btn"
                >
                  <i className="bi bi-clipboard"></i> Kopyala
                  <span className="btn-glow"></span>
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="text-muted text-center">
          <small className="gradient-text">
            2025'de Batuhan Yalçın tarafından kodlandı
          </small>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default TranslateBox; 