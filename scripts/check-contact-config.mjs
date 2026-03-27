import { loadContactEnv, maskSecret } from './contact-env.mjs';

const env = loadContactEnv();

const checks = [
  {
    key: 'TELEGRAM_BOT_TOKEN',
    required: true,
    description: 'Telegram BotFather token',
  },
  {
    key: 'TELEGRAM_CHAT_ID',
    required: true,
    description: 'Telegram target chat id',
  },
  {
    key: 'TELEGRAM_WEBHOOK_SECRET',
    required: true,
    description: 'Secret token expected by /api/telegram-webhook',
  },
  {
    key: 'VITE_CONTACT_ENDPOINT',
    required: false,
    description: 'Optional local or non-default contact endpoint override',
  },
  {
    key: 'CONTACT_THREADS_KV_BINDING',
    required: false,
    description: 'Reminder label for Cloudflare KV binding name',
    fallback: 'CONTACT_THREADS',
  },
  {
    key: 'CLOUDFLARE_PAGES_URL',
    required: false,
    description: 'Deployed Pages site base URL used by webhook script',
  },
];

let hasMissingRequired = false;

console.log('Contact/Telegram configuration check\n');

for (const check of checks) {
  const value = env[check.key] || check.fallback || '';
  const isPresent = Boolean(env[check.key] || check.fallback);

  if (check.required && !isPresent) {
    hasMissingRequired = true;
  }

  const status = check.required ? (isPresent ? 'OK ' : 'ERR') : isPresent ? 'OK ' : 'INFO';
  const renderedValue =
    check.key.includes('TOKEN') || check.key.includes('SECRET') ? maskSecret(value) : value || '(not set)';

  console.log(`${status}  ${check.key}  ${renderedValue}`);
  console.log(`     ${check.description}`);
}

console.log('\nCloudflare dashboard checklist');
console.log('OK   KV binding name should be CONTACT_THREADS');
console.log('OK   Pages Function routes expected: /api/contact and /api/telegram-webhook');

if (hasMissingRequired) {
  console.error('\nMissing required variables. Fill them in before webhook registration.');
  process.exitCode = 1;
} else {
  console.log('\nRequired local variables are present.');
}
