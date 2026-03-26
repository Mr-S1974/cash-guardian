import { useEffect, useState } from 'react';
import { fetchWatchlistSnapshot } from '../lib/market';
import { formatNumber } from '../lib/format';

function formatSignedNumber(value) {
  const absoluteValue = Math.abs(value || 0);
  return `${value > 0 ? '+' : value < 0 ? '-' : ''}${formatNumber(absoluteValue)}`;
}

function formatSignedPercent(value) {
  const absoluteValue = Math.abs(value || 0).toFixed(2);
  return `${value > 0 ? '+' : value < 0 ? '-' : ''}${absoluteValue}%`;
}

function formatNewsDate(isoDate) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));
}

export function WatchlistPanel({ watchlist, onAddWatchlist, onRemoveWatchlist }) {
  const [snapshots, setSnapshots] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;

    if (watchlist.length === 0) {
      setSnapshots({});
      return () => {
        active = false;
      };
    }

    const loadSnapshots = async () => {
      setIsLoading(true);

      const entries = await Promise.all(
        watchlist.map(async (item) => {
          try {
            const snapshot = await fetchWatchlistSnapshot(item.query);

            return [
              item.id,
              {
                status: 'ready',
                data: snapshot,
              },
            ];
          } catch (error) {
            return [
              item.id,
              {
                status: 'error',
                error: '관심종목 정보를 불러오지 못했습니다.',
              },
            ];
          }
        }),
      );

      if (!active) {
        return;
      }

      setSnapshots(Object.fromEntries(entries));
      setIsLoading(false);
    };

    loadSnapshots();

    return () => {
      active = false;
    };
  }, [watchlist]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = String(formData.get('query') || '').trim();

    if (!query) {
      return;
    }

    await onAddWatchlist(query);
    event.currentTarget.reset();
  };

  return (
    <section className="rounded-[28px] bg-white p-5 shadow-card lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Market Watch
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">관심종목과 관련 뉴스</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          외부 시세 연동
        </span>
      </div>

      <form className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
        <input
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white"
          name="query"
          placeholder="예: AAPL, TSLA, NVDA, 005930.KS"
        />
        <button
          className="rounded-2xl bg-teal-600 px-5 py-4 text-base font-semibold text-white"
          type="submit"
        >
          관심종목 추가
        </button>
      </form>

      <div className="mt-3 text-sm text-slate-500">
        {isLoading ? '관심종목 시세와 뉴스를 불러오는 중입니다.' : '등록한 종목별로 요약 시세와 뉴스를 표시합니다.'}
      </div>

      <div className="mt-5 grid gap-4">
        {watchlist.map((item) => {
          const snapshot = snapshots[item.id];
          const market = snapshot?.data;
          const isPositive = (market?.regularMarketChangePercent || 0) >= 0;

          return (
            <article className="rounded-[24px] border border-slate-200 p-4" key={item.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-slate-950">
                    {market?.shortName || item.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {(market?.symbol || item.query).toUpperCase()} · {market?.exchange || '정보 조회 중'}
                  </p>
                </div>
                <button
                  className="text-sm font-semibold text-slate-400 transition hover:text-red-500"
                  onClick={() => onRemoveWatchlist(item.id)}
                  type="button"
                >
                  삭제
                </button>
              </div>

              {snapshot?.status === 'error' ? (
                <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  {snapshot.error}
                </p>
              ) : snapshot?.status === 'ready' ? (
                <>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        현재가
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-950">
                        {formatNumber(market.regularMarketPrice)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        전일 대비
                      </p>
                      <p
                        className={`mt-2 text-2xl font-bold ${
                          isPositive ? 'text-teal-700' : 'text-rose-600'
                        }`}
                      >
                        {formatSignedNumber(market.regularMarketChange)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        등락률
                      </p>
                      <p
                        className={`mt-2 text-2xl font-bold ${
                          isPositive ? 'text-teal-700' : 'text-rose-600'
                        }`}
                      >
                        {formatSignedPercent(market.regularMarketChangePercent)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      관련 뉴스
                    </p>
                    <div className="mt-3 grid gap-3">
                      {market.news.length > 0 ? (
                        market.news.map((newsItem) => (
                          <a
                            className="rounded-2xl bg-white px-4 py-4 transition hover:border-teal-200 hover:bg-teal-50"
                            href={newsItem.url}
                            key={newsItem.id}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <p className="text-sm font-semibold leading-6 text-slate-950">
                              {newsItem.title}
                            </p>
                            <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                              {newsItem.publisher} · {formatNewsDate(newsItem.publishedAt)}
                            </p>
                          </a>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">표시할 관련 뉴스가 없습니다.</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-500">
                  종목 정보를 확인하는 중입니다.
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
