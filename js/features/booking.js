import { showToast } from '../ui/toast.js';

let currentCalDate = new Date();
let selectedCalDate = null;
const months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const weekdays = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

export function openBooking(eventDate = null) {
  document.getElementById('bookingOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  const dateInput = document.getElementById('bdate');
  if (eventDate) {
    const [y, m, d] = eventDate.split('-');
    dateInput.value = `${d}.${m}.${y}`;
    selectedCalDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    currentCalDate = new Date(parseInt(y), parseInt(m) - 1, 1);
  } else if (!dateInput.value) {
    const today = new Date();
    dateInput.value = `${String(today.getDate()).padStart(2,'0')}.${String(today.getMonth()+1).padStart(2,'0')}.${today.getFullYear()}`;
  }
}

export function closeBooking() {
  document.getElementById('bookingOverlay').classList.remove('open');
  document.body.style.overflow = '';
  document.getElementById('customCalendar').classList.remove('open');
  document.getElementById('customTimeDropdown').classList.remove('open');
}

function toggleDropdown(dropdownId, inputElement) {
  const dropdown = document.getElementById(dropdownId);
  const isOpen = dropdown.classList.contains('open');
  document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));
  if (!isOpen) {
    dropdown.classList.add('open');
    const rect = inputElement.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow < 300) dropdown.classList.add('drop-up');
    else dropdown.classList.remove('drop-up');
  }
}

function renderCalendar() {
  const grid = document.getElementById('calGrid');
  const title = document.getElementById('calTitle');
  if (!grid || !title) return;
  const year = currentCalDate.getFullYear();
  const month = currentCalDate.getMonth();
  title.textContent = `${months[month]} ${year}`;
  grid.innerHTML = '';
  weekdays.forEach(wd => {
    const el = document.createElement('div');
    el.className = 'cal-weekday';
    el.textContent = wd;
    grid.appendChild(el);
  });
  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < startDay; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    grid.appendChild(el);
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let d = 1; d <= daysInMonth; d++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cal-day';
    btn.textContent = d;
    const thisDate = new Date(year, month, d);
    if (thisDate < today) btn.disabled = true;
    else btn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedCalDate = thisDate;
      const dd = String(d).padStart(2, '0');
      const mm = String(month + 1).padStart(2, '0');
      document.getElementById('bdate').value = `${dd}.${mm}.${year}`;
      document.getElementById('customCalendar').classList.remove('open');
      renderCalendar();
    });
    if (thisDate.getTime() === today.getTime()) btn.classList.add('today');
    if (selectedCalDate && thisDate.getTime() === selectedCalDate.getTime()) btn.classList.add('selected');
    grid.appendChild(btn);
  }
  const prevBtn = document.getElementById('calPrev');
  const now = new Date();
  prevBtn.disabled = year === now.getFullYear() && month === now.getMonth();
}

function renderTimeSlots() {
  const grid = document.getElementById('timeGrid');
  if (!grid) return;
  grid.innerHTML = '';
  for (let h = 12; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 22 && m > 30) continue;
      const timeStr = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'time-slot';
      btn.textContent = timeStr;
      if (timeStr === document.getElementById('btime').value) btn.classList.add('selected');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('btime').value = timeStr;
        document.getElementById('customTimeDropdown').classList.remove('open');
        renderTimeSlots();
      });
      grid.appendChild(btn);
    }
  }
}

export async function submitBooking(e) {
  e.preventDefault();
  const name = document.getElementById('bname').value;
  const phone = document.getElementById('bphone').value;
  const date = document.getElementById('bdate').value;
  const time = document.getElementById('btime').value;
  const guests = document.getElementById('bguests').value;

  const btn = document.querySelector('.booking-submit');
  const originalText = btn.textContent;
  btn.textContent = 'Отправка...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'booking', name, phone, date, time, guests }),
    });
    if (res.ok) {
      closeBooking();
      showToast(`✓ ${name}, ждём вас ${date} в ${time}`, '🎉');
      document.getElementById('bookingForm').reset();
      document.getElementById('btime').value = '19:00';
      document.getElementById('bdate').value = '';
      document.getElementById('bguests').value = '2';
    } else {
      showToast('❌ Ошибка при отправке брони', '⚠️');
    }
  } catch (err) {
    console.error(err);
    showToast('❌ Сервер недоступен', '⚠️');
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

export function initBooking() {
  document.getElementById('bdate').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown('customCalendar', e.target);
    if (document.getElementById('customCalendar').classList.contains('open')) {
      currentCalDate = selectedCalDate
        ? new Date(selectedCalDate.getFullYear(), selectedCalDate.getMonth(), 1)
        : new Date();
      renderCalendar();
    }
  });
  document.getElementById('calPrev').addEventListener('click', (e) => {
    e.stopPropagation();
    currentCalDate.setMonth(currentCalDate.getMonth() - 1);
    renderCalendar();
  });
  document.getElementById('calNext').addEventListener('click', (e) => {
    e.stopPropagation();
    currentCalDate.setMonth(currentCalDate.getMonth() + 1);
    renderCalendar();
  });
  document.getElementById('btime').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown('customTimeDropdown', e.target);
  });
  document.addEventListener('click', (e) => {
    const cal = document.getElementById('customCalendar');
    const time = document.getElementById('customTimeDropdown');
    const dateInput = document.getElementById('bdate');
    const timeInput = document.getElementById('btime');
    if (cal.classList.contains('open') && !cal.contains(e.target) && e.target !== dateInput) cal.classList.remove('open');
    if (time.classList.contains('open') && !time.contains(e.target) && e.target !== timeInput) time.classList.remove('open');
  });

  const guestInput = document.getElementById('bguests');
  const guestMinus = document.getElementById('guestMinus');
  const guestPlus = document.getElementById('guestPlus');
  guestMinus.addEventListener('click', () => {
    const val = parseInt(guestInput.value) || 1;
    if (val > 1) guestInput.value = val - 1;
  });
  guestPlus.addEventListener('click', () => {
    const val = parseInt(guestInput.value) || 0;
    if (val < 80) guestInput.value = val + 1;
  });
  guestInput.addEventListener('input', () => {
    const val = parseInt(guestInput.value);
    if (guestInput.value === '') return;
    if (isNaN(val) || val < 1) guestInput.value = 1;
    if (val > 80) guestInput.value = 80;
  });
  guestInput.addEventListener('blur', () => {
    const val = parseInt(guestInput.value);
    if (isNaN(val) || val < 1) guestInput.value = 1;
  });

  renderTimeSlots();
}