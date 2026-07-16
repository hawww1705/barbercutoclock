/**
 * CUT O'CLOCK — Blog JS
 * Magazine search, filtering by tags, reading time labels.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initBlogFilter();
});

function initBlogFilter() {
  const searchInput = document.getElementById('search-articles');
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const articles = document.querySelectorAll('.article-card');
  
  if (articles.length === 0) return;
  
  let currentCategory = 'all';
  let searchQuery = '';
  
  const filterArticles = () => {
    articles.forEach(card => {
      const category = card.getAttribute('data-category');
      const title = card.querySelector('.article-title').textContent.toLowerCase();
      const excerpt = card.querySelector('.article-excerpt').textContent.toLowerCase();
      
      const matchesCategory = (currentCategory === 'all' || category === currentCategory);
      const matchesSearch = (title.includes(searchQuery) || excerpt.includes(searchQuery));
      
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
  
  // Category filter
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      filterArticles();
    });
  });
  
  // Search filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterArticles();
    });
  }
}
