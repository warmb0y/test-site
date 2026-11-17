window.menuData = [
  { 
    id: 1, name: 'Скрембл/Глазунья/Омлет', desc: 'Лосось слабосоленый, авокадо, черри, подсушенная чиабата, лист салата', 
    weight: 320, price: 650, image: 'public/images/dishes/scrembl.jpg', tag: 'hit', cat: 'later',
    compound: 'Яйца, сливки, лосось, авокадо, томаты черри, хлеб чиабата, масло сливочное, соль, перец.',
    kbju: { cal: 520, prot: 28, fat: 32, carb: 30 },
    addons: [
      { name: 'Дополнительный лосось', price: 150 },
      { name: 'Сыр Чеддер', price: 60 },
      { name: 'Авокадо', price: 90 }
    ]
  },
  { 
    id: 2, name: 'Дранники с лососем', desc: 'Дранники с картофелем и цукини, слабосоленный лосось, крем чиз', 
    weight: 280, price: 750, image: null, emoji: '🥩', tag: null, cat: 'later',
    compound: 'Картофель, цукини, яйца, мука, лосось, крем-чиз, зелень, масло растительное.',
    kbju: { cal: 480, prot: 22, fat: 26, carb: 38 },
    addons: [
      { name: 'Сметана', price: 50 },
      { name: 'Икра красная', price: 200 }
    ]
  },
  { 
    id: 3, name: 'Трио золотистых блинов с креветками', desc: 'Блины с креветками и спелым авокадо и творожным сыром', 
    weight: 250, price: 550, image: null, emoji: '🍝', tag: 'new', cat: 'later',
    compound: 'Мука, молоко, яйца, креветки, авокадо, творожный сыр, соус.',
    kbju: { cal: 410, prot: 24, fat: 18, carb: 36 },
    addons: [
      { name: 'Дополнительные креветки', price: 120 },
      { name: 'Соус Спайси', price: 40 }
    ]
  },
  { 
    id: 4, name: 'Блины с лососем', desc: 'Блины со слабосоленным лососем и мягким творожным сыром', 
    weight: 220, price: 650, image: null, emoji: '🥗', tag: null, cat: 'later',
    compound: 'Мука, молоко, яйца, лосось, творожный сыр, зелень.',
    kbju: { cal: 380, prot: 20, fat: 16, carb: 34 },
    addons: [
      { name: 'Сливки', price: 50 },
      { name: 'Лимон', price: 20 }
    ]
  },
];

window.eventsData = [
  { id: 1, tag: 'Танцевальный вечер', title: 'DJ INNOXI', desc: 'Погрузитесь в атмосферу тёплого вечера.', date: '2026-10-29', time: '20:00 – 02:00', media: [{ type: 'video', src: 'public/video/DJ INNOXI.MP4', poster: 'public/video/DJ INNOXI.jpg'}] },
  { id: 2, tag: 'Танцевальный вечер', title: 'DJ MISHA GODA', desc: 'Узнайте секреты сочетания вкусов.', date: '2026-10-31', time: '20:00 – 02:00', media: [{ type: 'video', src: 'public/video/misha.MP4', poster: 'public/video/misha.jpg'}] },
  { id: 3, tag: '18,19,26 ДЕКАБРЯ', title: 'НОВЫЙ ГОД', desc: 'Отличный повод собраться с друзьями.', date: '2026-12-18', time: '20:00 – 02:00', media: [{ type: 'image', src: 'public/images/NG.jpg' }] },
  { id: 4, tag: 'ПО БУДНЯМ', title: '-20% МЕНЮ', desc: 'С 12:00 ДО 16:00 по будням, скидка -20% на Основное меню', date: '2026-10-28', time: '12:00 - 16:00', media: [{ type: 'image', src: 'public/images/-20.jpg' }] },
];