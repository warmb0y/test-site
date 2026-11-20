export function openSchedule(type) {
  const overlay = document.getElementById('scheduleOverlay');
  const title = document.getElementById('scheduleTitle');
  const list = document.getElementById('scheduleList');
  const now = new Date();
  const mskOffset = 3 * 60;
  const mskTime = new Date(now.getTime() + (mskOffset + now.getTimezoneOffset()) * 60000);
  const currentDay = mskTime.getDay();
  const days = [
    { name: 'Понедельник', idx: 1 }, { name: 'Вторник', idx: 2 },
    { name: 'Среда', idx: 3 }, { name: 'Четверг', idx: 4 },
    { name: 'Пятница', idx: 5 }, { name: 'Суббота', idx: 6 },
    { name: 'Воскресенье', idx: 0 },
  ];
  let html = '';
  if (type === 'delivery') {
    title.textContent = 'Время работы доставки';
    days.forEach(d => {
      const isToday = d.idx === currentDay;
      html += `<div class="schedule-row ${isToday ? 'today' : ''}">
        <span class="day-name">${d.name}${isToday ? ' (сегодня)' : ''}</span>
        <span class="day-time">12:00 – 22:30</span>
      </div>`;
    });
  } else {
    title.textContent = 'График работы ресторана';
    days.forEach(d => {
      const isToday = d.idx === currentDay;
      const time = (d.idx === 5 || d.idx === 6) ? '12:00 – 02:00' : '12:00 – 00:00';
      html += `<div class="schedule-row ${isToday ? 'today' : ''}">
        <span class="day-name">${d.name}${isToday ? ' (сегодня)' : ''}</span>
        <span class="day-time">${time}</span>
      </div>`;
    });
  }
  list.innerHTML = html;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeSchedule() {
  document.getElementById('scheduleOverlay').classList.remove('open');
  document.body.style.overflow = '';
}