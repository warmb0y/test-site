import { menu } from '../data/menu.js';
import { showToast } from '../ui/toast.js';

let cart = [];
const DELIVERY_FEE = 149;
const FREE_DELIVERY_FROM = 1500;

export function getCart() { return cart; }

export function addToCart(id) {
  const dish = menu.find(d => d.id === id);
  if (!dish) return;
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...dish, qty: 1 });
  updateCart();
  showToast(`✓ ${dish.name} добавлено`);
}

export function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  updateCart();
}

export function updateCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = count;
  const mobileBadge = document.getElementById('cartBadgeMobile');
  if (mobileBadge) mobileBadge.textContent = count;

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal === 0 ? 0 : (subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE);
  const total = subtotal + delivery;

  const mobileTotal = document.getElementById('mobileCartTotal');
  if (mobileTotal) mobileTotal.textContent = total > 0 ? `${total} ₽` : '';

  const itemsEl = document.getElementById('cartItems');
  if (itemsEl) {
    if (cart.length === 0) {
      itemsEl.innerHTML = `<div class="cart-empty"><div class="big">🛒</div><div>Корзина пуста</div><div style="font-size:13px;margin-top:8px;">Добавьте блюда из меню</div></div>`;
    } else {
      itemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-img">${item.image ? `<img src="${item.image}" alt="${item.name}" loading="lazy">` : (item.emoji || '🍽')}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${item.price} ₽</div>
          </div>
          <div class="qty-control">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
      `).join('');
    }
  }

  const deliveryEl = document.getElementById('deliveryCost');
  if (deliveryEl) deliveryEl.textContent = delivery === 0 ? 'Бесплатно' : `${delivery} ₽`;
  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = `${total} ₽`;

  const checkout = document.getElementById('checkoutBtn');
  if (checkout) checkout.disabled = cart.length === 0;
}

export function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartDrawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartDrawer').classList.remove('open');
  document.body.style.overflow = '';
}

export async function checkout() {
  if (cart.length === 0) return;
  const btn = document.getElementById('checkoutBtn');
  const originalText = btn.textContent;
  btn.textContent = 'Отправка...';
  btn.disabled = true;

  const itemsText = cart.map(item => `${item.name} x${item.qty} = ${item.price * item.qty} ₽`).join('\n');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  try {
    const res = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'order', items: itemsText, total }),
    });

    if (res.ok) {
      showToast('✓ Заказ оформлен! Курьер уже в пути 🚚', '🎉');
      cart = [];
      updateCart();
      closeCart();
    } else {
      showToast('❌ Ошибка при оформлении заказа', '⚠️');
    }
  } catch (err) {
    console.error(err);
    showToast('❌ Сервер недоступен', '⚠️');
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}