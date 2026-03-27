import { loadContactEnv, maskSecret } from './contact-env.mjs';

function getWebhookUrl(baseUrl) {
  const normalized = String(baseUrl || '').trim().replace(/\/+$/u, '');

  if (!normalized) {
    throw new Error('CLOUDFLARE_PAGES_URL is required');
  }

  return `${normalized}/api/telegram-webhook`;
}

function getApiBase(token) {
  return `https://api.telegram.org/bot${token}`;
}

async function telegramRequest(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.ok) {
    const message =
      result?.description ||
      `Telegram request failed with status ${response.status}`;
    throw new Error(message);
  }

  return result.result;
}

const env = loadContactEnv();
const token = env.TELEGRAM_BOT_TOKEN;
const secret = env.TELEGRAM_WEBHOOK_SECRET;
const webhookUrl = getWebhookUrl(env.CLOUDFLARE_PAGES_URL);

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN is required');
}

if (!secret) {
  throw new Error('TELEGRAM_WEBHOOK_SECRET is required');
}

console.log('Registering Telegram webhook');
console.log(`Webhook URL: ${webhookUrl}`);
console.log(`Secret: ${maskSecret(secret)}`);

await telegramRequest(`${getApiBase(token)}/setWebhook`, {
  url: webhookUrl,
  secret_token: secret,
  allowed_updates: ['message'],
});

const info = await telegramRequest(`${getApiBase(token)}/getWebhookInfo`, {});

console.log('\nTelegram webhook status');
console.log(`URL: ${info.url || '(empty)'}`);
console.log(`Pending updates: ${info.pending_update_count ?? 0}`);
console.log(`Last error: ${info.last_error_message || '(none)'}`);
