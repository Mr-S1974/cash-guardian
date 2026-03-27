import { appendTelegramReply } from './_contactStore.js';

function json(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...(init.headers || {}),
    },
  });
}

function formatTelegramSender(from) {
  if (!from) {
    return 'Telegram operator';
  }

  return (
    [from.first_name, from.last_name].filter(Boolean).join(' ').trim() ||
    from.username ||
    'Telegram operator'
  );
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const secretHeader = request.headers.get('X-Telegram-Bot-Api-Secret-Token');

  if (env.TELEGRAM_WEBHOOK_SECRET && secretHeader !== env.TELEGRAM_WEBHOOK_SECRET) {
    return json({ error: 'invalid_webhook_secret' }, { status: 403 });
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, { status: 400 });
  }

  const message = payload?.message;

  if (!message?.text || !message.reply_to_message?.message_id) {
    return json({ ok: true, ignored: 'not_a_reply_message' });
  }

  if (String(message.chat?.id || '') !== String(env.TELEGRAM_CHAT_ID || '')) {
    return json({ ok: true, ignored: 'unexpected_chat' });
  }

  if (message.from?.is_bot) {
    return json({ ok: true, ignored: 'bot_message' });
  }

  const nextThread = await appendTelegramReply(env, message.reply_to_message.message_id, {
    id: crypto.randomUUID(),
    text: message.text.trim(),
    createdAt: new Date((message.date || Math.floor(Date.now() / 1000)) * 1000).toISOString(),
    source: 'telegram',
    author: formatTelegramSender(message.from),
    telegramMessageId: message.message_id,
  });

  if (!nextThread) {
    return json({ ok: true, ignored: 'thread_not_found' });
  }

  return json({ ok: true, threadId: nextThread.id });
}
