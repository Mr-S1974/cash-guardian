import { useEffect, useState } from 'react';
import { FeedbackBoard } from './FeedbackBoard';
import { formatCurrency, formatNumericInput, formatPercent } from '../lib/format';

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

export function SettingsPanel({
  onResetDemoData,
  guidelines,
  summary,
  onSetGuidelines,
  contactEndpoint,
  deliveryMethod,
  contactEmail,
}) {
  const [tab, setTab] = useState('manage');
  const [form, setForm] = useState(guidelines);

  useEffect(() => {
    setForm(guidelines);
  }, [guidelines]);

  const handleGuidelineSubmit = async (event) => {
    event.preventDefault();
    await onSetGuidelines({
      total: String(form.total || ''),
      card: String(form.card || ''),
      cash: String(form.cash || ''),
      memo: String(form.memo || ''),
    });
  };

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-card lg:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Settings</p>
        <h2 className="mt-2 text-xl font-bold text-slate-950">설정 관리</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          데이터 관리와 소비관리, 문의관리를 이곳에서 한 번에 정리합니다.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
        <button
          className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            tab === 'manage' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
          }`}
          onClick={() => setTab('manage')}
          type="button"
        >
          데이터 관리
        </button>
        <button
          className={`rounded-2xl px-4 py-3 text-sm font-semibold whitespace-nowrap transition ${
            tab === 'guide' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
          }`}
          onClick={() => setTab('guide')}
          type="button"
        >
          소비관리
        </button>
        <button
          className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            tab === 'contact' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
          }`}
          onClick={() => setTab('contact')}
          type="button"
        >
          문의관리
        </button>
      </div>

      {tab === 'manage' ? (
        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">초기화 범위를 선택하세요</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              수입, 지출, 관심종목, 소비 가이드라인을 항목별로 초기화하거나 전체를 한 번에 초기화할 수
              있습니다.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <button
              className="rounded-2xl border border-slate-200 bg-transparent px-4 py-4 text-sm font-semibold text-slate-600"
              onClick={() => onResetDemoData('income')}
              type="button"
            >
              수입만 초기화
            </button>
            <button
              className="rounded-2xl border border-slate-200 bg-transparent px-4 py-4 text-sm font-semibold text-slate-600"
              onClick={() => onResetDemoData('transactions')}
              type="button"
            >
              지출만 초기화
            </button>
            <button
              className="rounded-2xl border border-slate-200 bg-transparent px-4 py-4 text-sm font-semibold text-slate-600"
              onClick={() => onResetDemoData('watchlist')}
              type="button"
            >
              관심종목만 초기화
            </button>
            <button
              className="rounded-2xl border border-slate-200 bg-transparent px-4 py-4 text-sm font-semibold text-slate-600"
              onClick={() => onResetDemoData('guidelines')}
              type="button"
            >
              소비관리만 초기화
            </button>
          </div>
          <button
            className="rounded-2xl bg-slate-950 px-4 py-4 text-sm font-semibold text-white"
            onClick={() => onResetDemoData('all')}
            type="button"
          >
            전체 초기화
          </button>
        </div>
      ) : null}

      {tab === 'guide' ? (
        <div className="mt-4 grid gap-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">이번 달 소비 가이드라인</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              총 수입 {formatCurrency(summary.totalIncome)} 기준으로 카드와 현금 기준을 정리합니다.
            </p>
          </div>
          <form className="grid gap-3" onSubmit={handleGuidelineSubmit}>
            <div className="grid gap-3 md:grid-cols-3">
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-semibold text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
                value={formatNumericInput(form.total || '')}
                inputMode="numeric"
                onChange={(event) => setForm((current) => ({ ...current, total: event.target.value }))}
                placeholder="합계 가이드라인"
              />
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-semibold text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
                value={formatNumericInput(form.card || '')}
                inputMode="numeric"
                onChange={(event) => setForm((current) => ({ ...current, card: event.target.value }))}
                placeholder="카드 가이드라인"
              />
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-semibold text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
                value={formatNumericInput(form.cash || '')}
                inputMode="numeric"
                onChange={(event) => setForm((current) => ({ ...current, cash: event.target.value }))}
                placeholder="현금 가이드라인"
              />
            </div>
            <textarea
              className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
              value={form.memo || ''}
              onChange={(event) => setForm((current) => ({ ...current, memo: event.target.value }))}
              placeholder="이번 달 소비 원칙 메모"
            />
            <button
              className="rounded-2xl bg-slate-950 px-4 py-4 text-base font-semibold text-white"
              type="submit"
            >
              가이드라인 저장
            </button>
          </form>
          <div className="grid gap-3 md:grid-cols-3">
            <ProgressRow label="합계" limit={summary.guidelineTotal} spent={summary.totalSpent} tone="teal" />
            <ProgressRow label="카드" limit={summary.guidelineCard} spent={summary.cardSpent} tone="rose" />
            <ProgressRow label="현금" limit={summary.guidelineCash} spent={summary.cashSpent} tone="amber" />
          </div>
        </div>
      ) : null}

      {tab === 'contact' ? (
        <div className="mt-4">
          <FeedbackBoard
            contactEmail={contactEmail}
            contactEndpoint={contactEndpoint}
            deliveryMethod={deliveryMethod}
          />
        </div>
      ) : null}
    </section>
  );
}
