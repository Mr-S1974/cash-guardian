import { AlertBanner } from './components/AlertBanner';
import { FinanceCard } from './components/FinanceCard';
import { SpendingForm } from './components/SpendingForm';
import { TransactionList } from './components/TransactionList';
import { useLocalFinanceData } from './hooks/useLocalFinanceData';

function formatCurrency(value) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

export default function App() {
  const { data, summary, status, actions } = useLocalFinanceData();

  return (
    <div className="min-h-screen bg-mist text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-10 pt-6 sm:max-w-lg">
        <header className="pb-6">
          <div className="rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.18),_transparent_35%),linear-gradient(180deg,#ffffff_0%,#eef4fb_100%)] p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Cash Guardian PWA
            </p>
            <h1 className="mt-3 text-[2rem] font-bold leading-[1.05] tracking-tight text-slate-950">
              1초 안에 보이는
              <br />
              소비 방어 대시보드
            </h1>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">
              데이터는 서버로 전송되지 않고 이 기기의 IndexedDB에만 저장됩니다.
            </p>
          </div>
        </header>

        {status === 'loading' ? (
          <div className="rounded-[28px] bg-white p-6 text-sm font-medium text-slate-500 shadow-card">
            로컬 데이터를 불러오는 중입니다.
          </div>
        ) : (
          <main className="grid gap-4">
            <section className="grid gap-4">
              <FinanceCard
                eyebrow="월급"
                title="이번 달 기준선"
                value={formatCurrency(summary.salary)}
                subValue="월급 대비 카드 사용량을 실시간으로 비교합니다."
                tone="accent"
              />
              <div className="grid grid-cols-2 gap-4">
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
              </div>
            </section>

            <AlertBanner
              salary={summary.salary}
              creditSpent={summary.creditSpent}
              overage={summary.overage}
              visible={summary.shouldWarn}
            />

            <button
              className="w-full rounded-[26px] border border-slate-200 bg-white px-5 py-5 text-left shadow-card"
              type="button"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Sponsored Tip
              </p>
              <p className="mt-2 text-lg font-bold leading-tight text-slate-950">
                체크카드 전환으로 3만원 방어하기
              </p>
            </button>

            <SpendingForm
              defaultSalary={data.salary}
              onAddTransaction={actions.addTransaction}
              onSetSalary={actions.setSalary}
            />

            <section className="rounded-[28px] border border-line bg-white p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Guardrail
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-950">
                안전 신용카드 한도 {formatCurrency(summary.creditThreshold)}
              </h2>
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
              <p className="mt-3 text-sm leading-6 text-slate-600">
                남은 안전 구간 {formatCurrency(summary.remainingSafeCredit)}. 신용카드 결제가 방어선을
                넘으면 체크카드 전환 CTA가 바로 보이도록 설계했습니다.
              </p>
            </section>

            <TransactionList transactions={data.transactions.slice(0, 5)} />

            <button
              className="rounded-2xl border border-slate-200 bg-transparent px-4 py-4 text-sm font-semibold text-slate-500"
              onClick={actions.resetDemoData}
              type="button"
            >
              데모 데이터로 초기화
            </button>
          </main>
        )}
      </div>
    </div>
  );
}
