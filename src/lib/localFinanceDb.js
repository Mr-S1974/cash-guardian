const DB_NAME = 'cash-guardian-local-db';
const DB_VERSION = 1;
const STORE_NAME = 'finance_snapshots';
const PRIMARY_KEY = 'singleton';

function normalizeTransactionType(type) {
  return type === 'cash' ? 'cash' : 'card';
}

export const defaultFinanceData = {
  incomeSources: [
    {
      id: 'income-salary',
      label: '월급 또는 용돈',
      amount: 3200000,
      memo: '매달 들어오는 기본 수입',
    },
    {
      id: 'income-bonus',
      label: '성과급 또는 장학금',
      amount: 250000,
      memo: '보너스, 장학금, 포상금',
    },
    {
      id: 'income-side',
      label: '기타수입',
      amount: 120000,
      memo: '알바, 중고판매, 소규모 외주',
    },
  ],
  monthlyGuidelines: {
    total: 1800000,
    card: 1200000,
    cash: 200000,
    memo: '전체 사용은 수입의 절반 안쪽, 현금은 군것질이나 바로 내는 결제만 사용',
  },
  monthlyBudgetMonth: new Date().toISOString().slice(0, 7),
  transactions: [
    {
      id: 'seed-credit-1',
      type: 'card',
      merchant: '점심 정기결제',
      amount: 280000,
      category: '식비',
      memo: '팀 점심 결제',
      receiptImage: '',
      receiptName: '',
      spentAt: new Date().toISOString(),
    },
    {
      id: 'seed-credit-2',
      type: 'card',
      merchant: '주말 쇼핑',
      amount: 620000,
      category: '쇼핑',
      memo: '생활용품과 의류 구매',
      receiptImage: '',
      receiptName: '',
      spentAt: new Date().toISOString(),
    },
    {
      id: 'seed-debit-1',
      type: 'card',
      merchant: '편의점',
      amount: 84000,
      category: '생필품',
      memo: '생수와 간편식 구입',
      receiptImage: '',
      receiptName: '',
      spentAt: new Date().toISOString(),
    },
    {
      id: 'seed-cash-1',
      type: 'cash',
      merchant: '카페 현금 결제',
      amount: 38000,
      category: '카페·간식',
      memo: '현장 결제',
      receiptImage: '',
      receiptName: '',
      spentAt: new Date().toISOString(),
    },
  ],
  cards: {
    card: {
      label: '카드',
    },
    cash: {
      label: '현금',
    },
  },
  watchlist: [
    {
      id: 'seed-watch-aapl',
      query: 'AAPL',
      label: 'Apple',
      createdAt: new Date().toISOString(),
    },
  ],
  updatedAt: new Date().toISOString(),
};

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function withStore(mode, handler) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        const store = tx.objectStore(STORE_NAME);
        const request = handler(store);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
        tx.onerror = () => reject(tx.error);
      }),
  );
}

function getDefaultIncomeSourcesFromLegacyPayload(payload) {
  const legacyAmount = Number(payload.salary) || 0;
  const legacyMemo = payload.salaryMemo || '매달 들어오는 기본 수입';

  return [
    {
      id: 'income-salary',
      label: '월급 또는 용돈',
      amount: legacyAmount,
      memo: legacyMemo,
    },
    {
      id: 'income-bonus',
      label: '성과급 또는 장학금',
      amount: 0,
      memo: '',
    },
    {
      id: 'income-side',
      label: '기타수입',
      amount: 0,
      memo: '',
    },
  ];
}

export async function getFinanceSnapshot() {
  const snapshot = await withStore('readonly', (store) => store.get(PRIMARY_KEY));

  if (snapshot?.payload) {
    const {
      feedbacks: _feedbacks,
      comments: _comments,
      ...payloadWithoutFeedbacks
    } = snapshot.payload;
    const transactions = (snapshot.payload.transactions || defaultFinanceData.transactions).map(
      (transaction) => ({
        memo: '',
        receiptImage: '',
        receiptName: '',
        ...transaction,
        type: normalizeTransactionType(transaction.type),
      }),
    );
    const nextSnapshot = {
      ...defaultFinanceData,
      ...payloadWithoutFeedbacks,
      transactions,
      incomeSources:
        snapshot.payload.incomeSources || getDefaultIncomeSourcesFromLegacyPayload(snapshot.payload),
      monthlyGuidelines: {
        ...defaultFinanceData.monthlyGuidelines,
        ...(snapshot.payload.monthlyGuidelines || {}),
      },
      watchlist: snapshot.payload.watchlist || defaultFinanceData.watchlist,
    };

    if (snapshot.payload.feedbacks || snapshot.payload.comments) {
      await saveFinanceSnapshot(nextSnapshot);
    }

    return nextSnapshot;
  }

  await saveFinanceSnapshot(defaultFinanceData);
  return defaultFinanceData;
}

export function saveFinanceSnapshot(payload) {
  const {
    feedbacks: _feedbacks,
    comments: _comments,
    ...payloadWithoutFeedbacks
  } = payload;

  return withStore('readwrite', (store) =>
    store.put({
      id: PRIMARY_KEY,
      payload: {
        ...payloadWithoutFeedbacks,
        updatedAt: new Date().toISOString(),
      },
    }),
  );
}
