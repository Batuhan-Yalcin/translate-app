import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import TranslateBox from './components/TranslateBox';

function App() {
  // Animasyonlu parçacıkları oluştur
  useEffect(() => {
    // Parçacıklar oluştur
    const createParticles = () => {
      const particlesContainer = document.createElement('div');
      particlesContainer.className = 'particles';
      document.body.appendChild(particlesContainer);
      

      for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        

        const size = Math.random() * 20 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        

        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        

        particle.style.opacity = Math.random() * 0.7 + 0.1;
        
   
        const colors = [
          'rgba(255, 255, 255, 0.7)',
          'rgba(173, 216, 230, 0.7)',
          'rgba(255, 192, 203, 0.7)',
          'rgba(240, 230, 140, 0.6)',
          'rgba(144, 238, 144, 0.6)'
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        

        particle.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px ${Math.random() * 3 + 1}px rgba(255, 255, 255, 0.5)`;
        
       
        const animationDuration = Math.random() * 10 + 15;
        particle.style.animation = `float-particle ${animationDuration}s ease-in-out infinite`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particlesContainer.appendChild(particle);
      }
    };
    

    const createFloatingShapes = () => {
      const shapesContainer = document.createElement('div');
      shapesContainer.className = 'floating-shapes-container';
      document.body.appendChild(shapesContainer);
      
      // 8 şekil oluştur (daha önce 5 idi)
      for (let i = 0; i < 8; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        
        // Rastgele konum
        shape.style.top = `${Math.random() * 100}vh`;
        shape.style.left = `${Math.random() * 100}vw`;
        
        // Farklı boyutlar ve şekiller
        const size = Math.random() * 400 + 200;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        
        // Bazıları oval olsun
        if (Math.random() > 0.5) {
          shape.style.borderRadius = `${50 + Math.random() * 50}% ${50 + Math.random() * 50}% ${50 + Math.random() * 50}% ${50 + Math.random() * 50}%`;
        }
        
        // Farklı renkler - gradyanlar
        const colors = [
          'radial-gradient(circle at center, rgba(74, 108, 224, 0.25), transparent 70%)',
          'radial-gradient(circle at center, rgba(141, 92, 245, 0.25), transparent 70%)',
          'radial-gradient(circle at center, rgba(255, 255, 255, 0.25), transparent 70%)',
          'radial-gradient(circle at center, rgba(231, 60, 126, 0.25), transparent 70%)',
          'radial-gradient(circle at center, rgba(35, 166, 213, 0.25), transparent 70%)',
          'radial-gradient(circle at center, rgba(238, 119, 82, 0.2), transparent 70%)',
          'radial-gradient(circle at center, rgba(35, 213, 171, 0.2), transparent 70%)'
        ];
        shape.style.background = colors[i % colors.length];
        
        // Farklı animasyon süreleri ve gecikmeleri
        shape.style.animationDuration = `${Math.random() * 20 + 15}s`;
        shape.style.animationDelay = `${i * 2}s`;
        
        // Bulanıklık ve karışım modu
        shape.style.filter = `blur(${Math.random() * 30 + 10}px)`;
        shape.style.mixBlendMode = Math.random() > 0.5 ? 'overlay' : 'soft-light';
        
        shapesContainer.appendChild(shape);
      }
    };
    
    createParticles();
    createFloatingShapes();
    
    // Temizlik fonksiyonu
    return () => {
      const particles = document.querySelector('.particles');
      const shapes = document.querySelector('.floating-shapes-container');
      if (particles) particles.remove();
      if (shapes) shapes.remove();
    };
  }, []);
  
  return (
    <div className="App">
      <TranslateBox />
      <div className="wave-container">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
        <div className="wave wave4"></div>
      </div>
    </div>
  );
}

export default App;
