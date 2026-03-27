# Worklog

## Current status

- Mobile-first flow was rebuilt around a home screen plus screen-to-screen navigation.
- Home now keeps only four entry points:
  - `수입`
  - `지출`
  - `관심종목`
  - `설정관리`
- `지출` is now a split entry that leads to:
  - `지출 관리`
  - `나의 소비 패턴`
- `문의관리` moved inside `설정 관리`.
- Home copy and visual tone were pushed toward a short-form, high-contrast style.
- Income and spending wording was broadened so students and early-career users can both understand it.
- Receipt OCR and receipt upload flow were removed to keep the app focused on a clean MVP.
- `Contact Us` now stores only on the server and routes through Telegram-backed threads.
- Google AdSense verification assets were added and deployment paths were fixed.

## Latest verified state

- `npm run build` passes.
- Production homepage contains:
  - `google-adsense-account` meta tag
  - AdSense script for `ca-pub-4269966166949156`
- Root `ads.txt` is generated in the deployable output.
- Latest pushed commit:
  - `b77a6d9` `Fix AdSense verification deployment paths`

## Key files

- `src/App.jsx`
- `src/components/HomeActionPanel.jsx`
- `src/components/FinanceCard.jsx`
- `src/components/SpendingForm.jsx`
- `src/components/TransactionList.jsx`
- `src/components/SettingsPanel.jsx`
- `src/components/FeedbackBoard.jsx`
- `src/lib/localFinanceDb.js`
- `src/hooks/useLocalFinanceData.js`
- `functions/api/contact.js`
- `functions/api/telegram-webhook.js`
- `index.src.html`
- `index.html`
- `ads.txt`
- `public/ads.txt`
- `scripts/sync-static-deploy.mjs`

## Recent product decisions

- Use one unified `카드` concept instead of splitting debit and credit.
- Keep storage local for finance data, but keep inquiry threads server-backed only.
- Favor plain language over finance-heavy wording.
- Keep the first screen visually bold and operationally simple.
- Delay deeper market/news backend work until the core MVP feels stable.

## Next tasks

- Check whether `https://cash-guardian.pages.dev/ads.txt` is visible from the live site and complete AdSense review if needed.
- Improve `관심종목` reliability:
  - confirm why quote/news data sometimes does not render
  - consider moving market/news fetches behind a server proxy
- Tighten the home screen further if needed:
  - add a one-line status signal such as monthly risk level
  - reduce copy if users hesitate on first action
- Review mobile spacing and tap targets on real devices.
- Revisit service worker and cache behavior only after UI structure is stable.
- Add a small production verification checklist for:
  - Contact Us submission
  - Telegram reply reflection
  - AdSense verification assets

## Suggested restart prompts

- `WORKLOG.md 기준으로 다음 작업 이어서 하자`
- `관심종목 데이터가 왜 비는지 먼저 점검하자`
- `애드센스 검토 상태 확인 후 남은 작업 이어가자`
- `모바일 홈 화면을 조금 더 줄이고 CTA를 더 세게 만들자`
