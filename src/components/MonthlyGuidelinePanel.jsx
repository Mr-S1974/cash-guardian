import { formatCurrency, formatPercent } from '../lib/format';

function ProgressRow({ label, spent, limit, tone = 'teal' }) {
  const rate = limit > 0 ? Math.min(spent / limit, 1) : 0;
  const barTone =
    tone === 'amber' ? 'bg-amber-500' : tone === 'rose' ? 'bg-rose-500' : 'bg-teal-600';

  return (
    <article className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-lg font-bold text-slate-950">{formatCurrency(limit)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-500">현재 사용</p>
          <p className="mt-1 text-base font-bold text-slate-950">{formatCurrency(spent)}</p>
        </div>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
        <div className={`h-full rounded-full ${barTone}`} style={{ width: `${rate * 100}%` }} />
      </div>
      <p className="mt-3 text-sm text-slate-500">사용률 {formatPercent(limit > 0 ? spent / limit : 0)}</p>
    </article>
  );
}

export function MonthlyGuidelinePanel({
  guidelines,
  summary,
  onSetGuidelines,
}) {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    await onSetGuidelines({
      total: String(formData.get('total') || ''),
      card: String(formData.get('card') || ''),
      cash: String(formData.get('cash') || ''),
      memo: String(formData.get('memo') || ''),
    });
  };

  return (
    <section className="rounded-[28px] border border-line bg-white p-5 shadow-card lg:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Monthly Guide
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950 lg:text-2xl">
            한 달 소비 가이드라인
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            합계, 카드, 현금 기준을 직접 정하고 현재 사용량과 비교합니다.
          </p>
        </div>
        <p className="text-sm leading-6 text-slate-600 lg:max-w-sm lg:text-right">
          총 수입 {formatCurrency(summary.totalIncome)} 기준으로 이번 달 지출 페이스를 확인합니다.
        </p>
      </div>

      <form className="mt-5 grid gap-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-semibold text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
            defaultValue={guidelines.total || ''}
            inputMode="numeric"
            name="total"
            placeholder="합계 가이드라인"
          />
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-semibold text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
            defaultValue={guidelines.card || ''}
            inputMode="numeric"
            name="card"
            placeholder="카드 가이드라인"
          />
          <input
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-semibold text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
            defaultValue={guidelines.cash || ''}
            inputMode="numeric"
            name="cash"
            placeholder="현금 가이드라인"
          />
        </div>
        <textarea
          className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
          defaultValue={guidelines.memo || ''}
          name="memo"
          placeholder="이번 달 소비 원칙 메모"
        />
        <button
          className="rounded-2xl bg-slate-950 px-4 py-4 text-base font-semibold text-white"
          type="submit"
        >
          가이드라인 저장
        </button>
      </form>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <ProgressRow label="합계" limit={summary.guidelineTotal} spent={summary.totalSpent} tone="teal" />
        <ProgressRow label="카드" limit={summary.guidelineCard} spent={summary.cardSpent} tone="rose" />
        <ProgressRow label="현금" limit={summary.guidelineCash} spent={summary.cashSpent} tone="amber" />
      </div>
    </section>
  );
}
