let toastTimer;

export function showToast(text, icon = '') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toastText').textContent = text;
  document.getElementById('toastIcon').textContent = icon;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}