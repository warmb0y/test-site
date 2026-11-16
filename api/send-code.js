export default async function handler(req, res) {
  // Разрешаем только POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.body; // Ожидаем номер в формате E.164, например +79991234567

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  const GATEWAY_TOKEN = process.env.TELEGRAM_GATEWAY_TOKEN;

  try {
    // Вызов метода sendVerificationMessage
    const response = await fetch('https://gatewayapi.telegram.org/sendVerificationMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GATEWAY_TOKEN}`
      },
      body: JSON.stringify({
        phone_number: phone,
        code_length: 6, // Длина кода, который сгенерирует Telegram
        ttl: 60, // Время жизни кода в секундах (от 30 до 3600)
        payload: 'login_verification' // Необязательно, для внутренних нужд
      })
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Gateway API error:', data.error);
      return res.status(400).json({ error: data.error });
    }

    // Возвращаем request_id на клиент, чтобы потом проверить код
    return res.status(200).json({
      ok: true,
      request_id: data.result.request_id
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
