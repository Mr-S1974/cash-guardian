import { formatCurrency } from '../lib/format';

function getTypeLabel(type) {
  if (type === 'card') {
    return '카드·간편결제';
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
          <h2 className="mt-2 text-xl font-bold text-slate-950">나의 소비 패턴</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            최근에 어디에 돈을 썼는지 흐름과 메모를 한눈에 확인합니다.
          </p>
        </div>
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
