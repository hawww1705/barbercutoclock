/**
 * CUT O'CLOCK — Services JS
 * Search and categorization filtering for services menu.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initServiceFilters();
});

function initServiceFilters() {
  const searchInput = document.getElementById('search-services');
  const filterBtns = document.querySelectorAll('.service-filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  
  if (serviceCards.length === 0) return;
  
  let currentCategory = 'all';
  let searchQuery = '';
  
  const filterServices = () => {
    serviceCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const title = card.querySelector('.service-name').textContent.toLowerCase();
      const desc = card.querySelector('.service-desc').textContent.toLowerCase();
      
      const matchesCategory = (currentCategory === 'all' || category === currentCategory);
      const matchesSearch = (title.includes(searchQuery) || desc.includes(searchQuery));
      
      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => { card.style.display = 'none'; }, 200);
      }
    });
  };
  
  // Bind category buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      filterServices();
    });
  });
  
  // Bind search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterServices();
    });
  }
}
