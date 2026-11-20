import { updateCart, addToCart, changeQty, openCart, closeCart, checkout } from './state/cart.js';
import { renderDesktopMenu, renderMobileCategories, renderMobileMenu, initFilterMobile } from './ui/renderMenu.js';
import { renderStories } from './ui/renderStories.js';
import { showToast } from './ui/toast.js';
import { openStory, closeStory, nextSlide, prevSlide } from './features/storyViewer.js';
import { openBooking, closeBooking, submitBooking, initBooking } from './features/booking.js';
import { openLogin, closeLogin, openPhone, closePhone, submitPhone, openLegal, closeLegal, initAuth } from './features/auth.js';
import { openSchedule, closeSchedule } from './features/schedule.js';
import { initStatus } from './features/status.js';
import { initScrollSpy } from './features/scrollspy.js';
import { initLiquidGlass } from './features/liquidGlass.js';

/* ==== ПРОБРАСЫВАЕМ НА window, чтобы работали onclick="..." в HTML ==== */
Object.assign(window, {
  addToCart, changeQty, openCart, closeCart, checkout,
  openStory, closeStory, nextSlide, prevSlide,
  openBooking, closeBooking, submitBooking,
  openLogin, closeLogin, openPhone, closePhone, submitPhone, openLegal, closeLegal,
  openSchedule, closeSchedule,
  showToast,
  filterMobile: null, // будет назначено в initFilterMobile
});

/* ==== РЕНДЕР ==== */
renderDesktopMenu();
renderStories('storiesGrid');
renderStories('storiesGridMobile');
renderMobileCategories();
initFilterMobile();
renderMobileMenu();
updateCart();

/* ==== ИНИЦИАЛИЗАЦИЯ ==== */
initBooking();
initAuth();
initStatus();
initScrollSpy();
initLiquidGlass();

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.overflow = '';
});