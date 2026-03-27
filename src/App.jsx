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
          <div className="overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(248,113,113,0.28),_transparent_28%),radial-gradient(circle_at_85%_20%,_rgba(15,118,110,0.26),_transparent_26%),linear-gradient(135deg,#fff6eb_0%,#fff1f2_42%,#eefcf9_100%)] p-6 shadow-card lg:grid lg:grid-cols-[1.3fr_0.9fr] lg:items-end lg:gap-8 lg:p-8">
            <div>
              <p className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-black uppercase tracking-[0.28em] text-rose-600 shadow-sm">
                CASH GUARDIAN
              </p>
              <h1 className="mt-4 text-[2.35rem] font-black leading-[0.92] tracking-[-0.06em] text-slate-950 lg:text-[4.4rem]">
                숨만 쉬어도
                <br />
                녹는 내 돈,
              </h1>
              <p className="mt-4 max-w-xl text-lg font-bold tracking-[-0.04em] text-slate-950 lg:text-[1.65rem]">
                멱살 잡고 지켜내는 팩폭 코치
              </p>
              <p className="mt-3 max-w-lg text-sm leading-7 text-slate-700 lg:text-base">
                어디서 새는지 바로 보고, 지금 관리할 것만 골라서 바로 들어가세요.
              </p>
            </div>
            <div className="mt-5 rounded-[28px] border border-white/70 bg-white/70 p-5 backdrop-blur lg:mt-0">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-rose-500">
                No Login. No Tracking.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700 lg:text-base">
                귀찮은 인증, 찝찝한 데이터 수집 다 뺐습니다. 오직 이 기기 안에서만 돌아가는 초강력
                소비 통제 대시보드입니다.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                  수입 점검
                </span>
                <span className="rounded-full bg-teal-700 px-3 py-1 text-xs font-semibold text-white">
                  쓴 돈 점검
                </span>
                <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white">
                  관심종목 체크
                </span>
              </div>
            </div>
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
                    title="들어온 돈"
                    value={formatCurrency(summary.totalIncome)}
                    subValue="이번 달 들어온 돈을 한 번에 보여줍니다."
                    tone="accent"
                  />
                  <FinanceCard
                    eyebrow="지출"
                    title="나간 돈"
                    value={formatCurrency(summary.totalSpent)}
                    subValue={`쓸 돈 기준 대비 ${formatPercent(
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
              <ScreenShell
                title="수입 관리"
                description="월급, 용돈, 장학금, 알바비처럼 이번 달 수입을 먼저 정리합니다."
              >
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
                description="지출 기록을 남기거나, 내가 어디에 돈을 쓰는지 바로 확인하세요."
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
                      카드, 간편결제, 현금으로 쓴 돈을 기록합니다.
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
                      최근에 어디에 돈을 썼는지 흐름을 확인합니다.
                    </p>
                  </button>
                </section>
              </ScreenShell>
            ) : null}

            {activeScreen === 'spending-manage' ? (
              <ScreenShell
                title="지출 관리"
                description="밥값, 교통비, 쇼핑처럼 오늘 쓴 돈을 빠르게 추가합니다."
              >
                <SpendingForm
                  incomeSources={data.incomeSources || []}
                  onAddTransaction={actions.addTransaction}
                  onSetIncomeSources={actions.setIncomeSources}
                  showIncomeSection={false}
                />
              </ScreenShell>
            ) : null}

            {activeScreen === 'history' ? (
              <ScreenShell
                title="나의 소비 패턴"
                description="최근에 어디에 돈을 썼는지 흐름을 점검합니다."
              >
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
                description="데이터 관리와 쓸 돈 기준, 문의관리를 한곳에서 관리합니다."
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
