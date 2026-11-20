export function updateRestaurantStatus() {
  const now = new Date();
  const mskOffset = 3 * 60;
  const mskTime = new Date(now.getTime() + (mskOffset + now.getTimezoneOffset()) * 60000);
  const hours = mskTime.getHours();
  const minutes = mskTime.getMinutes();
  const timeValue = hours + minutes / 60;
  const isOpen = timeValue >= 12 && timeValue < 22.5;

  const desktopBadge = document.getElementById('desktopStatusBadge');
  const desktopText = document.getElementById('desktopStatusText');
  const mobilePill = document.getElementById('mobileStatusPill');
  const mobileText = document.getElementById('mobileStatusText');

  if (isOpen) {
    desktopBadge?.classList.remove('is-closed');
    mobilePill?.classList.remove('is-closed');
    if (desktopText) desktopText.textContent = 'Доставка до 22:30 · Открыто';
    if (mobileText) mobileText.textContent = 'Доставка до 22:30';
  } else {
    desktopBadge?.classList.add('is-closed');
    mobilePill?.classList.add('is-closed');
    if (desktopText) desktopText.textContent = 'Закрыто до 12:00';
    if (mobileText) mobileText.textContent = 'Закрыто до 12:00';
  }

  const scheduleText = document.getElementById('scheduleText');
  if (scheduleText) {
    const day = mskTime.getDay();
    scheduleText.textContent = (day === 5 || day === 6) ? '12:00 - 02:00' : '12:00 - 00:00';
  }
}

export function initStatus() {
  updateRestaurantStatus();
  setInterval(updateRestaurantStatus, 60000);
}