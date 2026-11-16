export default async function handler(req, res) {
  const { request_id, code } = req.body;
  const GATEWAY_TOKEN = process.env.TELEGRAM_GATEWAY_TOKEN;

  try {
    const response = await fetch('https://gatewayapi.telegram.org/checkVerificationStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GATEWAY_TOKEN}`
      },
      body: JSON.stringify({
        request_id: request_id,
        code: code // Передаём код, введённый пользователем
      })
    });

    const data = await response.json();

    if (data.ok && data.result.verification_status.status === 'code_valid') {
      // Код верный — можно логинить пользователя
      return res.status(200).json({ valid: true });
    } else {
      // Код неверный или истёк
      return res.status(400).json({ valid: false, status: data.result?.verification_status?.status });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
