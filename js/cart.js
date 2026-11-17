window.cart = [];
const DELIVERY_FEE = 149;
const FREE_DELIVERY_FROM = 1500;

window.addToCart = function(id, qty = 1, addons = []) {
  const dish = window.menuData.find(d => d.id === id);
  if (!dish) return;
  
  const addonPrice = addons.reduce((s, a) => s + a.price, 0);
  const itemPrice = dish.price + addonPrice;
  const cartItemId = id + '_' + addons.map(a => a.name).join('_');
  const existing = window.cart.find(i => i.cartItemId === cartItemId);
  
  if (existing) {
    existing.qty += qty;
  } else {
    window.cart.push({ ...dish, cartItemId, price: itemPrice, qty, selectedAddons: addons });
  }
  updateCart();
  showToast(`✓ ${dish.name} добавлено`);
};

window.changeQty = function(cartItemId, delta) {
  const item = window.cart.find(i => i.cartItemId === cartItemId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) window.cart = window.cart.filter(i => i.cartItemId !== cartItemId);
  updateCart();
};

window.updateCart = function() {
  const count = window.cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartBadge').textContent = count;
  if (document.getElementById('cartBadgeMobile')) document.getElementById('cartBadgeMobile').textContent = count;

  const subtotal = window.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal === 0 ? 0 : (subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE);
  const total = subtotal + delivery;

  const mobileTotal = document.getElementById('mobileCartTotal');
  if (mobileTotal) mobileTotal.textContent = total > 0 ? `${total} ₽` : '';

  const itemsEl = document.getElementById('cartItems');
  if (itemsEl) {
    if (window.cart.length === 0) {
      itemsEl.innerHTML = `<div class="cart-empty"><div class="big">🛒</div><div>Корзина пуста</div></div>`;
    } else {
      itemsEl.innerHTML = window.cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-img">${item.image ? `<img src="${item.image}">` : (item.emoji || '🍽')}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            ${item.selectedAddons.length ? `<div style="font-size: 11px; color: var(--green-light);">+ ${item.selectedAddons.map(a => a.name).join(', ')}</div>` : ''}
            <div class="cart-item-price">${item.price} ₽</div>
          </div>
          <div class="qty-control">
            <button class="qty-btn" onclick="changeQty('${item.cartItemId}', -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.cartItemId}', 1)">+</button>
          </div>
        </div>
      `).join('');
    }
  }

  document.getElementById('deliveryCost').textContent = delivery === 0 ? 'Бесплатно' : `${delivery} ₽`;
  document.getElementById('cartTotal').textContent = `${total} ₽`;
  document.getElementById('checkoutBtn').disabled = window.cart.length === 0;
};

window.openCart = function() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartDrawer').classList.add('open');
  document.body.style.overflow = 'hidden';
};
window.closeCart = function() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartDrawer').classList.remove('open');
  document.body.style.overflow = '';
};