import { useState } from 'react';

export function SettingsPanel({ onResetDemoData }) {
  const [tab, setTab] = useState('storage');

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-card lg:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Settings</p>
        <h2 className="mt-2 text-xl font-bold text-slate-950">앱 설정</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          저장 방식과 초기화 같은 환경 관리는 이곳에서 정리합니다.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
        <button
          className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            tab === 'storage' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
          }`}
          onClick={() => setTab('storage')}
          type="button"
        >
          저장소
        </button>
        <button
          className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            tab === 'manage' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
          }`}
          onClick={() => setTab('manage')}
          type="button"
        >
          데이터 관리
        </button>
      </div>

      {tab === 'storage' ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-950">로컬 저장소 사용 중</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            수입, 지출, 메모, 영수증, 관심종목은 이 기기 브라우저 저장소에만 보관됩니다. 문의는
            맨 아래 Contact Us에서 별도로 처리됩니다.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">데모 데이터 초기화</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              현재 화면을 기본 예시 데이터 상태로 되돌립니다.
            </p>
          </div>
          <button
            className="rounded-2xl border border-slate-200 bg-transparent px-4 py-4 text-sm font-semibold text-slate-600"
            onClick={onResetDemoData}
            type="button"
          >
            데모 데이터로 초기화
          </button>
        </div>
      )}
    </section>
  );
}
