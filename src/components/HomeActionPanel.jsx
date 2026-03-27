const ACTIONS = [
  {
    id: 'income',
    eyebrow: '1',
    title: '수입 관리',
    description: '이번 달 월급과 기타 수입부터 관리합니다.',
  },
  {
    id: 'spending',
    eyebrow: '2',
    title: '지출 관리',
    description: '카드와 현금 지출을 빠르게 추가합니다.',
  },
  {
    id: 'history',
    eyebrow: '3',
    title: '나의 소비 패턴',
    description: '최근 기록과 현재 소비 흐름을 점검합니다.',
  },
  {
    id: 'watchlist',
    eyebrow: '4',
    title: '관심종목 관리',
    description: '등록한 종목 코드, 시세, 관련 뉴스를 관리합니다.',
  },
  {
    id: 'settings',
    eyebrow: '5',
    title: '설정 관리',
    description: '데이터 관리와 소비관리를 한곳에서 정리합니다.',
  },
  {
    id: 'contact',
    eyebrow: '6',
    title: '문의 관리',
    description: '운영팀에 의견이나 문제를 바로 전달합니다.',
  },
];

export function HomeActionPanel({ onSelect }) {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-card lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Main Menu
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">관리할 화면을 선택하세요</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            필요한 관리 화면으로 바로 전환할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ACTIONS.map((action) => (
          <button
            className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-teal-300 hover:bg-teal-50"
            key={action.id}
            onClick={() => onSelect(action.id)}
            type="button"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
              Step {action.eyebrow}
            </p>
            <p className="mt-3 text-lg font-bold text-slate-950">{action.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{action.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
