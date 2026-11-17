async function loadComponent(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load ${url}`);
  return await response.text();
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

async function initApp() {
  try {
    // 1. Загружаем HTML-компоненты
    document.getElementById('desktop-container').innerHTML = await loadComponent('components/desktop.html');
    document.getElementById('mobile-container').innerHTML = await loadComponent('components/mobile.html');
    document.getElementById('modals-container').innerHTML = await loadComponent('components/modals.html');
    document.getElementById('cart-container').innerHTML = await loadComponent('components/cart.html');
    document.getElementById('story-viewer-container').innerHTML = await loadComponent('components/story-viewer.html');
    document.getElementById('dish-modal-container').innerHTML = await loadComponent('components/dish-modal.html');
    document.getElementById('toast-container').innerHTML = await loadComponent('components/toast.html');

    // 2. Загружаем JS-логику по очереди
    const scripts = [
      'js/data.js',
      'js/ui.js',
      'js/cart.js',
      'js/stories.js',
      'js/dish.js',
      'js/main.js'
    ];

    for (const src of scripts) {
      await loadScript(src);
    }

    console.log('Приложение успешно загружено!');

  } catch (err) {
    console.error('Ошибка инициализации:', err);
  }
}

document.addEventListener('DOMContentLoaded', initApp);