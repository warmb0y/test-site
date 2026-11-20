export const events = [
  { id: 1, tag: 'Танцевальный вечер', title: 'DJ INNOXI', desc: 'Погрузитесь в атмосферу тёплого вечера.', date: '2026-10-29', time: '20:00 – 02:00', emoji: '🎷', media: [{ type: 'video', src: 'public/video/DJ INNOXI.MP4', poster: 'public/video/DJ INNOXI.jpg' }] },
  { id: 2, tag: 'Танцевальный вечер', title: 'DJ MISHA GODA', desc: 'Узнайте секреты сочетания вкусов.', date: '2026-10-31', time: '20:00 – 02:00', emoji: '🍷', media: [{ type: 'video', src: 'public/video/misha.MP4', poster: 'public/video/misha.jpg' }] },
  { id: 3, tag: '18,19,26 ДЕКАБРЯ', title: 'НОВЫЙ ГОД', desc: 'Отличный повод собраться с друзьями.', date: '2026-12-18', time: '20:00 – 02:00', emoji: '🥂', media: [{ type: 'image', src: 'public/images/NG.jpg' }] },
  { id: 4, tag: 'ПО БУДНЯМ', title: '-20% МЕНЮ', desc: 'С 12:00 ДО 16:00 по будням, скидка -20% на Основное меню', date: '2026-10-28', time: '12:00 - 16:00', emoji: '', media: [{ type: 'image', src: 'public/images/-20.jpg' }] },
];

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}