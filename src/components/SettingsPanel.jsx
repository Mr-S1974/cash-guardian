import { useEffect, useState } from 'react';
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

export function SettingsPanel({ onResetDemoData, guidelines, summary, onSetGuidelines }) {
  const [tab, setTab] = useState('storage');
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
        <h2 className="mt-2 text-xl font-bold text-slate-950">앱 설정</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          저장소, 데이터 관리, 소비 가이드라인을 이곳에서 한 번에 정리합니다.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
        <button
          className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            tab === 'storage' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
          }`}
          onClick={() => setTab('storage')}
          type="button"
        >
          저장소
        </button>
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
          className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            tab === 'guide' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
          }`}
          onClick={() => setTab('guide')}
          type="button"
        >
          소비 가이드
        </button>
      </div>

      {tab === 'storage' ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-950">로컬 저장소 사용 중</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            수입, 지출, 메모, 관심종목은 이 기기 브라우저 저장소에만 보관됩니다. 문의는
            맨 아래 Contact Us에서 별도로 처리됩니다.
          </p>
        </div>
      ) : null}

      {tab === 'manage' ? (
        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">데모 데이터 초기화</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              현재 화면을 기본 예시 데이터 상태로 되돌립니다.
            </p>
          </div>
          <button
            className="rounded-2xl border border-slate-200 bg-transparent px-4 py-4 text-sm font-semibold text-slate-600"
            onClick={onResetDemoData}
            type="button"
          >
            데모 데이터로 초기화
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
    </section>
  );
}
