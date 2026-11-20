export const menu = [
  { id: 1, name: 'Скрембл/Глазунья/Омлет', desc: 'Лосось слабосоленый, авокадо, черри, подсушенная чиабата, лист салата', price: 650, image: 'public/images/dishes/scrembl.jpg', tag: null, cat: 'later' },
  { id: 2, name: 'Дранники с лососем', desc: 'Дранники с картофелем и цукини, слабосоленный лосось, крем чиз', price: 750, emoji: '🥩', tag: null, cat: 'later' },
  { id: 3, name: 'Трио золотистых блинов с креветками', desc: 'Блины с креветками и спелым авокадо и творожным сыром', price: 550, emoji: '🍝', tag: null, cat: 'later' },
  { id: 4, name: 'Блины с лососем', desc: 'блины со слабосоленным лососем и мягким творожным сыром', price: 650, emoji: '🥗', tag: null, cat: 'later' },
];

export const categories = [
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

export function tagLabel(tag) {
  return { hit: 'Хит', new: 'Новинка', veg: 'Веган' }[tag] || '';
}