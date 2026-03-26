export function FinanceCard({ eyebrow, title, value, subValue, tone = 'light' }) {
  const tones = {
    light: 'bg-white text-slate-950',
    accent: 'bg-slate-950 text-white',
    mint: 'bg-teal-700 text-white',
  };

  return (
    <article
      className={`min-w-0 rounded-[28px] p-5 shadow-card lg:min-h-[220px] lg:p-6 ${tones[tone]}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">{eyebrow}</p>
      <h3 className="mt-3 text-base font-medium opacity-80">{title}</h3>
      <p className="mt-6 break-words text-[clamp(1.75rem,2.6vw,3rem)] font-bold leading-[1.02] tracking-[-0.05em] [overflow-wrap:anywhere]">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 opacity-75">{subValue}</p>
    </article>
  );
}
