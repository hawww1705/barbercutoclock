/**
 * CUT O'CLOCK — Contact JS
 * FAQ Accordion collapse/expand and message form validation.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
  initContactForm();
});

/* ── FAQ Accordion ── */
function initFaqAccordion() {
  const headers = document.querySelectorAll('.faq-header');
  
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.faq-item');
      const body = item.querySelector('.faq-body');
      const icon = header.querySelector('.faq-icon');
      
      const isOpen = item.classList.toggle('open');
      
      if (isOpen) {
        body.style.maxHeight = body.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
      } else {
        body.style.maxHeight = '0';
        icon.style.transform = 'rotate(0)';
      }
      
      // Close other accordion items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-body').style.maxHeight = '0';
          otherItem.querySelector('.faq-icon').style.transform = 'rotate(0)';
        }
      });
    });
  });
}

/* ── Contact Form Validation & Feedback ── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedbackMsg = document.getElementById('form-feedback');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    
    if (name.length < 2) {
      showFeedback('Nama harus minimal 2 karakter.', 'error');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback('Silakan masukkan format email yang valid.', 'error');
      return;
    }
    
    if (message.length < 10) {
      showFeedback('Pesan harus berisi minimal 10 karakter.', 'error');
      return;
    }
    
    // Simulate successful API submission
    showFeedback('Terima kasih! Pesan Anda telah terkirim.', 'success');
    form.reset();
  });
  
  function showFeedback(text, type) {
    if (!feedbackMsg) return;
    feedbackMsg.textContent = text;
    feedbackMsg.className = `form-feedback ${type}`;
    feedbackMsg.style.display = 'block';
    
    setTimeout(() => {
      feedbackMsg.style.display = 'none';
    }, 5000);
  }
}
