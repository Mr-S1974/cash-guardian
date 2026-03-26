import { parseNumericInput } from './format';

const MERCHANT_STOPWORDS = [
  '카드',
  '승인',
  '합계',
  '금액',
  '매출',
  '과세',
  '면세',
  '부가세',
  '사업자',
  '대표',
  '전화',
  '전표',
  '영수증',
  '거래',
  '일시',
  '단말기',
  '가맹점',
  '주소',
  '감사',
  'welcome',
  'receipt',
];

const CATEGORY_RULES = [
  { category: '식비', keywords: ['카페', 'coffee', '식당', '치킨', '버거', 'pizza', '밥', '분식'] },
  { category: '생활', keywords: ['편의점', '마트', '다이소', 'olive', '올리브영', '생활'] },
  { category: '교통', keywords: ['택시', '버스', '지하철', '주유', '주차', 'ktx', 'srt'] },
  { category: '쇼핑', keywords: ['store', 'shop', '쇼핑', '무신사', '쿠팡', '올리브영'] },
];

function cleanupText(text) {
  return text
    .replace(/\r/g, '\n')
    .replace(/[|]/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

function getLines(text) {
  return cleanupText(text)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function isMerchantCandidate(line) {
  const lowerLine = line.toLowerCase();

  if (line.length < 2 || line.length > 32) {
    return false;
  }

  if (!/[A-Za-z가-힣]/.test(line)) {
    return false;
  }

  if ((line.match(/\d/g) || []).length >= 5) {
    return false;
  }

  return !MERCHANT_STOPWORDS.some((word) => lowerLine.includes(word.toLowerCase()));
}

function extractMerchant(lines) {
  return lines.slice(0, 8).find(isMerchantCandidate) || '';
}

function extractAmount(lines) {
  const keywordLine = lines.find((line) =>
    /(합계|총액|금액|승인금액|승인|결제금액|받을금액|판매금액|현금영수증)/.test(line),
  );

  const prioritizedLine = keywordLine || lines.join(' ');
  const matches = Array.from(prioritizedLine.matchAll(/(\d[\d,]{2,})/g)).map((match) =>
    parseNumericInput(match[1]),
  );

  if (matches.length > 0) {
    return Math.max(...matches);
  }

  const fallbackMatches = lines.flatMap((line) =>
    Array.from(line.matchAll(/(\d[\d,]{2,})/g)).map((match) => parseNumericInput(match[1])),
  );

  return fallbackMatches.length > 0 ? Math.max(...fallbackMatches) : 0;
}

function extractDate(text) {
  const patterns = [
    /(\d{4})[.\-/년 ]\s*(\d{1,2})[.\-/월 ]\s*(\d{1,2})/,
    /(\d{2})[.\-/ ](\d{1,2})[.\-/ ](\d{1,2})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (!match) {
      continue;
    }

    const year = match[1].length === 2 ? Number(`20${match[1]}`) : Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    if (!year || !month || !day) {
      continue;
    }

    return new Date(Date.UTC(year, month - 1, day)).toISOString();
  }

  return '';
}

function inferCategory(merchant = '', text = '') {
  const target = `${merchant} ${text}`.toLowerCase();
  const matchedRule = CATEGORY_RULES.find((rule) =>
    rule.keywords.some((keyword) => target.includes(keyword.toLowerCase())),
  );

  return matchedRule?.category || '';
}

export function parseReceiptText(text) {
  const cleanedText = cleanupText(text);
  const lines = getLines(cleanedText);
  const merchant = extractMerchant(lines);
  const amount = extractAmount(lines);
  const spentAt = extractDate(cleanedText);
  const category = inferCategory(merchant, cleanedText);

  return {
    merchant,
    amount,
    category,
    spentAt,
    rawText: cleanedText,
  };
}
