/**
 * Pure computation module for Life Financial Runway.
 * No DOM dependencies — safe to unit test.
 */

/**
 * Age at which retirement savings (401k/IRA) become accessible without an
 * early-withdrawal penalty. Modeled as a hard block: retirement savings
 * cannot fund a shortfall before this age, no matter the balance.
 */
const RETIREMENT_ACCESS_AGE = 59.5;

/**
 * Simulates a monthly balance trajectory given an income schedule.
 * Shared by computeRunway (constant income) and computeCoastToPayCut
 * (phased income), so scenario rules (inflation, Social Security,
 * healthcare gap, lump-sum event, retirement-savings hard block) live in
 * exactly one place.
 *
 * Two balances are tracked: brokerage/other (liquid, always accessible) and
 * retirement (401k/IRA, only usable to cover a shortfall once the simulated
 * age reaches RETIREMENT_ACCESS_AGE). Both grow at the same annualReturn.
 *
 * @param {Object} params
 * @param {number} params.age              Current age
 * @param {number} params.yearsLeft        Years remaining until life expectancy
 * @param {number} params.savings          Current brokerage/other (liquid) savings
 * @param {number} [params.retirementSavings=0] Current 401k/IRA savings (locked until RETIREMENT_ACCESS_AGE)
 * @param {number} params.monthlyExpenses  Monthly expenses needed
 * @param {number} params.annualReturn     Annual investment return (decimal, e.g. 0.07)
 * @param {number} [params.annualInflation=0] Annual inflation rate (decimal, e.g. 0.03)
 * @param {Object|null} [params.socialSecurity=null]  { monthlyAmount, startsAtAge }
 * @param {Object|null} [params.healthcareGap=null]   { monthlyCost, coveredUntilAge }
 * @param {Object|null} [params.lumpEvent=null]       { amount, atAge }
 * @param {function(number, number): number} incomeForMonth  (monthIndex, currentAge) => base monthly income.
 *   monthIndex is 1-based (the first simulated month is 1, matching the internal loop counter).
 * @returns {Object} balances, brokerageBalances, retirementBalances, accessibleBalances,
 *   needs, depleted, depletedAge, brokerageDepletedAge, finalBalance,
 *   finalBrokerageBalance, finalRetirementBalance, finalMonthlyExpenses.
 *   accessibleBalances is the series `depleted`/`depletedAge` are derived from
 *   (brokerage + retirement only once accessible); it can be 0 while the
 *   combined `balances` value is still positive if retirement is locked.
 */
function runSimulation({ age, yearsLeft, savings, retirementSavings = 0, monthlyExpenses, annualReturn,
                        annualInflation = 0, socialSecurity = null, healthcareGap = null, lumpEvent = null },
                        incomeForMonth) {
  const monthlyReturn = annualReturn / 12;
  const monthlyInflation = Math.pow(1 + annualInflation, 1 / 12) - 1;
  let currentExpenses = monthlyExpenses;

  let brokerageBalance = savings;
  let retirementBalance = retirementSavings;
  let depleted = false;
  let depletedAge = null;
  let brokerageDepleted = false;
  let brokerageDepletedAge = null;
  const balances = [brokerageBalance + retirementBalance];
  const brokerageBalances = [brokerageBalance];
  const retirementBalances = [retirementBalance];
  const accessibleBalances = [brokerageBalance + retirementBalance];
  const needs = [0];
  let cumNeed = 0;
  let finalMonthlyExpenses = currentExpenses;
  let lumpApplied = false;

  for (let m = 1; m <= yearsLeft * 12; m++) {
    const currentAge = age + m / 12;
    const canAccessRetirement = currentAge >= RETIREMENT_ACCESS_AGE;

    // One-time lump-sum event (applied to the liquid/brokerage balance)
    if (lumpEvent && lumpEvent.amount !== 0 && !lumpApplied && currentAge >= lumpEvent.atAge) {
      brokerageBalance += lumpEvent.amount;
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

    const netNeed = effectiveExpenses - effectiveIncome;

    // Grow each balance independently, only when it's currently positive.
    const brokerageReturnRate = brokerageBalance > 0 ? monthlyReturn : 0;
    const retirementReturnRate = retirementBalance > 0 ? monthlyReturn : 0;
    brokerageBalance = brokerageBalance * (1 + brokerageReturnRate) - netNeed;
    retirementBalance = retirementBalance * (1 + retirementReturnRate);

    // Hard block: only once retirement savings are accessible can they
    // absorb a brokerage shortfall. Before that age, any deficit is simply
    // unmet (matches the original floor-at-0 depletion behavior).
    if (brokerageBalance < 0 && canAccessRetirement) {
      retirementBalance += brokerageBalance;
      brokerageBalance = 0;
    }
    brokerageBalance = Math.max(0, brokerageBalance);
    retirementBalance = Math.max(0, retirementBalance);

    cumNeed += effectiveExpenses;
    finalMonthlyExpenses = currentExpenses;
    const accessibleBalance = brokerageBalance + (canAccessRetirement ? retirementBalance : 0);
    balances.push(brokerageBalance + retirementBalance);
    brokerageBalances.push(brokerageBalance);
    retirementBalances.push(retirementBalance);
    accessibleBalances.push(accessibleBalance);
    needs.push(cumNeed);

    if (accessibleBalance <= 0 && !depleted) {
      depleted = true;
      depletedAge = currentAge;
    }
    // Tracks the liquid/brokerage balance alone, independent of whether the
    // combined (accessible) portfolio is considered depleted. A large
    // retirement balance can keep the overall portfolio healthy even after
    // brokerage/other savings run out.
    if (brokerageBalance <= 0 && !brokerageDepleted) {
      brokerageDepleted = true;
      brokerageDepletedAge = currentAge;
    }
    currentExpenses *= (1 + monthlyInflation);
  }

  return {
    balances,
    brokerageBalances,
    retirementBalances,
    accessibleBalances,
    needs,
    depleted,
    depletedAge,
    brokerageDepletedAge,
    finalBalance: balances[balances.length - 1],
    finalBrokerageBalance: brokerageBalances[brokerageBalances.length - 1],
    finalRetirementBalance: retirementBalances[retirementBalances.length - 1],
    finalMonthlyExpenses,
  };
}

/**
 * @param {Object} params
 * @param {number} params.age              Current age
 * @param {number} params.life             Expected age at death
 * @param {number} params.savings          Current brokerage/other (liquid) savings
 * @param {number} [params.retirementSavings=0] Current 401k/IRA savings (locked until RETIREMENT_ACCESS_AGE)
 * @param {number} params.monthlyExpenses  Monthly expenses needed
 * @param {number} params.monthlyIncome    Monthly income
 * @param {number} params.annualReturn     Annual investment return (decimal, e.g. 0.07)
 * @param {number} [params.annualInflation=0] Annual inflation rate (decimal, e.g. 0.03)
 * @param {Object|null} [params.socialSecurity=null]  { monthlyAmount, startsAtAge }
 * @param {Object|null} [params.healthcareGap=null]   { monthlyCost, coveredUntilAge }
 * @param {Object|null} [params.lumpEvent=null]       { amount, atAge }
 * @returns {Object} Computed runway data
 */
function computeRunway({ age, life, savings, retirementSavings = 0, monthlyExpenses, monthlyIncome, annualReturn,
                         annualInflation = 0, socialSecurity = null, healthcareGap = null, lumpEvent = null }) {
  const yearsLeft = Math.max(life - age, 0);
  const daysLeft = Math.round(yearsLeft * 365.25);
  const monthlyNet = monthlyExpenses - monthlyIncome;
  const dailyCost = monthlyExpenses / 30.44;
  const totalSavings = savings + retirementSavings;
  const dailyGen = (totalSavings * annualReturn) / 365;
  const savingsPerDay = daysLeft > 0 ? totalSavings / daysLeft : 0;

  const sim = runSimulation(
    { age, yearsLeft, savings, retirementSavings, monthlyExpenses, annualReturn, annualInflation, socialSecurity, healthcareGap, lumpEvent },
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
    brokerageDepletedAge: sim.brokerageDepletedAge,
    balances: sim.balances,
    brokerageBalances: sim.brokerageBalances,
    retirementBalances: sim.retirementBalances,
    accessibleBalances: sim.accessibleBalances,
    needs: sim.needs,
    finalBalance: sim.finalBalance,
    finalBrokerageBalance: sim.finalBrokerageBalance,
    finalRetirementBalance: sim.finalRetirementBalance,
    finalMonthlyExpenses: sim.finalMonthlyExpenses,
  };
}

/**
 * Determines how many months of continued full income are needed before
 * switching to a reduced ("pay-cut") income while still not depleting the
 * portfolio before age `life`. Reuses the same scenario rules as
 * computeRunway (inflation, Social Security, healthcare gap, lump event,
 * and the retirement-savings hard block: 401k/IRA funds cannot be drawn on
 * before RETIREMENT_ACCESS_AGE, regardless of balance).
 *
 * @param {Object} params  Same shape as computeRunway, plus:
 * @param {number} params.payCutIncome  Reduced monthly income after the cut
 * @returns {{achievable: boolean, alreadyAchievable: boolean, monthsUntilPayCut: number|null, ageAtPayCut: number|null}}
 */
function computeCoastToPayCut({ age, life, savings, retirementSavings = 0, monthlyExpenses, monthlyIncome, payCutIncome, annualReturn,
                                annualInflation = 0, socialSecurity = null, healthcareGap = null, lumpEvent = null }) {
  const yearsLeft = Math.max(life - age, 0);
  // Match runSimulation's loop bound (`m <= yearsLeft * 12`), which behaves like Math.floor
  // for fractional yearsLeft, so monthsUntilPayCut/ageAtPayCut stay consistent with it.
  const totalMonths = Math.floor(yearsLeft * 12);
  const simParams = { age, yearsLeft, savings, retirementSavings, monthlyExpenses, annualReturn, annualInflation, socialSecurity, healthcareGap, lumpEvent };

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
