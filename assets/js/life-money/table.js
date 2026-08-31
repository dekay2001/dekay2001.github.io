/**
 * Month-by-month detail table renderer for Life Financial Runway.
 * Accepts a <tbody> element and per-month simulation data, renders rows.
 */

import { formatCurrency } from './format.js';

function formatSignedCurrency(value) {
  const rounded = Math.round(value);
  const sign = rounded > 0 ? '+' : (rounded < 0 ? '-' : '');
  return sign + formatCurrency(Math.abs(rounded));
}

function renderMonthlyTable(tbodyEl, {
  age, monthlyIncome, monthlyExpensesApplied, monthlyGrowth, monthlyNetChange,
  monthlyPenalty, brokerageBalances, retirementBalances, lumpEventMonth,
}) {
  tbodyEl.innerHTML = monthlyIncome.map((income, idx) => {
    const month = idx + 1;
    const currentAge = age + month / 12;
    const netChange = monthlyNetChange[idx];
    const netChangeClass = netChange < 0 ? 'amount-negative' : (netChange > 0 ? 'amount-positive' : '');
    const penalty = monthlyPenalty ? monthlyPenalty[idx] : 0;
    const displayedPenalty = Math.round(penalty);
    const hasPenalty = displayedPenalty > 0;
    const rowClasses = [
      lumpEventMonth === month ? 'lump-event-row' : '',
      hasPenalty ? 'penalty-row' : '',
    ].filter(Boolean).join(' ');
    return `<tr class="${rowClasses}">` +
      `<td>${month}</td>` +
      `<td>${currentAge.toFixed(1)}</td>` +
      `<td>${formatCurrency(income)}</td>` +
      `<td>${formatCurrency(monthlyExpensesApplied[idx])}</td>` +
      `<td>${formatSignedCurrency(monthlyGrowth[idx])}</td>` +
      `<td class="${netChangeClass}">${netChangeClass ? `<span class="net-chip">${formatSignedCurrency(netChange)}</span>` : formatSignedCurrency(netChange)}</td>` +
      `<td class="${hasPenalty ? 'amount-negative' : ''}">${hasPenalty ? `<span class="net-chip">-${formatCurrency(displayedPenalty)}</span>` : '\u2014'}</td>` +
      `<td>${formatCurrency(brokerageBalances[month])}</td>` +
      `<td>${formatCurrency(retirementBalances[month])}</td>` +
    `</tr>`;
  }).join('');
}

export { renderMonthlyTable };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderMonthlyTable };
}
