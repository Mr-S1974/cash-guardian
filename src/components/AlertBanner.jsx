function formatCurrency(value) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(value);
}

export function AlertBanner({ salary, creditSpent, overage, visible }) {
  if (!visible) {
    return null;
  }

  return (
    <section className="rounded-[28px] border border-red-200 bg-gradient-to-br from-rose-50 to-red-100 p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-500">
            Spend Guard Alert
          </p>
          <h2 className="mt-2 text-[1.35rem] font-bold leading-tight text-red-950">
            신용카드 사용이 월급 25% 방어선을 넘었습니다.
          </h2>
        </div>
        <div className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-red-700">
          초과 {formatCurrency(overage)}
        </div>
      </div>

      <div className="mt-4 grid gap-3 rounded-[22px] bg-white/80 p-4 text-sm text-red-900">
        <p>
          이번 달 월급은 <span className="font-semibold">{formatCurrency(salary)}</span>, 신용카드
          사용은 <span className="font-semibold">{formatCurrency(creditSpent)}</span>입니다.
        </p>
        <p className="text-red-700">
          오늘부터 고정 지출 외 결제 수단을 체크카드로 바꾸면 다음 결제일 방어 확률이 높아집니다.
        </p>
      </div>
    </section>
  );
}
