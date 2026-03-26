export function FinanceCard({ eyebrow, title, value, subValue, tone = 'light' }) {
  const tones = {
    light: 'bg-white text-slate-950',
    accent: 'bg-slate-950 text-white',
    mint: 'bg-teal-700 text-white',
  };

  return (
    <article className={`rounded-[28px] p-5 shadow-card ${tones[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">{eyebrow}</p>
      <h3 className="mt-3 text-base font-medium opacity-80">{title}</h3>
      <p className="mt-6 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-3 text-sm opacity-75">{subValue}</p>
    </article>
  );
}
