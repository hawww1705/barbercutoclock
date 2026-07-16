/**
 * CUT O'CLOCK — About JS
 * Handles specific hover state enhancements on barber cards and timeline milestone triggers.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initBarberCards();
});

function initBarberCards() {
  const cards = document.querySelectorAll('.barber-card');
  
  cards.forEach(card => {
    // Elegant scale and gold lighting overlay on hover handled primarily by CSS,
    // but we can add minor dynamic class toggles here if needed.
    card.addEventListener('mouseenter', () => {
      card.classList.add('hovered');
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('hovered');
    });
  });
}
