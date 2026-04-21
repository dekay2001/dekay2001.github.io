/**
 * Formatting helpers for Life Financial Runway.
 * No DOM dependencies — safe to unit test.
 */

function formatCurrency(value) {
  return '$' + Math.round(value).toLocaleString();
}

function formatDailyRate(value) {
  return '$' + value.toFixed(2);
}

export { formatCurrency, formatDailyRate };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { formatCurrency, formatDailyRate };
}
