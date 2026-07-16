/**
 * CUT O'CLOCK — Home JS
 * Before/After slider, testimonials carousel, count-up statistics.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSlider();
  initTestimonials();
  initStatsCounter();
});

/* ── Before & After Image Slider ── */
function initBeforeAfterSlider() {
  const container = document.querySelector('.ba-slider');
  const afterImage = document.querySelector('.ba-after');
  const handle = document.querySelector('.ba-handle');
  
  if (!container || !afterImage || !handle) return;
  
  let isDragging = false;
  
  const moveSlider = (clientX) => {
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    
    afterImage.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };
  
  const startDrag = () => { isDragging = true; };
  const stopDrag = () => { isDragging = false; };
  
  handle.addEventListener('mousedown', startDrag);
  window.addEventListener('mouseup', stopDrag);
  
  container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    moveSlider(e.clientX);
  });
  
  // Touch support
  handle.addEventListener('touchstart', startDrag);
  window.addEventListener('touchend', stopDrag);
  container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    moveSlider(e.touches[0].clientX);
  });
}

/* ── Testimonials Carousel ── */
function initTestimonials() {
  const track = document.querySelector('.testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  
  if (!track || slides.length === 0) return;
  
  let currentIndex = 0;
  let autoSlideTimer;
  
  const goToSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  };
  
  const startAutoSlide = () => {
    autoSlideTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
  };
  
  const resetTimer = () => {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  };
  
  // Bind dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetTimer();
    });
  });
  
  // Swipe support for testimonials
  let startX = 0;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diffX = startX - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
      resetTimer();
    }
  });
  
  startAutoSlide();
}

/* ── Statistics Counter ── */
function initStatsCounter() {
  const statsSection = document.querySelector('.stats-grid');
  const counters = document.querySelectorAll('.stat-num');
  
  if (!statsSection || counters.length === 0) return;
  
  let started = false;
  
  const startCounting = () => {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const duration = 2000; // 2 seconds counting animation
      const stepTime = 16; // 60fps
      const steps = duration / stepTime;
      const stepVal = target / steps;
      
      let current = 0;
      
      const timer = setInterval(() => {
        current += stepVal;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        
        // Formatting decimals or integers
        if (Number.isInteger(target)) {
          counter.textContent = Math.floor(current);
        } else {
          counter.textContent = current.toFixed(1);
        }
      }, stepTime);
    });
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        startCounting();
      }
    });
  }, { threshold: 0.5 });
  
  observer.observe(statsSection);
}
