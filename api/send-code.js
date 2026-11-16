export default async function handler(req, res) {
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone is required' });
  }

  // 1. Очищаем номер от всех символов, кроме цифр (скобки, пробелы, дефисы)
  const cleanPhone = phone.replace(/\D/g, '');
  
  // 2. Приводим к строгому формату E.164 (например, +79688400134)
  let formattedPhone = '';
  
  if (cleanPhone.length === 10) {
    // Если ввели 10 цифр (без кода страны), добавляем +7
    formattedPhone = `+7${cleanPhone}`;
  } else if (cleanPhone.length === 11 && cleanPhone.startsWith('7')) {
    // Если ввели 11 цифр, начиная с 7
    formattedPhone = `+${cleanPhone}`;
  } else if (cleanPhone.length === 11 && cleanPhone.startsWith('8')) {
    // Если ввели 11 цифр, начиная с 8 (часто вводят так), меняем на +7
    formattedPhone = `+7${cleanPhone.slice(1)}`;
  } else {
    // Если номер не подходит по длине
    return res.status(400).json({ error: 'PHONE_NUMBER_INVALID' });
  }

  const token = process.env.TELEGRAM_GATEWAY_TOKEN;
  if (!token) {
    console.error('Config error: TELEGRAM_GATEWAY_TOKEN is missing');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // 3. Отправляем запрос в Telegram Gateway
    const response = await fetch('https://gatewayapi.telegram.org/sendVerificationMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        phone_number: formattedPhone, // Отправляем чистый номер: +79688400134
        code_length: 6,
        ttl: 60
      })
    });

    const data = await response.json();
    
    // Если Telegram вернул ошибку, логируем и отдаем клиенту
    if (!data.ok) {
      console.error('Gateway API error:', data.error);
      return res.status(400).json({ error: data.error || 'Gateway error' });
    }

    // Возвращаем request_id на клиент для последующей проверки кода
    return res.status(200).json({ request_id: data.result.request_id });
    
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
