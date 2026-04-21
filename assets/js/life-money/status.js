/**
 * Status message generator for Life Financial Runway.
 * No DOM dependencies — safe to unit test.
 */

import { formatCurrency, formatDailyRate } from './format.js';

function generateStatusMessage({ depleted, depletedAge, finalBalance, dailyGen,
                                 dailyCost, gap, monthlyIncome, monthlyReturn, annualInflation,
                                 finalMonthlyExpenses, monthlyExpenses, life, savings,
                                 socialSecurity, healthcareGap, lumpEvent }) {
  let html = '';
  if (!depleted) {
    html  = `Your portfolio <span class="good">outlasts you</span> — ending at <span>${formatCurrency(finalBalance)}</span> at age ${life}. `;
    html += `Your investments generate <span class="good">${formatDailyRate(dailyGen)}/day</span> vs your ${formatDailyRate(dailyCost)}/day need. `;
    if (monthlyIncome > 0) html += `The ${formatCurrency(monthlyIncome)}/mo income is doing heavy lifting. `;
    html += `You have more than enough — the question is what to do with the surplus.`;
    if (annualInflation > 0) {
      html += ` With ${(annualInflation * 100).toFixed(1)}% annual inflation, expenses grow from ${formatCurrency(monthlyExpenses)}/mo to ${formatCurrency(finalMonthlyExpenses)}/mo.`;
    }
  } else {
    const yearsShort = life - Math.round(depletedAge);
    html  = `At this rate, your portfolio runs out at <span class="bad">age ${Math.round(depletedAge)}</span> — <span class="bad">${yearsShort} years short</span> of age ${life}. `;
    if (monthlyReturn > 0) {
      const neededSavings = gap.amount / monthlyReturn;
      html += `To never touch principal, you'd need <span class="warn">${formatCurrency(neededSavings)}</span> invested. `;
    } else {
      html += `With your current monthly return, a required principal target can't be estimated from investment income alone. `;
    }
    html += `Or generate an extra <span class="warn">${formatCurrency(gap.amount)}/mo</span> in income. `;
    html += `Your ${formatCurrency(savings)} portfolio generates <span class="warn">${formatDailyRate(dailyGen)}/day</span> — your need is ${formatDailyRate(dailyCost)}/day.`;
    if (annualInflation > 0) {
      html += ` With ${(annualInflation * 100).toFixed(1)}% annual inflation, expenses grow from ${formatCurrency(monthlyExpenses)}/mo to ${formatCurrency(finalMonthlyExpenses)}/mo.`;
    }
  }
  // Advanced scenario notes
  if (socialSecurity && socialSecurity.monthlyAmount > 0) {
    html += ` Social Security adds ${formatCurrency(socialSecurity.monthlyAmount)}/mo starting at age ${socialSecurity.startsAtAge}.`;
  }
  if (healthcareGap && healthcareGap.monthlyCost > 0) {
    html += ` Healthcare gap costs ${formatCurrency(healthcareGap.monthlyCost)}/mo until age ${healthcareGap.coveredUntilAge}.`;
  }
  if (lumpEvent && lumpEvent.amount !== 0) {
    const label = lumpEvent.amount > 0 ? 'windfall' : 'expense';
    html += ` One-time ${label} of ${formatCurrency(Math.abs(lumpEvent.amount))} at age ${lumpEvent.atAge}.`;
  }
  return { html };
}

export { generateStatusMessage };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateStatusMessage };
}
