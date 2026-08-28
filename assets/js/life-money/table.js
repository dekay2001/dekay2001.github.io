/**
 * Month-by-month detail table renderer for Life Financial Runway.
 * Accepts a <tbody> element and per-month simulation data, renders rows.
 */

import { formatCurrency } from './format.js';

function formatSignedCurrency(value) {
  const sign = value > 0 ? '+' : (value < 0 ? '-' : '');
  return sign + formatCurrency(Math.abs(value));
}

function renderMonthlyTable(tbodyEl, {
  age, monthlyIncome, monthlyExpensesApplied, monthlyGrowth, monthlyNetChange,
  brokerageBalances, retirementBalances, lumpEventMonth,
}) {
  tbodyEl.innerHTML = monthlyIncome.map((income, idx) => {
    const month = idx + 1;
    const currentAge = age + month / 12;
    const netChange = monthlyNetChange[idx];
    const netChangeClass = netChange < 0 ? 'amount-negative' : (netChange > 0 ? 'amount-positive' : '');
    const rowClass = lumpEventMonth === month ? 'lump-event-row' : '';
    return `<tr class="${rowClass}">` +
      `<td>${month}</td>` +
      `<td>${currentAge.toFixed(1)}</td>` +
      `<td>${formatCurrency(income)}</td>` +
      `<td>${formatCurrency(monthlyExpensesApplied[idx])}</td>` +
      `<td>${formatSignedCurrency(monthlyGrowth[idx])}</td>` +
      `<td class="${netChangeClass}"><span class="net-chip">${formatSignedCurrency(netChange)}</span></td>` +
      `<td>${formatCurrency(brokerageBalances[month])}</td>` +
      `<td>${formatCurrency(retirementBalances[month])}</td>` +
    `</tr>`;
  }).join('');
}

export { renderMonthlyTable };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderMonthlyTable };
}
