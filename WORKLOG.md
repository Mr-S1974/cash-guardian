# Worklog

## Current status

- Bottom `Contact Us` was simplified to a single-message input.
- The duplicate `Contact Us` option inside storage selection was removed.
- `Contact Us` now sends through `Cloudflare Pages Function -> Telegram Bot API`.
- Telegram delivery is working in production.
- Local browser backup for submitted feedback is still kept.
- Static asset cache busting was added so new deployments do not keep serving stale `app.js` and `app.css`.

## Key files

- `src/components/FeedbackBoard.jsx`
- `src/components/StorageSelector.jsx`
- `src/App.jsx`
- `src/hooks/useLocalFinanceData.js`
- `src/lib/localFinanceDb.js`
- `functions/api/contact.js`
- `scripts/sync-static-deploy.mjs`
- `service-worker.js`
- `README.md`

## Deployment notes

- Cloudflare Pages secrets required:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`
- Current Telegram chat id in use:
  - `1491475294`
- Local `.env` is not committed and must stay private.

## Verified result

- Status text shows `전달 완료 + 로컬 보관`.
- Telegram message delivery is confirmed working.

## Relevant commits

- `7cad194` `Simplify contact form and add Telegram delivery`
- `1e3006d` `Bust cached app assets on static deploy`

## Good restart prompts

- `지난번 Contact Us / Telegram 자동전달 작업 이어서 하자`
- `WORKLOG.md 기준으로 다음 작업 이어서 하자`
- `커밋 7cad194, 1e3006d 기준으로 이어서 하자`

## Possible next tasks

- Improve Telegram message formatting
- Add retry UX for failed delivery
- Clean up service worker and caching strategy further
- Add admin-facing delivery logs or diagnostics
