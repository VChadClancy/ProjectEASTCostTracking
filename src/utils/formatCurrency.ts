// Currency formatting helper for executive-grade UI
export function formatCurrency(value: number): string {
  if (value == null || isNaN(value)) return '-';
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1000000) {
    return `${sign}$${(abs / 1000000).toFixed(1)}M`;
  }
  if (abs >= 1000) {
    return `${sign}$${(abs / 1000).toFixed(1)}K`;
  }
  return `${sign}$${abs.toLocaleString()}`;
}

// Percent formatting helper (e.g., 5.26 -> "5.3%")
export function formatPercent(value: number): string {
  if (value == null || isNaN(value) || !isFinite(value)) return '-';
  return value.toFixed(1) + '%';
}
