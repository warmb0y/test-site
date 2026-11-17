let currentModalDish = null;
let currentModalQty = 1;
let currentKbjuMode = 'portion';

window.openDishModal = function(id) {
  const dish = window.menuData.find(d => d.id === id);
  if (!dish) return;
  currentModalDish = dish;
  currentModalQty = 1;
  currentKbjuMode = 'portion';

  document.getElementById('dmImg').src = dish.image || 'https://via.placeholder.com/500x300/123322/3ea56a?text=' + dish.emoji;
  document.getElementById('dmTitle').textContent = dish.name;
  document.getElementById('dmWeight').textContent = `${dish.weight} г`;
  document.getElementById('dmPrice').textContent = `${dish.price} ₽`;
  document.getElementById('dmDesc').textContent = dish.desc;
  document.getElementById('dmCompound').innerHTML = `<strong>Состав:</strong> ${dish.compound}`;
  document.getElementById('dmQty').textContent = currentModalQty;
  
  document.querySelectorAll('.kbju-toggle button')[0].classList.add('active');
  document.querySelectorAll('.kbju-toggle button')[1].classList.remove('active');
  updateKbjuDisplay();

  const addonsEl = document.getElementById('dmAddons');
  if (dish.addons && dish.addons.length) {
    addonsEl.innerHTML = dish.addons.map((a, i) => `
      <div class="addon-item" onclick="toggleAddon(this)" data-price="${a.price}">
        <div class="addon-left">
          <div class="addon-checkbox"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          <span class="addon-name">${a.name}</span>
        </div>
        <span class="addon-price">+${a.price} ₽</span>
      </div>
    `).join('');
  } else {
    addonsEl.innerHTML = '<div style="color: var(--muted); font-size: 14px;">Нет доступных дополнений</div>';
  }

  document.getElementById('dishModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeDishModal = function() {
  document.getElementById('dishModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
};

window.toggleKbju = function(mode, btn) {
  currentKbjuMode = mode;
  document.querySelectorAll('.kbju-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateKbjuDisplay();
};

function updateKbjuDisplay() {
  if (!currentModalDish) return;
  const { cal, prot, fat, carb } = currentModalDish.kbju;
  if (currentKbjuMode === 'portion') {
    document.getElementById('kbjuCal').textContent = cal;
    document.getElementById('kbjuProt').textContent = prot;
    document.getElementById('kbjuFat').textContent = fat;
    document.getElementById('kbjuCarb').textContent = carb;
  } else {
    const w = currentModalDish.weight / 100;
    document.getElementById('kbjuCal').textContent = Math.round(cal / w);
    document.getElementById('kbjuProt').textContent = (prot / w).toFixed(1);
    document.getElementById('kbjuFat').textContent = (fat / w).toFixed(1);
    document.getElementById('kbjuCarb').textContent = (carb / w).toFixed(1);
  }
}

window.toggleAddon = function(el) {
  el.classList.toggle('selected');
};

window.changeModalQty = function(delta) {
  currentModalQty = Math.max(1, currentModalQty + delta);
  document.getElementById('dmQty').textContent = currentModalQty;
};

window.addFromModal = function() {
  if (!currentModalDish) return;
  const addons = [];
  document.querySelectorAll('.addon-item.selected').forEach(el => {
    addons.push({
      name: el.querySelector('.addon-name').textContent,
      price: parseInt(el.dataset.price)
    });
  });
  addToCart(currentModalDish.id, currentModalQty, addons);
  closeDishModal();
};