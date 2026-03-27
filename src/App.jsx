import { FinanceCard } from './components/FinanceCard';
import { HomeActionPanel } from './components/HomeActionPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { SpendingForm } from './components/SpendingForm';
import { TransactionList } from './components/TransactionList';
import { WatchlistPanel } from './components/WatchlistPanel';
import { useState } from 'react';
import { useLocalFinanceData } from './hooks/useLocalFinanceData';
import { formatCurrency, formatPercent } from './lib/format';

function ScreenShell({ title, description, children }) {
  return (
    <section className="grid gap-5">
      <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-card lg:p-6">
        <h2 className="mt-4 text-2xl font-bold text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState('home');
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
              데이터는 서버로 전송되지 않고 이 기기의 로컬 저장소에만 저장됩니다. 필요한 관리 화면만
              골라서 바로 이동할 수 있게 구성했습니다.
            </p>
          </div>
        </header>

        {status === 'loading' ? (
          <div className="rounded-[28px] bg-white p-6 text-sm font-medium text-slate-500 shadow-card">
            로컬 데이터를 불러오는 중입니다.
          </div>
        ) : (
          <>
            {activeScreen === 'home' ? (
              <main className="grid gap-5">
                <section className="grid gap-4 md:grid-cols-2">
                  <FinanceCard
                    eyebrow="수입"
                    title="이번 달"
                    value={formatCurrency(summary.totalIncome)}
                    subValue="월급, 성과급, 기타수입을 합산한 금액입니다."
                    tone="accent"
                  />
                  <FinanceCard
                    eyebrow="지출"
                    title="현재 사용"
                    value={formatCurrency(summary.totalSpent)}
                    subValue={`가이드라인 대비 ${formatPercent(
                      summary.guidelineTotal > 0
                        ? summary.totalSpent / summary.guidelineTotal
                        : summary.totalUsageRate,
                    )}`}
                    tone="mint"
                  />
                </section>

                <HomeActionPanel onSelect={setActiveScreen} />
              </main>
            ) : null}

            {activeScreen === 'income' ? (
              <ScreenShell title="수입 관리" description="이번 달 기준 수입원을 먼저 관리합니다.">
                <SpendingForm
                  incomeSources={data.incomeSources || []}
                  onAddTransaction={actions.addTransaction}
                  onSetIncomeSources={actions.setIncomeSources}
                  showExpenseSection={false}
                />
              </ScreenShell>
            ) : null}

            {activeScreen === 'spending' ? (
              <ScreenShell
                title="지출"
                description="지출관리와 나의 소비 패턴 중 필요한 화면을 선택하세요."
              >
                <section className="grid gap-3 md:grid-cols-2">
                  <button
                    className="rounded-[28px] border border-slate-200 bg-white p-5 text-left shadow-card transition hover:border-teal-300"
                    onClick={() => setActiveScreen('spending-manage')}
                    type="button"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                      Spend
                    </p>
                    <p className="mt-4 text-2xl font-black tracking-[-0.04em] text-slate-950">
                      지출관리
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      카드와 현금 지출을 기록합니다.
                    </p>
                  </button>
                  <button
                    className="rounded-[28px] border border-slate-200 bg-white p-5 text-left shadow-card transition hover:border-teal-300"
                    onClick={() => setActiveScreen('history')}
                    type="button"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                      Pattern
                    </p>
                    <p className="mt-4 text-2xl font-black tracking-[-0.04em] text-slate-950">
                      나의 소비 패턴
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      최근 소비 흐름과 메모를 확인합니다.
                    </p>
                  </button>
                </section>
              </ScreenShell>
            ) : null}

            {activeScreen === 'spending-manage' ? (
              <ScreenShell title="지출 관리" description="카드와 현금 지출을 빠르게 추가합니다.">
                <SpendingForm
                  incomeSources={data.incomeSources || []}
                  onAddTransaction={actions.addTransaction}
                  onSetIncomeSources={actions.setIncomeSources}
                  showIncomeSection={false}
                />
              </ScreenShell>
            ) : null}

            {activeScreen === 'history' ? (
              <ScreenShell title="나의 소비 패턴" description="최근 소비 기록과 현재 흐름을 점검합니다.">
                <TransactionList transactions={data.transactions.slice(0, 12)} />
              </ScreenShell>
            ) : null}

            {activeScreen === 'watchlist' ? (
              <ScreenShell
                title="관심종목 관리"
                description="등록한 종목 코드, 시세, 관련 뉴스를 확인합니다."
              >
                <WatchlistPanel
                  watchlist={data.watchlist || []}
                  onAddWatchlist={actions.addWatchlist}
                  onRemoveWatchlist={actions.removeWatchlist}
                />
              </ScreenShell>
            ) : null}

            {activeScreen === 'settings' ? (
              <ScreenShell
                title="설정 관리"
                description="데이터 관리와 소비관리, 문의관리를 한곳에서 관리합니다."
              >
                <SettingsPanel
                  contactEmail={contactEmail}
                  contactEndpoint={contactEndpoint}
                  deliveryMethod={feedbackDeliveryMethod}
                  guidelines={data.monthlyGuidelines || {}}
                  onResetDemoData={actions.resetSection}
                  onSetGuidelines={actions.setMonthlyGuidelines}
                  summary={summary}
                />
              </ScreenShell>
            ) : null}

            {activeScreen !== 'home' ? (
              <button
                className="fixed bottom-4 right-4 z-50 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-card"
                onClick={() => setActiveScreen('home')}
                type="button"
              >
                메인화면
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
