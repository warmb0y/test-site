export default async function handler(req, res) {
  console.log('--- FUNCTION STARTED ---'); // Это должно появиться в логах
  console.log('Method:', req.method);
  
  try {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const { type, ...data } = req.body;

  const BOT_TOKEN = process.env.TG_BOT_TOKEN;
  const CHAT_ID = process.env.TG_CHAT_ID;
  const THREAD_ID = type === 'booking' 
    ? process.env.TG_THREAD_BOOKING 
    : process.env.TG_THREAD_ORDER;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ ok: false, error: 'Telegram config missing' });
  }

  let message = '';
  if (type === 'booking') {
    message = `🍽 *Новое бронирование!*\n\n` +
              `👤 *Имя:* ${data.name}\n` +
              `📞 *Телефон:* ${data.phone}\n` +
              `📅 *Дата:* ${data.date}\n` +
              `🕐 *Время:* ${data.time}\n` +
              `👥 *Гостей:* ${data.guests}`;
  } else if (type === 'order') {
    message = `🛒 *Новый заказ!*\n\n` +
              `${data.items}\n\n` +
              `💰 *Итого:* ${data.total} ₽`;
  } else {
    return res.status(400).json({ ok: false, error: 'Unknown type' });
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: CHAT_ID,
    text: message,
    parse_mode: 'Markdown',
    message_thread_id: THREAD_ID
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.ok) {
      return res.status(200).json({ ok: true });
    } else {
      console.error('Telegram API error:', result);
      return res.status(500).json({ ok: false, error: 'Telegram error' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
  } catch (error) {
    console.error('CAUGHT ERROR:', error); // Это покажет ошибку, если она внутри try
    res.status(500).json({ error: error.message });
  }
}
