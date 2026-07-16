/**
 * CUT O'CLOCK — Promotions JS
 * Real-time limited countdown timer.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initPromoCountdown();
});

function initPromoCountdown() {
  const timerElement = document.getElementById('promo-countdown');
  if (!timerElement) return;
  
  // Set target date (e.g. 7 days from now)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7);
  targetDate.setHours(23, 59, 59, 0);
  
  const updateTimer = () => {
    const now = new Date().getTime();
    const difference = targetDate.getTime() - now;
    
    if (difference <= 0) {
      timerElement.textContent = "PROMO BERAKHIR";
      return;
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    // Formatting numbers
    const format = (num) => String(num).padStart(2, '0');
    
    timerElement.innerHTML = `
      <div class="countdown-unit"><span>${format(days)}</span><small>Hari</small></div>
      <div class="countdown-unit"><span>${format(hours)}</span><small>Jam</small></div>
      <div class="countdown-unit"><span>${format(minutes)}</span><small>Menit</small></div>
      <div class="countdown-unit"><span>${format(seconds)}</span><small>Detik</small></div>
    `;
  };
  
  updateTimer();
  setInterval(updateTimer, 1000);
}
