const ACTIONS = [
  {
    id: 'income',
    eyebrow: 'Income',
    title: '수입',
    description: '월급, 성과급, 기타수입을 관리합니다.',
  },
  {
    id: 'spending',
    eyebrow: 'Spend',
    title: '지출',
    description: '지출관리와 나의 소비 패턴으로 이동합니다.',
  },
  {
    id: 'watchlist',
    eyebrow: 'Watch',
    title: '관심종목',
    description: '종목코드, 시세, 관련 뉴스를 확인합니다.',
  },
  {
    id: 'settings',
    eyebrow: 'Setup',
    title: '설정관리',
    description: '데이터 관리, 소비관리, 문의를 모아둡니다.',
  },
];

export function HomeActionPanel({ onSelect }) {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-card lg:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Main Menu
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-950">바로 시작할 관리를 선택하세요</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          필요한 관리 화면으로 바로 전환할 수 있습니다.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {ACTIONS.map((action) => (
          <button
            className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f5fbfa_100%)] p-5 text-left transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-card"
            key={action.id}
            onClick={() => onSelect(action.id)}
            type="button"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700/80">
              {action.eyebrow}
            </p>
            <p className="mt-4 text-[1.45rem] font-black tracking-[-0.04em] text-slate-950">
              {action.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{action.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
