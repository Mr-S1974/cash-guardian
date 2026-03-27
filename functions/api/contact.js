import {
  createContactThread,
  listContactThreads,
  mapTelegramMessageToThread,
  updateContactThread,
} from './_contactStore.js';

function json(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...(init.headers || {}),
    },
  });
}

function formatTelegramMessage(thread) {
  return [
    'Cash Guardian Contact Us',
    `Ticket: ${thread.id}`,
    '',
    `Submitted at: ${thread.createdAt}`,
    `Reply to: ${thread.replyTo}`,
    '',
    'Message:',
    thread.text,
    '',
    'Reply in Telegram by replying directly to this message.',
  ].join('\n');
}

function isConfigured(env) {
  return Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID && env.CONTACT_THREADS);
}

export async function onRequestGet(context) {
  const { env } = context;

  if (!isConfigured(env)) {
    return json({ error: 'contact_not_configured' }, { status: 500 });
  }

  const threads = await listContactThreads(env);
  return json({ threads });
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
  const replyTo = typeof payload?.replyTo === 'string' ? payload.replyTo.trim() : '';

  if (!message) {
    return json({ error: 'message_required' }, { status: 400 });
  }

  if (!replyTo) {
    return json({ error: 'reply_to_required' }, { status: 400 });
  }

  if (message.length > 5000) {
    return json({ error: 'message_too_long' }, { status: 400 });
  }

  if (replyTo.length > 500) {
    return json({ error: 'reply_to_too_long' }, { status: 400 });
  }

  if (!isConfigured(env)) {
    return json({ error: 'contact_not_configured' }, { status: 500 });
  }

  const submittedAt = new Date().toISOString();
  const thread = {
    id: crypto.randomUUID(),
    text: message,
    replyTo,
    createdAt: submittedAt,
    updatedAt: submittedAt,
    deliveryStatus: 'pending',
    telegramMessageId: null,
    replies: [],
  };

  let deliveryError = null;

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: formatTelegramMessage(thread),
        }),
      },
    );

    if (!telegramResponse.ok) {
      throw new Error(await telegramResponse.text());
    }

    const result = await telegramResponse.json();

    if (!result.ok) {
      throw new Error(result.description || 'telegram_request_failed');
    }

    thread.deliveryStatus = 'delivered';
    thread.telegramMessageId = result.result?.message_id || null;
  } catch (error) {
    thread.deliveryStatus = 'failed';
    deliveryError = error instanceof Error ? error.message : 'telegram_request_failed';
  }

  await createContactThread(env, thread);

  if (thread.telegramMessageId) {
    await mapTelegramMessageToThread(env, thread.telegramMessageId, thread.id);
  }

  await updateContactThread(env, thread);

  return json(
    {
      ok: thread.deliveryStatus === 'delivered',
      submittedAt,
      thread,
      error: deliveryError,
    },
    { status: thread.deliveryStatus === 'delivered' ? 200 : 502 },
  );
}
