/**
 * CUT O'CLOCK — Gallery JS
 * Category filtering, lightbox overlay and masonry rendering helper.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initLightbox();
});

/* ── Gallery Filtering ── */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  
  if (items.length === 0) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.92)';
          setTimeout(() => { item.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* ── Lightbox Overlay ── */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  const galleryImgs = document.querySelectorAll('.gallery-item img');
  
  if (!lightbox || !lightboxImg || galleryImgs.length === 0) return;
  
  let currentIdx = 0;
  
  const openLightbox = (index) => {
    currentIdx = index;
    lightboxImg.src = galleryImgs[currentIdx].src;
    lightboxImg.alt = galleryImgs[currentIdx].alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  
  const showPrev = () => {
    currentIdx = (currentIdx - 1 + galleryImgs.length) % galleryImgs.length;
    // Check if the current image is visible (not hidden by category filter)
    let count = 0;
    while (galleryImgs[currentIdx].closest('.gallery-item').style.display === 'none' && count < galleryImgs.length) {
      currentIdx = (currentIdx - 1 + galleryImgs.length) % galleryImgs.length;
      count++;
    }
    lightboxImg.src = galleryImgs[currentIdx].src;
    lightboxImg.alt = galleryImgs[currentIdx].alt;
  };
  
  const showNext = () => {
    currentIdx = (currentIdx + 1) % galleryImgs.length;
    let count = 0;
    while (galleryImgs[currentIdx].closest('.gallery-item').style.display === 'none' && count < galleryImgs.length) {
      currentIdx = (currentIdx + 1) % galleryImgs.length;
      count++;
    }
    lightboxImg.src = galleryImgs[currentIdx].src;
    lightboxImg.alt = galleryImgs[currentIdx].alt;
  };
  
  // Bind images
  galleryImgs.forEach((img, index) => {
    img.addEventListener('click', () => {
      openLightbox(index);
    });
  });
  
  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', showPrev);
  nextBtn?.addEventListener('click', showNext);
  
  // Close on outer click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
}
