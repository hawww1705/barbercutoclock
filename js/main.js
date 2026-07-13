/**
 * Cut O' Clock — Premium Barbershop
 * Main JavaScript: Interactions, Animations, and Components
 */

'use strict';

/* ─────────────────────────────────────────────
   LOADING SCREEN
───────────────────────────────────────────── */
const loader = document.getElementById('loader');
document.body.classList.add('loading');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader?.classList.add('hide');
    document.body.classList.remove('loading');
    // Trigger reveal animations AFTER loader hides (so animations are visible)
    checkReveal();
  }, 2000);
});


/* ─────────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────────── */
function updateScrollProgress() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  document.documentElement.style.setProperty('--scroll-progress', progress + '%');
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.nav-hamburger');
const navMobile = document.querySelector('.nav-mobile');
const navOverlay = document.querySelector('.nav-mobile-overlay');

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }

  // Active link highlight
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute('id');
    }
  });
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

hamburger?.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  navMobile?.classList.toggle('open', isOpen);
  navOverlay?.classList.toggle('open', isOpen);
  navOverlay?.setAttribute('aria-hidden', String(!isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navOverlay?.addEventListener('click', closeMenu);

function closeMenu() {
  hamburger?.classList.remove('open');
  navMobile?.classList.remove('open');
  navOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

// Close mobile nav on link click
document.querySelectorAll('.nav-mobile a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* ─────────────────────────────────────────────
   SMOOTH SCROLL for nav links
───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar?.offsetHeight || 70;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─────────────────────────────────────────────
   HERO PARALLAX + MOUSE LIGHT
───────────────────────────────────────────── */
const heroBg   = document.querySelector('.hero-bg');
const heroLight = document.querySelector('.hero-mouse-light');
const heroSection = document.getElementById('hero');

window.addEventListener('scroll', () => {
  if (heroBg) {
    const y = window.scrollY;
    heroBg.style.transform = `scale(1.08) translateY(${y * 0.3}px)`;
  }
}, { passive: true });

if (heroSection && heroLight) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    heroLight.style.left = (e.clientX - rect.left) + 'px';
    heroLight.style.top  = (e.clientY - rect.top)  + 'px';
  });
}

/* ─────────────────────────────────────────────
   SCROLL REVEAL (Intersection Observer)
───────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

function checkReveal() {
  document.querySelectorAll('.reveal, .reveal-group, .text-reveal, .img-reveal').forEach(el => {
    revealObserver.observe(el);
  });
}

// Note: checkReveal() is called after loader hides (see load event above)
// This initial call handles elements already below the fold at page load
// It runs immediately so observers are registered, but loader covers the page

/* ─────────────────────────────────────────────
   COUNT-UP ANIMATION
───────────────────────────────────────────── */
function countUp(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach(countUp);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) statsObserver.observe(statsSection);

/* ─────────────────────────────────────────────
   GALLERY LIGHTBOX
───────────────────────────────────────────── */
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lbClose     = document.querySelector('.lightbox-close');
const lbPrev      = document.querySelector('.lightbox-prev');
const lbNext      = document.querySelector('.lightbox-next');

let galleryImages = [];
let currentLBIdx  = 0;

function initGallery() {
  galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
  galleryImages.forEach((img, i) => {
    img.closest('.gallery-item')?.addEventListener('click', () => openLightbox(i));
  });
}

function openLightbox(idx) {
  currentLBIdx = idx;
  lightboxImg.src = galleryImages[idx].src;
  lightbox?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox?.classList.remove('open');
  document.body.style.overflow = '';
}

lbClose?.addEventListener('click', closeLightbox);
lbPrev?.addEventListener('click', () => {
  currentLBIdx = (currentLBIdx - 1 + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[currentLBIdx].src;
});
lbNext?.addEventListener('click', () => {
  currentLBIdx = (currentLBIdx + 1) % galleryImages.length;
  lightboxImg.src = galleryImages[currentLBIdx].src;
});

lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox?.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lbPrev?.click();
  if (e.key === 'ArrowRight') lbNext?.click();
});

initGallery();

/* ─────────────────────────────────────────────
   TESTIMONIALS CAROUSEL
───────────────────────────────────────────── */
const track     = document.querySelector('.testimonials-track');
const slides    = document.querySelectorAll('.testimonial-slide');
const dots      = document.querySelectorAll('.testimonial-dot');
const prevBtn   = document.querySelector('.testimonial-prev');
const nextBtn   = document.querySelector('.testimonial-next');

let currentSlide = 0;
let autoSlide;

function goToSlide(n) {
  currentSlide = (n + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function startAutoSlide() {
  autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

prevBtn?.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoSlide(); });
nextBtn?.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoSlide(); });

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => { goToSlide(i); resetAutoSlide(); });
});

// Touch swipe
let touchStartX = 0;
track?.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
track?.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    diff > 0 ? goToSlide(currentSlide + 1) : goToSlide(currentSlide - 1);
    resetAutoSlide();
  }
});

if (slides.length > 0) {
  goToSlide(0);
  startAutoSlide();
}

/* ─────────────────────────────────────────────
   BUTTON RIPPLE EFFECT
───────────────────────────────────────────── */
document.querySelectorAll('.btn, .booking-wa-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top  = (e.clientY - rect.top)  + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* ─────────────────────────────────────────────
   BACK TO TOP BUTTON
───────────────────────────────────────────── */
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─────────────────────────────────────────────
   BENCHCODE DEV — FOOTER CONSTELLATION
───────────────────────────────────────────── */
function initConstellationStars() {
  const starsContainer = document.querySelector('.footer-stars');
  if (!starsContainer) return;

  const footer = document.getElementById('footer');
  const fW = footer.offsetWidth;
  const fH = footer.offsetHeight;

  const starCount = 80;
  const stars = [];

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'footer-star';

    const size = Math.random() * 2.5 + 0.8;
    const x = Math.random() * 100;
    const y = Math.random() * 100;

    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${y}%;
      opacity: ${Math.random() * 0.04 + 0.03};
    `;

    starsContainer.appendChild(star);
    stars.push({ el: star, x, y, size });
  }

  // Draw constellation lines via SVG overlay
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = `
    position: absolute; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 0; opacity: 0.03;
  `;

  // Connect nearby stars
  stars.forEach((s, i) => {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = s.x - stars[j].x;
      const dy = s.y - stars[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 14 && Math.random() > 0.5) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', s.x + '%');
        line.setAttribute('y1', s.y + '%');
        line.setAttribute('x2', stars[j].x + '%');
        line.setAttribute('y2', stars[j].y + '%');
        line.setAttribute('stroke', '#C9A227');
        line.setAttribute('stroke-width', '0.5');
        svg.appendChild(line);
      }
    }
  });

  starsContainer.appendChild(svg);
}

// Shooting star animation
function triggerShootingStar() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  const star = document.createElement('div');
  star.className = 'shooting-star';

  const startX = Math.random() * 70;
  const startY = Math.random() * 60;
  const length = 80 + Math.random() * 120;

  star.style.cssText = `
    left: ${startX}%;
    top:  ${startY}%;
    width: ${length}px;
  `;

  footer.appendChild(star);
  // Force reflow
  void star.offsetWidth;
  star.classList.add('active');

  setTimeout(() => star.remove(), 1500);
}

function scheduleShootingStar() {
  const delay = 15000 + Math.random() * 15000;
  setTimeout(() => {
    triggerShootingStar();
    scheduleShootingStar();
  }, delay);
}

// Init constellation after load
window.addEventListener('load', () => {
  initConstellationStars();
  setTimeout(scheduleShootingStar, 5000);
});

/* ─────────────────────────────────────────────
   LAZY LOADING IMAGES
───────────────────────────────────────────── */
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imgObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imgObserver.observe(img));
}

/* ─────────────────────────────────────────────
   SECTION MOUSE GLOW (About)
───────────────────────────────────────────── */
const aboutSection = document.getElementById('about');
if (aboutSection) {
  aboutSection.addEventListener('mousemove', (e) => {
    const rect = aboutSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    aboutSection.style.setProperty('--mouse-x', x + 'px');
    aboutSection.style.setProperty('--mouse-y', y + 'px');
  });
}

/* ─────────────────────────────────────────────
   NAVBAR LINK UPDATES ON RESIZE
───────────────────────────────────────────── */
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeMenu();
  }
});
