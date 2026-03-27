export function FinanceCard({ eyebrow, title, value, subValue, tone = 'light' }) {
  const tones = {
    light: 'border border-slate-200/80 bg-white text-slate-950',
    accent:
      'border border-slate-900/80 bg-[linear-gradient(135deg,#020617_0%,#111827_55%,#1f2937_100%)] text-white',
    mint:
      'border border-teal-700/70 bg-[linear-gradient(135deg,#0f766e_0%,#115e59_55%,#022c22_100%)] text-white',
  };

  return (
    <article
      className={`min-w-0 overflow-hidden rounded-[32px] p-5 shadow-card lg:min-h-[220px] lg:p-6 ${tones[tone]}`}
    >
      <p className="text-xs font-black uppercase tracking-[0.26em] opacity-70">{eyebrow}</p>
      <h3 className="mt-3 text-base font-semibold opacity-80">{title}</h3>
      <p className="mt-7 break-words text-[clamp(2.1rem,3vw,3.25rem)] font-black leading-[0.98] tracking-[-0.06em] [overflow-wrap:anywhere]">
        {value}
      </p>
      <p className="mt-4 max-w-sm text-sm leading-6 opacity-80">{subValue}</p>
    </article>
  );
}
