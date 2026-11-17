let toastTimeout;

window.showToast = function(text, icon = '✓') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toastText').textContent = text;
  document.getElementById('toastIcon').textContent = icon;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
};

window.openSideMenu = function() { 
  document.getElementById('sideMenuOverlay').classList.add('open'); 
  document.getElementById('sideMenu').classList.add('open'); 
  document.body.style.overflow = 'hidden';
};

window.closeSideMenu = function() { 
  document.getElementById('sideMenuOverlay').classList.remove('open'); 
  document.getElementById('sideMenu').classList.remove('open'); 
  document.body.style.overflow = '';
};

window.openSchedule = function() { alert('Работаем с 12:00 до 00:00'); };
window.closeSchedule = function() {};