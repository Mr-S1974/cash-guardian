function formatCurrency(value) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(value);
}

function getTypeLabel(type) {
  if (type === 'credit') {
    return '신용카드';
  }

  if (type === 'debit') {
    return '체크카드';
  }

  return '현금';
}

export function TransactionList({ transactions }) {
  return (
    <section className="rounded-[28px] bg-white p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            This Month
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">최근 소비 흐름</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          로컬 저장
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {transactions.map((transaction) => (
          <article
            className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-4"
            key={transaction.id}
          >
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-950">
                {transaction.merchant}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {transaction.category} · {getTypeLabel(transaction.type)}
              </p>
            </div>
            <p
              className={`shrink-0 text-base font-bold ${
                transaction.type === 'credit'
                  ? 'text-rose-600'
                  : transaction.type === 'debit'
                    ? 'text-teal-700'
                    : 'text-amber-700'
              }`}
            >
              {formatCurrency(transaction.amount)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
