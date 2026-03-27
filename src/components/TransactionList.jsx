import { formatCurrency } from '../lib/format';

function getTypeLabel(type) {
  if (type === 'card') {
    return '카드';
  }

  return '현금';
}

export function TransactionList({ transactions }) {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            This Month
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">최근 소비 흐름</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            이 영역의 메모는 거래 메모입니다. 본사 전달 의견은 별도 저장 장소에서 분리 관리됩니다.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          로컬 저장
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {transactions.map((transaction) => (
          <article
            className="rounded-2xl bg-slate-50 px-4 py-4"
            key={transaction.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-slate-950">
                  {transaction.merchant}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {transaction.category} · {getTypeLabel(transaction.type)}
                </p>
              </div>
              <p
                className={`shrink-0 text-right text-base font-bold tabular-nums ${
                  transaction.type === 'card' ? 'text-teal-700' : 'text-amber-700'
                }`}
              >
                {formatCurrency(transaction.amount)}
              </p>
            </div>
            {transaction.memo ? (
              <p className="mt-3 text-sm leading-6 text-slate-600">{transaction.memo}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
