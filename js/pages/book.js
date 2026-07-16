/**
 * CUT O'CLOCK — Booking JS
 * Calendar rendering, time slot grid generation, selection states, confirmation modal.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initCalendar();
  initBookingSlots();
  initFormSubmission();
});

let selectedDate = null;
let selectedTime = null;

function initCalendar() {
  const calGrid = document.querySelector('.cal-days');
  const calTitle = document.querySelector('.cal-month-title');
  const prevMonthBtn = document.querySelector('.cal-prev');
  const nextMonthBtn = document.querySelector('.cal-next');
  
  if (!calGrid || !calTitle) return;
  
  let date = new Date();
  let currentMonth = date.getMonth();
  let currentYear = date.getFullYear();
  
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const renderCalendar = () => {
    calGrid.innerHTML = '';
    calTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Adjust first day offset (0: Sunday, 1: Monday, etc.)
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    
    // Render blank placeholders
    for (let i = 0; i < offset; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'cal-day-empty';
      calGrid.appendChild(emptyDiv);
    }
    
    // Render active days
    const today = new Date();
    for (let day = 1; day <= totalDays; day++) {
      const dayButton = document.createElement('button');
      dayButton.type = 'button';
      dayButton.className = 'cal-day-btn';
      dayButton.textContent = day;
      
      const dayDate = new Date(currentYear, currentMonth, day);
      
      // Disable past dates
      if (dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        dayButton.disabled = true;
      }
      
      dayButton.addEventListener('click', () => {
        document.querySelectorAll('.cal-day-btn').forEach(btn => btn.classList.remove('selected'));
        dayButton.classList.add('selected');
        selectedDate = `${day} ${monthNames[currentMonth]} ${currentYear}`;
      });
      
      calGrid.appendChild(dayButton);
    }
  };
  
  prevMonthBtn?.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });
  
  nextMonthBtn?.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });
  
  renderCalendar();
}

function initBookingSlots() {
  const slotGrid = document.querySelector('.slots-grid');
  if (!slotGrid) return;
  
  const hours = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];
  
  hours.forEach(time => {
    const slotBtn = document.createElement('button');
    slotBtn.type = 'button';
    slotBtn.className = 'slot-btn';
    slotBtn.textContent = time;
    
    // Randomize some unavailable slots to make it feel "real-time"
    if (Math.random() < 0.25) {
      slotBtn.classList.add('unavailable');
      slotBtn.disabled = true;
    }
    
    slotBtn.addEventListener('click', () => {
      document.querySelectorAll('.slot-btn').forEach(btn => btn.classList.remove('selected'));
      slotBtn.classList.add('selected');
      selectedTime = time;
    });
    
    slotGrid.appendChild(slotBtn);
  });
}

function initFormSubmission() {
  const form = document.getElementById('booking-form');
  const modal = document.getElementById('confirmation-modal');
  const closeBtn = document.querySelector('.modal-close');
  const confirmBtn = document.getElementById('confirm-booking');
  
  if (!form || !modal) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!selectedDate) {
      alert('Silakan pilih tanggal terlebih dahulu di kalender.');
      return;
    }
    if (!selectedTime) {
      alert('Silakan pilih waktu/jam kunjungan.');
      return;
    }
    
    const name = document.getElementById('book-name').value;
    const phone = document.getElementById('book-phone').value;
    const email = document.getElementById('book-email').value;
    const barber = document.getElementById('book-barber').value;
    const service = document.getElementById('book-service').value;
    
    // Fill summary details
    document.getElementById('summary-name').textContent = name;
    document.getElementById('summary-phone').textContent = phone;
    document.getElementById('summary-service').textContent = service;
    document.getElementById('summary-barber').textContent = barber;
    document.getElementById('summary-date').textContent = selectedDate;
    document.getElementById('summary-time').textContent = selectedTime;
    
    modal.classList.add('open');
  });
  
  closeBtn?.addEventListener('click', () => {
    modal.classList.remove('open');
  });
  
  confirmBtn?.addEventListener('click', () => {
    // Generate WhatsApp direct text
    const name = document.getElementById('summary-name').textContent;
    const service = document.getElementById('summary-service').textContent;
    const barber = document.getElementById('summary-barber').textContent;
    const date = document.getElementById('summary-date').textContent;
    const time = document.getElementById('summary-time').textContent;
    
    const waText = `Halo Cut O'Clock, saya ingin melakukan booking appointment:\nNama: ${name}\nLayanan: ${service}\nBarber: ${barber}\nTanggal: ${date}\nJam: ${time}`;
    const encodedText = encodeURIComponent(waText);
    
    modal.classList.remove('open');
    
    // Open WhatsApp
    window.open(`https://wa.me/6281548946625?text=${encodedText}`, '_blank');
  });
}
