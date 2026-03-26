export function formatNumber(value) {
  return new Intl.NumberFormat('ko-KR', {
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function formatCurrency(value) {
  return `${formatNumber(value)}원`;
}

export function formatPercent(value) {
  return `${Math.round((value || 0) * 100)}%`;
}

export function parseNumericInput(value) {
  const digits = String(value ?? '').replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
}

export function formatNumericInput(value) {
  const digits = String(value ?? '').replace(/[^\d]/g, '');

  if (!digits) {
    return '';
  }

  return formatNumber(Number(digits));
}
