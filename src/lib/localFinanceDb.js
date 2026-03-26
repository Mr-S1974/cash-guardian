const DB_NAME = 'cash-guardian-local-db';
const DB_VERSION = 1;
const STORE_NAME = 'finance_snapshots';
const PRIMARY_KEY = 'singleton';

export const defaultFinanceData = {
  salary: 3200000,
  monthlyBudgetMonth: new Date().toISOString().slice(0, 7),
  transactions: [
    {
      id: 'seed-credit-1',
      type: 'credit',
      merchant: '점심 정기결제',
      amount: 280000,
      category: '식비',
      spentAt: new Date().toISOString(),
    },
    {
      id: 'seed-credit-2',
      type: 'credit',
      merchant: '주말 쇼핑',
      amount: 620000,
      category: '쇼핑',
      spentAt: new Date().toISOString(),
    },
    {
      id: 'seed-debit-1',
      type: 'debit',
      merchant: '편의점',
      amount: 84000,
      category: '생활',
      spentAt: new Date().toISOString(),
    },
    {
      id: 'seed-cash-1',
      type: 'cash',
      merchant: '카페 현금 결제',
      amount: 38000,
      category: '간식',
      spentAt: new Date().toISOString(),
    },
  ],
  cards: {
    credit: {
      label: '신용카드',
    },
    debit: {
      label: '체크카드',
    },
    cash: {
      label: '현금',
    },
  },
  comments: [
    {
      id: 'seed-comment-1',
      author: '운영 메모',
      text: '월급 저장 후 상단 카드와 최근 소비 흐름을 먼저 확인하세요.',
      createdAt: new Date().toISOString(),
    },
  ],
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

export async function getFinanceSnapshot() {
  const snapshot = await withStore('readonly', (store) => store.get(PRIMARY_KEY));

  if (snapshot?.payload) {
    return {
      ...defaultFinanceData,
      ...snapshot.payload,
      comments: snapshot.payload.comments || defaultFinanceData.comments,
      watchlist: snapshot.payload.watchlist || defaultFinanceData.watchlist,
    };
  }

  await saveFinanceSnapshot(defaultFinanceData);
  return defaultFinanceData;
}

export function saveFinanceSnapshot(payload) {
  return withStore('readwrite', (store) =>
    store.put({
      id: PRIMARY_KEY,
      payload: {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
    }),
  );
}
