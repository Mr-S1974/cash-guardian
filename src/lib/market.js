const SEARCH_ENDPOINT = 'https://query1.finance.yahoo.com/v1/finance/search';
const QUOTE_ENDPOINT = 'https://query1.finance.yahoo.com/v7/finance/quote';

async function requestJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`market_request_failed_${response.status}`);
  }

  return response.json();
}

function normalizeNewsItem(item) {
  const url =
    item.link ||
    item.clickThroughUrl?.url ||
    item.clickThroughUrl ||
    item.url ||
    '';

  return {
    id: item.uuid || url || item.title,
    title: item.title || '제목 없음',
    publisher: item.publisher || 'Yahoo Finance',
    url,
    publishedAt: item.providerPublishTime
      ? new Date(item.providerPublishTime * 1000).toISOString()
      : new Date().toISOString(),
  };
}

export async function fetchWatchlistSnapshot(query) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    throw new Error('empty_watchlist_query');
  }

  const searchUrl = `${SEARCH_ENDPOINT}?q=${encodeURIComponent(
    normalizedQuery,
  )}&quotesCount=6&newsCount=6&enableFuzzyQuery=false`;
  const searchResult = await requestJson(searchUrl);
  const quoteCandidate = (searchResult.quotes || []).find(
    (item) => item.symbol && (item.quoteType === 'EQUITY' || item.isYahooFinance),
  );

  if (!quoteCandidate?.symbol) {
    throw new Error('watchlist_symbol_not_found');
  }

  const quoteUrl = `${QUOTE_ENDPOINT}?symbols=${encodeURIComponent(quoteCandidate.symbol)}`;
  const quoteResult = await requestJson(quoteUrl);
  const quote = quoteResult.quoteResponse?.result?.[0];

  if (!quote?.symbol) {
    throw new Error('watchlist_quote_not_found');
  }

  return {
    symbol: quote.symbol,
    shortName: quote.shortName || quote.longName || quoteCandidate.shortname || normalizedQuery,
    exchange: quote.fullExchangeName || quote.exchange || quoteCandidate.exchange || '시장 정보 없음',
    marketState: quote.marketState || 'REGULAR',
    currency: quote.currency || quote.financialCurrency || 'USD',
    regularMarketPrice: quote.regularMarketPrice ?? 0,
    regularMarketChange: quote.regularMarketChange ?? 0,
    regularMarketChangePercent: quote.regularMarketChangePercent ?? 0,
    regularMarketPreviousClose: quote.regularMarketPreviousClose ?? 0,
    regularMarketOpen: quote.regularMarketOpen ?? 0,
    news: (searchResult.news || []).slice(0, 4).map(normalizeNewsItem),
  };
}
