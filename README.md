# Cash Guardian

## *Description*

Cash Guardian is a user-friendly, visual budgeting tool. After inputting expenses, CG provides a breakdown of cashflow with detailed charts and graphs. With visual insight into income and expenses, Cash Guardian effectively helps users control their spending habits and maintain their budget goals. CG provides a solution whether the user is saving for something big, or just looking to optimize overall financial health

![CG screenshot](https://github.com/user-attachments/assets/e2863341-6d6a-4470-a91a-40a660a05b9b)

Deployed Site: https://iamthesaint.github.io/cash-guardian/

## *Usage*

Upon first visit to the site, user will be asked to provide baseline financial information and categorical spending.

When monetary information is submitted, the graphs and charts on the right side will dynamically update with the current data. Each time income and expense information is added, CG will aggregate the data and provide a comprehensive outline of spending habits to aid in money-saving.

## Contact Us Delivery

The bottom `Contact Us` flow is now server-backed. Inquiry data is not stored in the browser local database.

- In production on Cloudflare Pages, the app sends feedback to the built-in Pages Function at `/api/contact`.
- The function stores each inquiry in Cloudflare KV and forwards it to Telegram.
- Operators reply by replying to the bot's original Telegram message in the configured chat.
- Telegram sends that reply to `/api/telegram-webhook`, and the app shows it under the original inquiry on the next poll.
- `VITE_CONTACT_EMAIL` remains available as a fallback for local development, but that fallback does not support in-app threaded replies.
- Start from `.env.example` and copy values into your local `.env`.

### Cloudflare Pages setup

Set these variables in Cloudflare Pages:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `TELEGRAM_WEBHOOK_SECRET`

Add this Cloudflare KV binding:

- `CONTACT_THREADS`

Notes:

- `TELEGRAM_BOT_TOKEN` is issued by `@BotFather`.
- `TELEGRAM_CHAT_ID` is the private chat or group id that should receive alerts.
- Reply sync requires a Telegram webhook pointing to `/api/telegram-webhook`.
- If you use a group chat, the bot must be able to receive operator replies in that chat.

### Local verification helpers

You can verify local configuration and register the Telegram webhook from this repo:

```bash
npm run contact:check
npm run telegram:webhook:set
```

Expected local `.env` values for these scripts:

- `CLOUDFLARE_PAGES_URL=https://your-site.pages.dev`
- `TELEGRAM_BOT_TOKEN=...`
- `TELEGRAM_WEBHOOK_SECRET=...`

Production completion checklist:

1. Create a Cloudflare KV namespace and bind it in Pages as `CONTACT_THREADS`.
2. Set `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, and `TELEGRAM_WEBHOOK_SECRET` in Pages.
3. Set local `.env` `CLOUDFLARE_PAGES_URL` to the deployed Pages URL.
4. Run `npm run telegram:webhook:set`.
5. Send a test inquiry in the app, reply to the bot message in Telegram, and confirm the reply appears in the app within the next poll interval.

### Direct Cloudflare deploy control

This repo can be switched from dashboard-only deploys to local Wrangler-driven deploys.

One-time bootstrap:

```bash
npm run cf:pages:config:download
```

That command downloads the current Pages project configuration into a local Wrangler config. Cloudflare recommends pulling the existing dashboard config first instead of hand-writing it, because once used for Pages deploys the Wrangler file becomes the source of truth.

After that, use:

```bash
npm run cf:pages:deploy:production
```

Optional commands:

```bash
npm run cf:pages:deploy:preview
npm run cf:pages:dev
```

Notes:

- `functions/` must stay at the repo root for Pages Functions routing.
- The downloaded Wrangler config should be reviewed before the first deploy.
- You need Cloudflare auth available locally through Wrangler login or API token setup.

## *Credits*

Stephenie St.Hilaire - https://github.com/iamthesaint

David Janata - https://github.com/DavidDJanata

Zander Kubajak - https://github.com/ZVKubajak

*Assets Used:*

- Bootstrap CSS Framework: https://getbootstrap.com

## *License*

MIT License

Copyright (c) 2024 Stephenie St.Hilaire

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
