export function formatCurrency(value) {
  return `${new Intl.NumberFormat('ko-KR', {
    maximumFractionDigits: 0,
  }).format(value || 0)}원`;
}

export function formatPercent(value) {
  return `${Math.round((value || 0) * 100)}%`;
}
