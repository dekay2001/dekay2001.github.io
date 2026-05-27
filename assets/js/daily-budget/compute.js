/**
 * Pure computation module for Daily Budget.
 * No DOM dependencies — safe to unit test.
 */

const DAYS_PER_MONTH = 30.44;

/**
 * @param {Array<{dailyCost: number, daysPerWeek: number}>} categories
 * @param {number} fixedMonthly - Total fixed monthly costs
 * @returns {{dailyAvg: number, weekly: number, monthly: number, annual: number}}
 */
function computeTotals(categories, fixedMonthly) {
  let weeklyTotal = 0;
  for (const cat of categories) {
    weeklyTotal += cat.dailyCost * cat.daysPerWeek;
  }

  const dailyAvg = weeklyTotal / 7;
  const fixedDaily = fixedMonthly / DAYS_PER_MONTH;
  const totalDaily = dailyAvg + fixedDaily;
  const weekly = totalDaily * 7;
  const monthly = totalDaily * DAYS_PER_MONTH;
  const annual = monthly * 12;

  return { dailyAvg, weekly, monthly, annual, fixedDaily, totalDaily };
}

/**
 * @param {number} dailyTotal - Discretionary daily total (excludes fixed)
 * @param {number} dailyTarget - Daily budget target
 * @returns {{difference: number, status: string, percent: number}}
 */
function computeStatus(dailyTotal, dailyTarget) {
  const difference = dailyTarget - dailyTotal;
  const percent = dailyTarget > 0 ? (dailyTotal / dailyTarget) * 100 : 0;
  let status;
  if (Math.abs(difference) < 0.01) {
    status = 'on-target';
  } else if (difference > 0) {
    status = 'under';
  } else {
    status = 'over';
  }
  return { difference, status, percent };
}

export { computeTotals, computeStatus, DAYS_PER_MONTH };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { computeTotals, computeStatus, DAYS_PER_MONTH };
}
