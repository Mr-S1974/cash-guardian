import { AlertBanner } from './components/AlertBanner';
import { FinanceCard } from './components/FinanceCard';
import { SpendingForm } from './components/SpendingForm';
import { TransactionList } from './components/TransactionList';
import { useLocalFinanceData } from './hooks/useLocalFinanceData';
import { formatCurrency, formatPercent } from './lib/format';

export default function App() {
  const { data, summary, status, actions } = useLocalFinanceData();

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
          <main className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
            <section className="grid gap-5">
              <section className="grid gap-4 lg:grid-cols-2">
                <FinanceCard
                  eyebrow="월급"
                  title="이번 달 기준선"
                  value={formatCurrency(summary.salary)}
                  subValue="월급 대비 결제 수단별 사용량을 실시간으로 비교합니다."
                  tone="accent"
                />
                <section className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-1 2xl:grid-cols-3">
                  <FinanceCard
                    eyebrow="신용카드"
                    title="현재 사용"
                    value={formatCurrency(summary.creditSpent)}
                    subValue={`월급 대비 ${formatPercent(summary.creditUsageRate)}`}
                    tone="light"
                  />
                  <FinanceCard
                    eyebrow="체크카드"
                    title="현재 사용"
                    value={formatCurrency(summary.debitSpent)}
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
              </section>

              <AlertBanner
                salary={summary.salary}
                creditSpent={summary.creditSpent}
                overage={summary.overage}
                visible={summary.shouldWarn}
              />

              <button
                className="w-full rounded-[26px] border border-slate-200 bg-white px-5 py-5 text-left shadow-card transition hover:border-teal-200 hover:bg-teal-50"
                type="button"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Sponsored Tip
                </p>
                <p className="mt-2 text-lg font-bold leading-tight text-slate-950 lg:text-xl">
                  체크카드 전환으로 3만원 방어하기
                </p>
              </button>

              <section className="rounded-[28px] border border-line bg-white p-5 shadow-card lg:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Guardrail
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-slate-950 lg:text-2xl">
                      안전 신용카드 한도
                    </h2>
                    <p className="mt-2 break-words text-[clamp(1.4rem,2vw,2.1rem)] font-bold leading-tight tracking-[-0.03em] text-slate-950 [overflow-wrap:anywhere]">
                      {formatCurrency(summary.creditThreshold)}
                    </p>
                  </div>
                  <p className="text-sm leading-6 text-slate-600 lg:max-w-sm lg:text-right">
                    남은 안전 구간 {formatCurrency(summary.remainingSafeCredit)}. 신용카드 결제가
                    방어선을 넘으면 체크카드 전환 CTA가 바로 보이도록 설계했습니다.
                  </p>
                </div>
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      summary.shouldWarn ? 'bg-red-500' : 'bg-teal-600'
                    }`}
                    style={{
                      width: `${Math.min(summary.creditUsageRate * 100, 100)}%`,
                    }}
                  />
                </div>
              </section>

              <TransactionList transactions={data.transactions.slice(0, 6)} />
            </section>

            <aside className="grid gap-5 self-start lg:sticky lg:top-6">
              <SpendingForm
                defaultSalary={data.salary}
                onAddTransaction={actions.addTransaction}
                onSetSalary={actions.setSalary}
              />

              <section className="rounded-[28px] bg-slate-950 p-5 text-white shadow-card lg:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  Storage
                </p>
                <h2 className="mt-2 text-2xl font-bold">CASH GUARDIAN</h2>
                <p className="mt-4 text-sm leading-7 text-white/75">
                  이 앱의 데이터는 서버가 아니라 이 기기의 로컬 저장소에만 남습니다. 로그인 없이도
                  빠르게 쓰고, 민감한 소비 정보는 내 기기 안에서만 관리하는 흐름입니다.
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
        )}
      </div>
    </div>
  );
}
