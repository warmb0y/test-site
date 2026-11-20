import { showToast } from '../ui/toast.js';

export function openLogin() {
  document.getElementById('loginOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeLogin() {
  document.getElementById('loginOverlay').classList.remove('open');
  if (!document.querySelector('.phone-overlay.open, .legal-overlay.open')) {
    document.body.style.overflow = '';
  }
}

export function openPhone() {
  closeLogin();
  document.getElementById('phoneOverlay').classList.add('open');
  const input = document.getElementById('phoneInput');
  if (input) input.value = '';
  validatePhone();
}

export function closePhone() {
  document.getElementById('phoneOverlay').classList.remove('open');
  if (!document.querySelector('.login-overlay.open, .legal-overlay.open')) {
    document.body.style.overflow = '';
  }
}

export function submitPhone() {
  const input = document.getElementById('phoneInput');
  const val = input ? input.value.replace(/\D/g, '') : '';
  if (val.length === 10) {
    showToast('✓ Код отправлен на номер +7 ' + val, '📱');
    closePhone();
  }
}

function validatePhone() {
  const input = document.getElementById('phoneInput');
  const btn = document.getElementById('phoneSubmit');
  if (!input || !btn) return;
  const val = input.value.replace(/\D/g, '');
  btn.disabled = val.length !== 10;
}

export function openLegal() {
  document.getElementById('legalOverlay').classList.add('open');
}

export function closeLegal() {
  document.getElementById('legalOverlay').classList.remove('open');
  if (!document.querySelector('.phone-overlay.open, .login-overlay.open')) {
    document.body.style.overflow = '';
  }
}

export function initAuth() {
  const phoneInput = document.getElementById('phoneInput');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 10) val = val.slice(0, 10);
      let formatted = '';
      if (val.length > 0) formatted = '(' + val.slice(0, 3);
      if (val.length >= 4) formatted += ') ' + val.slice(3, 6);
      if (val.length >= 7) formatted += '-' + val.slice(6, 8);
      if (val.length >= 9) formatted += '-' + val.slice(8, 10);
      e.target.value = formatted;
      validatePhone();
    });
    phoneInput.addEventListener('keypress', (e) => {
      if (!/[0-9]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) {
        e.preventDefault();
      }
    });
  }
}