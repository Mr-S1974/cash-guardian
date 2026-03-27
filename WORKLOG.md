# Worklog

## Current status

- Bottom `Contact Us` was simplified to a single-message input.
- The duplicate `Contact Us` option inside storage selection was removed.
- `Contact Us` now sends through `Cloudflare Pages Function -> Telegram Bot API`.
- `Contact Us` inquiries are no longer stored in local browser finance data.
- Inquiry threads now live in server storage and replies are expected from Telegram webhook events.
- Operators answer by replying in Telegram to the original bot message for that inquiry.
- Frontend `Contact Us` now polls `/api/contact` and renders server-backed threads only.
- Telegram replies are matched by replying to the bot's original message, not by ticket text search.
- Static asset cache busting was added so new deployments do not keep serving stale `app.js` and `app.css`.

## Key files

- `src/components/FeedbackBoard.jsx`
- `src/components/StorageSelector.jsx`
- `src/App.jsx`
- `functions/api/_contactStore.js`
- `functions/api/telegram-webhook.js`
- `src/hooks/useLocalFinanceData.js`
- `src/lib/localFinanceDb.js`
- `functions/api/contact.js`
- `.env.example`
- `scripts/sync-static-deploy.mjs`
- `service-worker.js`
- `README.md`

## Deployment notes

- Cloudflare Pages secrets required:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`
  - `TELEGRAM_WEBHOOK_SECRET`
- Cloudflare KV binding required:
  - `CONTACT_THREADS`
- Current Telegram chat id in use:
  - `1491475294`
- Telegram webhook endpoint expected:
  - `/api/telegram-webhook`
- Local `.env` is not committed and must stay private.

## Verified result

- `npm run build` passes after Contact Us API changes.
- Contact Us UI now expects Telegram webhook replies instead of local reply entry.
- Local finance storage no longer persists `Contact Us` entries.

## Remaining setup

- Create or bind Cloudflare KV namespace as `CONTACT_THREADS`.
- Set `TELEGRAM_WEBHOOK_SECRET` in Cloudflare Pages.
- Register the Telegram bot webhook to the deployed `/api/telegram-webhook` URL.
- Verify that replying to the bot's original Telegram message creates a reply under the same thread in the app.

## Added helpers after handoff

- Added `npm run contact:check` to validate required local variables for Contact Us and Telegram setup.
- Added `npm run telegram:webhook:set` to register the deployed `/api/telegram-webhook` with Telegram.
- Added `CLOUDFLARE_PAGES_URL` and `CONTACT_THREADS_KV_BINDING` examples to `.env.example`.
- Expanded `README.md` with a concrete production completion checklist.

## Relevant commits

- `7cad194` `Simplify contact form and add Telegram delivery`
- `1e3006d` `Bust cached app assets on static deploy`

## Good restart prompts

- `지난번 Contact Us 서버 저장 + Telegram webhook 연동 작업 이어서 하자`
- `WORKLOG.md 기준으로 다음 작업 이어서 하자`
- `Contact Us를 로컬 저장 없이 Telegram 양방향 문의함으로 마무리하자`

## Possible next tasks

- Improve Telegram message formatting
- Add retry UX for failed delivery
- Register and verify Telegram webhook in production
- Clean up service worker and caching strategy further
