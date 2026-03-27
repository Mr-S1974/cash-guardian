const ACTIONS = [
  {
    id: 'income',
    eyebrow: 'Income',
    title: '수입',
    description: '월급, 용돈, 장학금, 기타수입을 관리합니다.',
  },
  {
    id: 'spending',
    eyebrow: 'Spend',
    title: '지출',
    description: '오늘 쓴 돈을 기록하거나 소비 흐름을 확인합니다.',
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
    description: '데이터 관리, 쓸 돈 기준, 문의를 모아둡니다.',
  },
];

export function HomeActionPanel({ onSelect }) {
  return (
    <section className="rounded-[32px] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fff7ed_18%,#ffffff_46%,#ecfeff_100%)] p-5 shadow-card lg:p-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.28em] text-rose-500">
          PICK YOUR MOVE
        </p>
        <h2 className="mt-2 text-[1.8rem] font-black leading-[0.95] tracking-[-0.06em] text-slate-950">
          지금 건드릴 화면만
          <br />
          바로 찍으세요
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          첫 화면에서는 고민하지 말고, 필요한 관리로 바로 들어가면 됩니다.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {ACTIONS.map((action) => (
          <button
            className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fffaf5_42%,#f0fdfa_100%)] p-5 text-left transition hover:-translate-y-1 hover:border-rose-300 hover:shadow-card"
            key={action.id}
            onClick={() => onSelect(action.id)}
            type="button"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#f43f5e_0%,#14b8a6_100%)] opacity-80" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-700/80">
                  {action.eyebrow}
                </p>
                <p className="mt-5 text-[1.8rem] font-black leading-[0.95] tracking-[-0.06em] text-slate-950">
                  {action.title}
                </p>
              </div>
              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white transition group-hover:bg-rose-500">
                GO
              </span>
            </div>
            <p className="mt-4 max-w-[18rem] text-sm leading-6 text-slate-500">{action.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
