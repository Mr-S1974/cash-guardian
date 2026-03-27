import { FeedbackBoard } from './components/FeedbackBoard';
import { FinanceCard } from './components/FinanceCard';
import { MonthlyGuidelinePanel } from './components/MonthlyGuidelinePanel';
import { SettingsPanel } from './components/SettingsPanel';
import { SpendingForm } from './components/SpendingForm';
import { TransactionList } from './components/TransactionList';
import { WatchlistPanel } from './components/WatchlistPanel';
import { useLocalFinanceData } from './hooks/useLocalFinanceData';
import { formatCurrency, formatPercent } from './lib/format';

export default function App() {
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
              데이터는 서버로 전송되지 않고 이 기기의 로컬 저장소에만 저장됩니다. 모바일에서는 위에서
              아래로 수입 확인, 지출 입력, 기록 점검, 설정 정리까지 자연스럽게 이어지도록 구성했습니다.
            </p>
          </div>
        </header>

        {status === 'loading' ? (
          <div className="rounded-[28px] bg-white p-6 text-sm font-medium text-slate-500 shadow-card">
            로컬 데이터를 불러오는 중입니다.
          </div>
        ) : (
          <>
            <main className="grid gap-5">
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <FinanceCard
                  eyebrow="총수입"
                  title="이번 달 기준"
                  value={formatCurrency(summary.totalIncome)}
                  subValue="월급, 성과금, 부수입을 합산한 월간 수입입니다."
                  tone="accent"
                />
                <FinanceCard
                  eyebrow="총지출"
                  title="현재 사용"
                  value={formatCurrency(summary.totalSpent)}
                  subValue={`수입 대비 ${formatPercent(summary.totalUsageRate)}`}
                  tone="mint"
                />
                <FinanceCard
                  eyebrow="카드"
                  title="현재 사용"
                  value={formatCurrency(summary.cardSpent)}
                  subValue={`수입 대비 ${formatPercent(summary.cardUsageRate)}`}
                  tone="light"
                />
                <FinanceCard
                  eyebrow="현금"
                  title="현재 사용"
                  value={formatCurrency(summary.cashSpent)}
                  subValue="카드 외 직접 지출 흐름"
                  tone="light"
                />
              </section>

              <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                <SpendingForm
                  incomeSources={data.incomeSources || []}
                  onAddTransaction={actions.addTransaction}
                  onSetIncomeSources={actions.setIncomeSources}
                />
                <div className="grid gap-5">
                  <TransactionList transactions={data.transactions.slice(0, 6)} />
                  <MonthlyGuidelinePanel
                    guidelines={data.monthlyGuidelines || {}}
                    onSetGuidelines={actions.setMonthlyGuidelines}
                    summary={summary}
                  />
                </div>
              </section>

              <WatchlistPanel
                watchlist={data.watchlist || []}
                onAddWatchlist={actions.addWatchlist}
                onRemoveWatchlist={actions.removeWatchlist}
              />

              <SettingsPanel onResetDemoData={actions.resetDemoData} />
            </main>

            <section className="mt-6">
              <FeedbackBoard
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
