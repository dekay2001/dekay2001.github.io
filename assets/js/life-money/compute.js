/**
 * Pure computation module for Life Financial Runway.
 * No DOM dependencies — safe to unit test.
 */

/**
 * @param {Object} params
 * @param {number} params.age              Current age
 * @param {number} params.life             Expected age at death
 * @param {number} params.savings          Current savings / investments
 * @param {number} params.monthlyExpenses  Monthly expenses needed
 * @param {number} params.monthlyIncome    Monthly income
 * @param {number} params.annualReturn     Annual investment return (decimal, e.g. 0.07)
 * @param {number} [params.annualInflation=0] Annual inflation rate (decimal, e.g. 0.03)
 * @param {Object|null} [params.socialSecurity=null]  { monthlyAmount, startsAtAge }
 * @param {Object|null} [params.healthcareGap=null]   { monthlyCost, coveredUntilAge }
 * @param {Object|null} [params.lumpEvent=null]       { amount, atAge }
 * @returns {Object} Computed runway data
 */
function computeRunway({ age, life, savings, monthlyExpenses, monthlyIncome, annualReturn,
                         annualInflation = 0, socialSecurity = null, healthcareGap = null, lumpEvent = null }) {
  const yearsLeft = Math.max(life - age, 0);
  const daysLeft = Math.round(yearsLeft * 365.25);
  const monthlyNet = monthlyExpenses - monthlyIncome;
  const dailyCost = monthlyExpenses / 30.44;
  const monthlyReturn = annualReturn / 12;
  const dailyGen = (savings * annualReturn) / 365;
  const savingsPerDay = daysLeft > 0 ? savings / daysLeft : 0;

  const monthlyInflation = Math.pow(1 + annualInflation, 1 / 12) - 1;
  let currentExpenses = monthlyExpenses;

  let balance = savings;
  let depleted = false;
  let depletedAge = null;
  const balances = [balance];
  const needs = [0];
  let cumNeed = 0;
  let finalMonthlyExpenses = currentExpenses;
  let lumpApplied = false;

  for (let m = 1; m <= yearsLeft * 12; m++) {
    const currentAge = age + m / 12;

    // One-time lump-sum event
    if (lumpEvent && lumpEvent.amount !== 0 && !lumpApplied && currentAge >= lumpEvent.atAge) {
      balance += lumpEvent.amount;
      lumpApplied = true;
    }

    // Effective income: base + Social Security if eligible
    let effectiveIncome = monthlyIncome;
    if (socialSecurity && socialSecurity.monthlyAmount > 0 && currentAge >= socialSecurity.startsAtAge) {
      effectiveIncome += socialSecurity.monthlyAmount;
    }

    // Effective expenses: base + healthcare gap if not yet covered
    let effectiveExpenses = currentExpenses;
    if (healthcareGap && healthcareGap.monthlyCost > 0 && currentAge < healthcareGap.coveredUntilAge) {
      effectiveExpenses += healthcareGap.monthlyCost;
    }

    // Only apply investment returns when portfolio has a positive balance
    const returnRate = balance > 0 ? monthlyReturn : 0;
    balance = Math.max(0, balance * (1 + returnRate) - (effectiveExpenses - effectiveIncome));
    cumNeed += effectiveExpenses;
    finalMonthlyExpenses = currentExpenses;
    balances.push(balance);
    needs.push(cumNeed);
    if (balance <= 0 && !depleted) {
      depleted = true;
      depletedAge = currentAge;
    }
    currentExpenses *= (1 + monthlyInflation);
  }

  const finalBalance = balances[balances.length - 1];

  return {
    yearsLeft,
    daysLeft,
    monthlyNet,
    dailyCost,
    dailyGen,
    savingsPerDay,
    depleted,
    depletedAge,
    balances,
    needs,
    finalBalance,
    finalMonthlyExpenses,
  };
}

export { computeRunway };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { computeRunway };
}
