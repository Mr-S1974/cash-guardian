export function StorageSelector({ value, onChange }) {
  return (
    <section className="rounded-[28px] bg-white p-5 shadow-card lg:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Storage Route
      </p>
      <h2 className="mt-2 text-xl font-bold text-slate-950">저장 장소 선택</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        입력 전에 저장 위치를 먼저 선택하세요. 로컬 저장은 내 기기에만 저장되고, 본사 전달함은
        전달 대기 의견으로 분리 보관됩니다.
      </p>

      <div className="mt-5 grid gap-3">
        <button
          className={`rounded-2xl border px-4 py-4 text-left transition ${
            value === 'local'
              ? 'border-teal-500 bg-teal-50'
              : 'border-slate-200 bg-slate-50 hover:border-teal-200'
          }`}
          onClick={() => onChange('local')}
          type="button"
        >
          <p className="text-sm font-semibold text-slate-950">내 기기 로컬 저장소</p>
          <p className="mt-1 text-sm text-slate-500">
            월급, 지출, 메모, 영수증, 관심종목을 내 브라우저 저장소에 저장합니다.
          </p>
        </button>

        <button
          className={`rounded-2xl border px-4 py-4 text-left transition ${
            value === 'hq'
              ? 'border-slate-950 bg-slate-950 text-white'
              : 'border-slate-200 bg-slate-50 hover:border-slate-300'
          }`}
          onClick={() => onChange('hq')}
          type="button"
        >
          <p className={`text-sm font-semibold ${value === 'hq' ? 'text-white' : 'text-slate-950'}`}>
            본사 전달함
          </p>
          <p className={`mt-1 text-sm ${value === 'hq' ? 'text-white/75' : 'text-slate-500'}`}>
            개선 요청, 오류 제보, 운영 의견을 본사 전달 대기 항목으로 분리 저장합니다.
          </p>
        </button>
      </div>
    </section>
  );
}
