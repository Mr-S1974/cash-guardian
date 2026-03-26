import { FeedbackBoard } from './components/FeedbackBoard';
import { FinanceCard } from './components/FinanceCard';
import { MonthlyGuidelinePanel } from './components/MonthlyGuidelinePanel';
import { SpendingForm } from './components/SpendingForm';
import { StorageSelector } from './components/StorageSelector';
import { TransactionList } from './components/TransactionList';
import { WatchlistPanel } from './components/WatchlistPanel';
import { useState } from 'react';
import { useLocalFinanceData } from './hooks/useLocalFinanceData';
import { formatCurrency, formatPercent } from './lib/format';

export default function App() {
  const [storageTarget, setStorageTarget] = useState('local');
  const { data, summary, status, actions } = useLocalFinanceData();
  const contactEndpoint =
    import.meta.env.VITE_CONTACT_ENDPOINT || (import.meta.env.PROD ? '/api/contact' : '');
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || '';
  const feedbackDeliveryMethod = contactEndpoint ? 'endpoint' : contactEmail ? 'email' : 'local';

  return (
    <div className="min-h-screen bg-mist text-ink">
      <div className="mx-auto min-h-screen w-full max-w-7xl px-5 pb-12 pt-6 lg:px-8 lg:pb-16 lg:pt-8">
        <header className="pb-6 lg:pb-8">
          <div className="rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.22),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.08),_transparent_28%),linear-gradient(180deg,#ffffff_0%,#eef4fb_100%)] p-6 shadow-card lg:grid lg:grid-cols-[1.3fr_0.9fr] lg:items-end lg:gap-8 lg:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
                CASH GUARDIAN
              </p>
              <h1 className="mt-3 text-[2.2rem] font-black leading-[0.98] tracking-[-0.04em] text-slate-950 lg:text-[4rem]">
                한눈에 보는
                <br />
                소비 방어 대시보드
              </h1>
            </div>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 lg:mt-0 lg:text-base">
              데이터는 서버로 전송되지 않고 이 기기의 로컬 저장소에만 저장됩니다. 웹에서도 넓은
              화면에 맞춰 월급, 신용카드, 체크카드, 현금 흐름을 바로 읽을 수 있게 구성했습니다.
            </p>
          </div>
        </header>

        {status === 'loading' ? (
          <div className="rounded-[28px] bg-white p-6 text-sm font-medium text-slate-500 shadow-card">
            로컬 데이터를 불러오는 중입니다.
          </div>
        ) : (
          <>
            <main className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
              <section className="grid gap-5">
              <section className="grid gap-4 md:grid-cols-2">
                <FinanceCard
                  eyebrow="총수입"
                  title="이번 달 기준"
                  value={formatCurrency(summary.totalIncome)}
                  subValue="월급, 성과금, 부수입을 합산한 월간 수입입니다."
                  tone="accent"
                />
                <FinanceCard
                  eyebrow="카드 합계"
                  title="현재 사용"
                  value={formatCurrency(summary.cardSpent)}
                  subValue={`수입 대비 ${formatPercent(summary.cardUsageRate)}`}
                  tone="light"
                />
                <FinanceCard
                  eyebrow="신용카드"
                  title="현재 사용"
                  value={formatCurrency(summary.creditSpent)}
                  subValue={`총 사용 ${formatCurrency(summary.totalSpent)}`}
                  tone="mint"
                />
                <FinanceCard
                  eyebrow="현금"
                  title="현재 사용"
                  value={formatCurrency(summary.cashSpent)}
                  subValue="카드 외 직접 지출 흐름"
                  tone="light"
                />
              </section>

              <MonthlyGuidelinePanel
                guidelines={data.monthlyGuidelines || {}}
                onSetGuidelines={actions.setMonthlyGuidelines}
                summary={summary}
              />

              <TransactionList transactions={data.transactions.slice(0, 6)} />
              </section>

              <aside className="grid gap-5 self-start lg:sticky lg:top-6">
                <StorageSelector value={storageTarget} onChange={setStorageTarget} />

                  <SpendingForm
                    incomeSources={data.incomeSources || []}
                    onAddTransaction={actions.addTransaction}
                    onSetIncomeSources={actions.setIncomeSources}
                  />

                  <WatchlistPanel
                    watchlist={data.watchlist || []}
                    onAddWatchlist={actions.addWatchlist}
                    onRemoveWatchlist={actions.removeWatchlist}
                  />

                <section className="rounded-[28px] bg-slate-950 p-5 text-white shadow-card lg:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  Storage
                </p>
                <h2 className="mt-2 text-2xl font-bold">CASH GUARDIAN</h2>
                <p className="mt-4 text-sm leading-7 text-white/75">
                  현재 작업 대상은 내 기기 로컬 저장소입니다. 월간 수입, 지출, 메모, 영수증은 이
                  브라우저 안에만 저장됩니다. Contact Us는 하단에서 별도로 관리됩니다.
                </p>
                </section>

                <button
                  className="rounded-2xl border border-slate-200 bg-transparent px-4 py-4 text-sm font-semibold text-slate-500"
                  onClick={actions.resetDemoData}
                  type="button"
                >
                  데모 데이터로 초기화
                </button>
              </aside>
            </main>

            <section className="mt-6">
              <FeedbackBoard
                feedbacks={data.feedbacks || []}
                onAddFeedback={actions.addFeedback}
                onRemoveFeedback={actions.removeFeedback}
                contactEndpoint={contactEndpoint}
                deliveryMethod={feedbackDeliveryMethod}
                contactEmail={contactEmail}
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
