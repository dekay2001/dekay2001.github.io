/**
 * Pure computation module for Life Financial Runway.
 * No DOM dependencies — safe to unit test.
 */

/**
 * @param {Object} params
 * @param {number} params.age            Current age
 * @param {number} params.life           Expected age at death
 * @param {number} params.savings        Current savings / investments
 * @param {number} params.monthlyExpenses Monthly expenses needed
 * @param {number} params.monthlyIncome  Monthly income
 * @param {number} params.annualReturn   Annual investment return (decimal, e.g. 0.07)
 * @returns {Object} Computed runway data
 */
function computeRunway({ age, life, savings, monthlyExpenses, monthlyIncome, annualReturn }) {
  const yearsLeft = Math.max(life - age, 0);
  const daysLeft = Math.round(yearsLeft * 365.25);
  const monthlyNet = monthlyExpenses - monthlyIncome;
  const dailyCost = monthlyExpenses / 30.44;
  const monthlyReturn = annualReturn / 12;
  const dailyGen = (savings * annualReturn) / 365;

  let balance = savings;
  let depleted = false;
  let depletedAge = null;
  const balances = [balance];
  const needs = [0];
  let cumNeed = 0;

  for (let m = 1; m <= yearsLeft * 12; m++) {
    balance = balance * (1 + monthlyReturn) - monthlyNet;
    cumNeed += monthlyExpenses;
    balances.push(Math.max(balance, 0));
    needs.push(cumNeed);
    if (balance <= 0 && !depleted) {
      depleted = true;
      depletedAge = age + m / 12;
    }
  }

  const finalBalance = balances[balances.length - 1];

  return {
    yearsLeft,
    daysLeft,
    monthlyNet,
    dailyCost,
    dailyGen,
    depleted,
    depletedAge,
    balances,
    needs,
    finalBalance,
  };
}

module.exports = { computeRunway };
