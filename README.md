# Cash Guardian

## *Description*

Cash Guardian is a user-friendly, visual budgeting tool. After inputting expenses, CG provides a breakdown of cashflow with detailed charts and graphs. With visual insight into income and expenses, Cash Guardian effectively helps users control their spending habits and maintain their budget goals. CG provides a solution whether the user is saving for something big, or just looking to optimize overall financial health

![CG screenshot](https://github.com/user-attachments/assets/e2863341-6d6a-4470-a91a-40a660a05b9b)

Deployed Site: https://iamthesaint.github.io/cash-guardian/

## *Usage*

Upon first visit to the site, user will be asked to provide baseline financial information and categorical spending.

When monetary information is submitted, the graphs and charts on the right side will dynamically update with the current data. Each time income and expense information is added, CG will aggregate the data and provide a comprehensive outline of spending habits to aid in money-saving.

## Contact Us Delivery

The bottom `Contact Us` form always keeps a local backup in the browser.

- In production on Cloudflare Pages, the app sends feedback to the built-in Pages Function at `/api/contact`.
- The function forwards the message to Telegram and the browser keeps a local backup either way.
- `VITE_CONTACT_EMAIL` remains available as a fallback for local development or manual email draft flow.
- If no endpoint or email fallback is set, feedback stays stored locally only.
- Start from `.env.example` and copy values into your local `.env`.

### Cloudflare Pages setup

Set these variables in Cloudflare Pages:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Notes:

- `TELEGRAM_BOT_TOKEN` is issued by `@BotFather`.
- `TELEGRAM_CHAT_ID` is the private chat or group id that should receive alerts.
- If you do not set these secrets, the app falls back to email draft or local-only storage.

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
