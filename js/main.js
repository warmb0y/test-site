// Отрисовка (без DOMContentLoaded, так как скрипт в конце body)
const menuGrid = document.getElementById('menuGrid');
if (menuGrid) {
  menuGrid.innerHTML = window.menuData.map(dish => `
    <div class="dish-card" onclick="openDishModal(${dish.id})">
      ${dish.tag ? `<span class="dish-tag ${dish.tag}">${dish.tag === 'hit' ? 'Хит' : 'Новинка'}</span>` : ''}
      <div class="dish-img">${dish.image ? `<img src="${dish.image}" alt="${dish.name}" loading="lazy">` : (dish.emoji || '🍽')}</div>
      <div>
        <div class="dish-name">${dish.name}</div>
        <div class="dish-desc">${dish.desc}</div>
        <div class="dish-weight">${dish.weight} г</div>
      </div>
      <div class="dish-bottom">
        <div class="dish-price">${dish.price} <span class="cur">₽</span></div>
        <button class="add-btn" onclick="event.stopPropagation(); addToCart(${dish.id})">+</button>
      </div>
    </div>
  `).join('');
}

const storiesGrid = document.getElementById('storiesGrid');
const storiesGridMobile = document.getElementById('storiesGridMobile');

const renderStories = (container) => {
  if (!container) return;
  container.innerHTML = window.eventsData.map((ev, i) => {
    const m = ev.media[0];
    const thumb = m.type === 'image' ? `<img src="${m.src}">` : (m.poster ? `<img src="${m.poster}">` : '🎬');
    return `
      <div class="story-item" onclick="openStory(${i})">
        <div class="story-ring"><div class="story-thumb">${thumb}</div></div>
        <div class="story-label">${ev.title}</div>
        <div class="story-date-mini">${ev.date.split('-').reverse().slice(0,2).join('.')}</div>
      </div>
    `;
  }).join('');
};

renderStories(storiesGrid);
renderStories(storiesGridMobile);

const mobileMenuList = document.getElementById('mobileMenuList');
if (mobileMenuList) {
  mobileMenuList.innerHTML = window.menuData.map(dish => `
    <div class="dish-row" onclick="openDishModal(${dish.id})">
      <div class="dish-row-img">${dish.image ? `<img src="${dish.image}">` : (dish.emoji || '🍽')}</div>
      <div class="dish-row-info">
        <div class="dish-row-name">${dish.name}</div>
        <div class="dish-row-desc">${dish.desc}</div>
        <div class="dish-row-bottom">
          <div class="dish-row-price">${dish.price} ₽</div>
          <button class="add-btn-sm" onclick="event.stopPropagation(); addToCart(${dish.id})">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Авторизация
let currentUser = null;
let currentRequestId = null;
let currentPhoneForAuth = '';

window.openLogin = function() { document.getElementById('loginOverlay').classList.add('open'); document.body.style.overflow = 'hidden'; };
window.closeLogin = function() { document.getElementById('loginOverlay').classList.remove('open'); document.body.style.overflow = ''; };
window.openPhone = function() { closeLogin(); document.getElementById('phoneOverlay').classList.add('open'); };
window.closePhone = function() { document.getElementById('phoneOverlay').classList.remove('open'); document.body.style.overflow = ''; };

window.openProfile = function() {
  if (!currentUser) return openLogin();
  document.getElementById('profileName').textContent = currentUser.name;
  document.getElementById('profilePhone').textContent = `+7 ${currentUser.phone}`;
  document.getElementById('profileOverlay').classList.add('open');
};

window.closeProfile = function() { document.getElementById('profileOverlay').classList.remove('open'); };

window.logout = function() {
  currentUser = null;
  closeProfile();
  document.getElementById('desktopLoginBtn').textContent = 'Войти';
  document.getElementById('desktopLoginBtn').onclick = openLogin;
  document.getElementById('mobileLoginBtn').textContent = 'Войти';
  document.getElementById('mobileLoginBtn').onclick = openLogin;
  showToast('Вы вышли из профиля', '👋');
};

document.getElementById('phoneInput')?.addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '');
  if (val.length > 10) val = val.slice(0, 10);
  let fmt = val.length > 0 ? '(' + val.slice(0, 3) : '';
  if (val.length >= 4) fmt += ') ' + val.slice(3, 6);
  if (val.length >= 7) fmt += '-' + val.slice(6, 8);
  if (val.length >= 9) fmt += '-' + val.slice(8, 10);
  e.target.value = fmt;
  document.getElementById('phoneSubmit').disabled = val.length !== 10;
});

document.getElementById('codeInput')?.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
  document.getElementById('codeSubmit').disabled = e.target.value.length !== 6;
});

window.submitPhone = async function() {
  const val = document.getElementById('phoneInput').value.replace(/\D/g, '');
  const btn = document.getElementById('phoneSubmit');
  btn.textContent = 'Отправка...';
  btn.disabled = true;
  try {
    const res = await fetch('/api/send-code', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({phone: val}) });
    const data = await res.json();
    if (res.ok && data.request_id) {
      currentRequestId = data.request_id;
      currentPhoneForAuth = val;
      closePhone();
      document.getElementById('codeOverlay').classList.add('open');
    } else {
      showToast('Ошибка: ' + (data.error || 'Неизвестно'), '⚠️');
    }
  } catch(e) { showToast('Сервер недоступен', '⚠️'); }
  btn.textContent = 'Получить код';
  btn.disabled = false;
};

window.submitCode = async function() {
  const code = document.getElementById('codeInput').value;
  const btn = document.getElementById('codeSubmit');
  btn.textContent = 'Проверка...';
  btn.disabled = true;
  try {
    const res = await fetch('/api/check-code', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({request_id: currentRequestId, code}) });
    const data = await res.json();
    if (res.ok && data.valid) {
      currentUser = { name: 'Иван', phone: currentPhoneForAuth };
      closeCode();
      document.getElementById('desktopLoginBtn').textContent = 'Профиль';
      document.getElementById('desktopLoginBtn').onclick = openProfile;
      document.getElementById('mobileLoginBtn').textContent = 'Профиль';
      document.getElementById('mobileLoginBtn').onclick = openProfile;
      showToast('Успешный вход!', '🎉');
    } else {
      showToast('Неверный код', '⚠️');
    }
  } catch(e) { showToast('Ошибка', '⚠️'); }
  btn.textContent = 'Подтвердить';
  btn.disabled = false;
};

window.closeCode = function() { document.getElementById('codeOverlay').classList.remove('open'); document.body.style.overflow = ''; };

window.openBooking = function() { document.getElementById('bookingOverlay').classList.add('open'); document.body.style.overflow = 'hidden'; };
window.closeBooking = function() { document.getElementById('bookingOverlay').classList.remove('open'); document.body.style.overflow = ''; };

window.submitBooking = async function(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Отправка...';
  try {
    await fetch('/api/send', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ type: 'booking', name: document.getElementById('bname').value, phone: document.getElementById('bphone').value })
    });
    closeBooking();
    showToast('Бронь отправлена!', '🎉');
  } catch(e) { showToast('Ошибка отправки', '⚠️'); }
  btn.textContent = 'Забронировать';
};

window.checkout = async function() {
  if (!window.cart.length) return;
  const itemsText = window.cart.map(i => `${i.name} x${i.qty} = ${i.price*i.qty} ₽`).join('\n');
  const total = window.cart.reduce((s, i) => s + i.price*i.qty, 0);
  try {
    await fetch('/api/send', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ type: 'order', items: itemsText, total }) });
    showToast('Заказ оформлен!', '🎉');
    window.cart = [];
    window.updateCart();
    closeCart();
  } catch(e) { showToast('Ошибка', '⚠️'); }
};

function updateStatus() {
  const now = new Date();
  const hour = now.getHours();
  const isOpen = hour >= 12 && hour < 24;
  const text = isOpen ? 'Сейчас открыто' : 'Сейчас закрыто';
  if (document.getElementById('desktopStatusText')) document.getElementById('desktopStatusText').textContent = text;
  if (document.getElementById('mobileStatusText')) document.getElementById('mobileStatusText').textContent = text;
  if (document.getElementById('desktopStatusBadge')) document.getElementById('desktopStatusBadge').classList.toggle('is-closed', !isOpen);
  if (document.getElementById('mobileStatusPill')) document.getElementById('mobileStatusPill').classList.toggle('is-closed', !isOpen);
}
updateStatus();
setInterval(updateStatus, 60000);

// Мобильные категории
const catScroll = document.getElementById('catScroll');
const categories = [
  { id: 'all', label: 'Всё' },
  { id: 'hit', label: '🔥 Хиты' },
  { id: 'later', label: 'Поздние завтраки (до 16:00)' },
  { id: 'salad', label: 'Салаты' },
  { id: 'cold', label: 'Что-то особенное' },
  { id: 'hot', label: 'Горячие закуски' },
  { id: 'soup', label: 'Супы' },
  { id: 'main', label: 'Горячее блюдо' },
  { id: 'pasta', label: 'Пасты' },
  { id: 'dessert', label: 'Десерты' },
  { id: 'garnish', label: 'Гарниры' },
  { id: 'sause', label: 'Соусы' },
  { id: 'drink', label: 'Напитки' },
];

if (catScroll) {
  catScroll.innerHTML = categories.map((c, i) =>
    `<button class="cat-chip ${i === 0 ? 'active' : ''}" data-cat="${c.id}" onclick="filterMobile('${c.id}', this)">${c.label}</button>`
  ).join('');
}

window.filterMobile = function(cat, btn) {
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const list = document.getElementById('mobileMenuList');
  if (!list) return;
  let items = window.menuData;
  if (cat === 'hit') items = window.menuData.filter(d => d.tag === 'hit');
  else if (cat !== 'all') items = window.menuData.filter(d => d.cat === cat);

  list.innerHTML = items.map(dish => `
    <div class="dish-row" onclick="openDishModal(${dish.id})">
      <div class="dish-row-img">${dish.image ? `<img src="${dish.image}">` : (dish.emoji || '🍽')}</div>
      <div class="dish-row-info">
        <div class="dish-row-name">${dish.name}</div>
        <div class="dish-row-desc">${dish.desc}</div>
        <div class="dish-row-bottom">
          <div class="dish-row-price">${dish.price} ₽</div>
          <button class="add-btn-sm" onclick="event.stopPropagation(); addToCart(${dish.id})">+</button>
        </div>
      </div>
    </div>
  `).join('');
};