import { menu, categories, tagLabel } from '../data/menu.js';
import { addToCart } from '../state/cart.js';

export function renderDesktopMenu() {
  const menuGrid = document.getElementById('menuGrid');
  if (!menuGrid) return;
  menuGrid.innerHTML = menu.map((dish, i) => `
    <div class="dish-card" style="animation-delay:${0.05 + i * 0.05}s">
      ${dish.tag ? `<span class="dish-tag ${dish.tag}">${tagLabel(dish.tag)}</span>` : ''}
      <div class="dish-img">${dish.image ? `<img src="${dish.image}" alt="${dish.name}" loading="lazy">` : (dish.emoji || '🍽')}</div>
      <div>
        <div class="dish-name">${dish.name}</div>
        <div class="dish-desc">${dish.desc}</div>
      </div>
      <div class="dish-bottom">
        <div class="dish-price">${dish.price} <span class="cur">₽</span></div>
        <button class="add-btn" onclick="addToCart(${dish.id})" aria-label="Добавить">+</button>
      </div>
    </div>
  `).join('');
}

export function renderMobileCategories() {
  const catScroll = document.getElementById('catScroll');
  if (!catScroll) return;
  catScroll.innerHTML = categories.map((c, i) =>
    `<button class="cat-chip ${i === 0 ? 'active' : ''}" data-cat="${c.id}" onclick="filterMobile('${c.id}', this)">${c.label}</button>`
  ).join('');
}

export function renderMobileMenu(filter = 'all') {
  const list = document.getElementById('mobileMenuList');
  if (!list) return;
  let items = menu;
  if (filter === 'hit') items = menu.filter(d => d.tag === 'hit');
  else if (filter !== 'all') items = menu.filter(d => d.cat === filter);

  list.innerHTML = items.map((dish, i) => `
    <div class="dish-row" style="animation-delay:${i * 0.05}s">
      <div class="dish-row-img">${dish.image ? `<img src="${dish.image}" alt="${dish.name}" loading="lazy">` : (dish.emoji || '🍽')}</div>
      <div class="dish-row-info">
        <div class="dish-row-name">${dish.name}</div>
        <div class="dish-row-desc">${dish.desc}</div>
        <div class="dish-row-bottom">
          <div class="dish-row-price">${dish.price} ₽</div>
          <button class="add-btn-sm" onclick="addToCart(${dish.id})" aria-label="Добавить">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

export function initFilterMobile() {
  window.filterMobile = function (cat, btn) {
    document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    renderMobileMenu(cat);
  };
}