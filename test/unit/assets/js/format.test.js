const { formatCurrency, formatDailyRate } = require('../../../../assets/js/life-money/format.js');

describe('formatCurrency', () => {
  it('formats a round number with dollar sign', () => {
    expect(formatCurrency(1000)).toBe('$1,000');
  });

  it('rounds to nearest integer', () => {
    expect(formatCurrency(1234.56)).toBe('$1,235');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('formats large numbers with commas', () => {
    expect(formatCurrency(1500000)).toBe('$1,500,000');
  });

  it('rounds negative numbers', () => {
    expect(formatCurrency(-500.4)).toBe('$-500');
  });
});

describe('formatDailyRate', () => {
  it('formats with two decimal places', () => {
    expect(formatDailyRate(13.5)).toBe('$13.50');
  });

  it('formats zero', () => {
    expect(formatDailyRate(0)).toBe('$0.00');
  });

  it('preserves precision', () => {
    expect(formatDailyRate(95.876)).toBe('$95.88');
  });
});
