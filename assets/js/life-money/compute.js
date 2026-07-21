/**
 * Pure computation module for Life Financial Runway.
 * No DOM dependencies — safe to unit test.
 */

/**
 * Simulates a monthly balance trajectory given an income schedule.
 * Shared by computeRunway (constant income) and computeCoastToPayCut
 * (phased income), so scenario rules (inflation, Social Security,
 * healthcare gap, lump-sum event) live in exactly one place.
 *
 * @param {Object} params
 * @param {number} params.age              Current age
 * @param {number} params.yearsLeft        Years remaining until life expectancy
 * @param {number} params.savings          Current savings / investments
 * @param {number} params.monthlyExpenses  Monthly expenses needed
 * @param {number} params.annualReturn     Annual investment return (decimal, e.g. 0.07)
 * @param {number} [params.annualInflation=0] Annual inflation rate (decimal, e.g. 0.03)
 * @param {Object|null} [params.socialSecurity=null]  { monthlyAmount, startsAtAge }
 * @param {Object|null} [params.healthcareGap=null]   { monthlyCost, coveredUntilAge }
 * @param {Object|null} [params.lumpEvent=null]       { amount, atAge }
 * @param {function(number, number): number} incomeForMonth  (monthIndex, currentAge) => base monthly income
 * @returns {Object} balances, needs, depleted, depletedAge, finalBalance, finalMonthlyExpenses
 */
function runSimulation({ age, yearsLeft, savings, monthlyExpenses, annualReturn,
                        annualInflation = 0, socialSecurity = null, healthcareGap = null, lumpEvent = null },
                        incomeForMonth) {
  const monthlyReturn = annualReturn / 12;
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

    // Effective income: base (from schedule) + Social Security if eligible
    let effectiveIncome = incomeForMonth(m, currentAge);
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

  return {
    balances,
    needs,
    depleted,
    depletedAge,
    finalBalance: balances[balances.length - 1],
    finalMonthlyExpenses,
  };
}

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
  const dailyGen = (savings * annualReturn) / 365;
  const savingsPerDay = daysLeft > 0 ? savings / daysLeft : 0;

  const sim = runSimulation(
    { age, yearsLeft, savings, monthlyExpenses, annualReturn, annualInflation, socialSecurity, healthcareGap, lumpEvent },
    () => monthlyIncome
  );

  return {
    yearsLeft,
    daysLeft,
    monthlyNet,
    dailyCost,
    dailyGen,
    savingsPerDay,
    depleted: sim.depleted,
    depletedAge: sim.depletedAge,
    balances: sim.balances,
    needs: sim.needs,
    finalBalance: sim.finalBalance,
    finalMonthlyExpenses: sim.finalMonthlyExpenses,
  };
}

/**
 * Determines how many months of continued full income are needed before
 * switching to a reduced ("pay-cut") income while still not depleting the
 * portfolio before age `life`. Reuses the same scenario rules as
 * computeRunway (inflation, Social Security, healthcare gap, lump event).
 *
 * @param {Object} params  Same shape as computeRunway, plus:
 * @param {number} params.payCutIncome  Reduced monthly income after the cut
 * @returns {{achievable: boolean, alreadyAchievable: boolean, monthsUntilPayCut: number|null, ageAtPayCut: number|null}}
 */
function computeCoastToPayCut({ age, life, savings, monthlyExpenses, monthlyIncome, payCutIncome, annualReturn,
                                annualInflation = 0, socialSecurity = null, healthcareGap = null, lumpEvent = null }) {
  const yearsLeft = Math.max(life - age, 0);
  const totalMonths = Math.round(yearsLeft * 12);
  const simParams = { age, yearsLeft, savings, monthlyExpenses, annualReturn, annualInflation, socialSecurity, healthcareGap, lumpEvent };

  const survives = (transitionMonth) => {
    const sim = runSimulation(simParams, (m) => (m <= transitionMonth ? monthlyIncome : payCutIncome));
    return !sim.depleted;
  };

  // Not actually a cut — nothing to coast toward.
  if (payCutIncome >= monthlyIncome) {
    const achievable = survives(0);
    return {
      achievable,
      alreadyAchievable: achievable,
      monthsUntilPayCut: achievable ? 0 : null,
      ageAtPayCut: achievable ? age : null,
    };
  }

  // Even working full income the entire remaining span can't sustain it.
  if (!survives(totalMonths)) {
    return { achievable: false, alreadyAchievable: false, monthsUntilPayCut: null, ageAtPayCut: null };
  }

  // The pay-cut income alone already sustains to life expectancy.
  if (survives(0)) {
    return { achievable: true, alreadyAchievable: true, monthsUntilPayCut: 0, ageAtPayCut: age };
  }

  // Binary search for the minimal transition month (monotonic since payCutIncome < monthlyIncome).
  let lo = 0;
  let hi = totalMonths;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (survives(mid)) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }

  return { achievable: true, alreadyAchievable: false, monthsUntilPayCut: lo, ageAtPayCut: age + lo / 12 };
}

export { computeRunway, computeCoastToPayCut };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { computeRunway, computeCoastToPayCut };
}
