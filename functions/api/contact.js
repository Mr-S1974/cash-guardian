function json(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...(init.headers || {}),
    },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let payload;

  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, { status: 400 });
  }

  const message = typeof payload?.message === 'string' ? payload.message.trim() : '';

  if (!message) {
    return json({ error: 'message_required' }, { status: 400 });
  }

  if (message.length > 5000) {
    return json({ error: 'message_too_long' }, { status: 400 });
  }

  const telegramBotToken = env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = env.TELEGRAM_CHAT_ID;

  if (!telegramBotToken || !telegramChatId) {
    return json({ error: 'contact_not_configured' }, { status: 500 });
  }

  const submittedAt = new Date().toISOString();
  const telegramResponse = await fetch(
    `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
    {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: telegramChatId,
      text: [
        'Cash Guardian Contact Us',
        '',
        `Submitted at: ${submittedAt}`,
        '',
        'Message:',
        message,
      ].join('\n'),
    }),
  },
  );

  if (!telegramResponse.ok) {
    const errorText = await telegramResponse.text();

    return json(
      {
        error: 'delivery_failed',
        details: errorText,
      },
      { status: 502 },
    );
  }

  const result = await telegramResponse.json();

  if (!result.ok) {
    return json(
      {
        error: 'delivery_failed',
        details: result.description || 'telegram_request_failed',
      },
      { status: 502 },
    );
  }

  return json({
    ok: true,
    id: result.result?.message_id || null,
    submittedAt,
  });
}
