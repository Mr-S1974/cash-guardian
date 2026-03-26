export function StorageSelector({ value, onChange }) {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-card lg:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Storage Route
      </p>
      <h2 className="mt-2 text-xl font-bold text-slate-950">저장 장소 선택</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        입력 데이터는 이 기기 브라우저 저장소에만 저장됩니다. 문의는 하단 Contact Us에서 의견만
        별도로 남길 수 있습니다.
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
      </div>
    </section>
  );
}
