const { computeRunway } = require('../../../../assets/js/life-money/compute.js');

describe('computeRunway', () => {
  const base = {
    age: 40,
    life: 90,
    savings: 500000,
    monthlyExpenses: 4000,
    monthlyIncome: 0,
    annualReturn: 0.07,
  };

  it('calculates years left correctly', () => {
    const result = computeRunway(base);
    expect(result.yearsLeft).toBe(50);
  });

  it('calculates days left correctly', () => {
    const result = computeRunway(base);
    expect(result.daysLeft).toBe(Math.round(50 * 365.25));
  });

  it('calculates daily cost correctly', () => {
    const result = computeRunway(base);
    expect(result.dailyCost).toBeCloseTo(4000 / 30.44, 4);
  });

  it('calculates daily generation correctly', () => {
    const result = computeRunway(base);
    expect(result.dailyGen).toBeCloseTo((500000 * 0.07) / 365, 4);
  });

  it('returns monthlyNet as expenses minus income', () => {
    const result = computeRunway({ ...base, monthlyIncome: 2000 });
    expect(result.monthlyNet).toBe(4000 - 2000);
  });

  it('initialises balances array with savings as first entry', () => {
    const result = computeRunway(base);
    expect(result.balances[0]).toBe(500000);
  });

  it('initialises needs array with 0 as first entry', () => {
    const result = computeRunway(base);
    expect(result.needs[0]).toBe(0);
  });

  it('balances length equals yearsLeft * 12 + 1', () => {
    const result = computeRunway(base);
    expect(result.balances.length).toBe(50 * 12 + 1);
  });

  it('returns depleted=false when portfolio survives', () => {
    const result = computeRunway({ ...base, savings: 3000000, monthlyExpenses: 3000, annualReturn: 0.07 });
    expect(result.depleted).toBe(false);
    expect(result.depletedAge).toBeNull();
  });

  it('returns depleted=true when portfolio runs out', () => {
    const result = computeRunway({ age: 40, life: 90, savings: 50000, monthlyExpenses: 5000, monthlyIncome: 0, annualReturn: 0.03 });
    expect(result.depleted).toBe(true);
    expect(result.depletedAge).toBeGreaterThan(40);
    expect(result.depletedAge).toBeLessThan(90);
  });

  it('depletedAge is within expected range when depleted', () => {
    const result = computeRunway({ age: 40, life: 90, savings: 50000, monthlyExpenses: 5000, monthlyIncome: 0, annualReturn: 0.03 });
    expect(result.depletedAge).toBeGreaterThan(40);
    expect(result.depletedAge).toBeLessThan(90);
  });

  it('balances are never negative (floored at 0)', () => {
    const result = computeRunway({ age: 40, life: 90, savings: 50000, monthlyExpenses: 5000, monthlyIncome: 0, annualReturn: 0.03 });
    expect(result.balances.every(b => b >= 0)).toBe(true);
  });

  it('does not apply investment returns to a depleted (zero) balance', () => {
    // Portfolio depletes quickly, then a large lump sum arrives.
    // Without the fix, negative compounding would create a deeper hole
    // that the lump sum can't overcome. With the fix, balance stays 0
    // until the lump event restores it.
    const result = computeRunway({
      age: 40, life: 90, savings: 10000, monthlyExpenses: 5000,
      monthlyIncome: 0, annualReturn: 0.07,
      lumpEvent: { amount: 500000, atAge: 50 },
    });
    // Portfolio should deplete early (~42), then recover at 50 with the lump
    expect(result.depleted).toBe(true);
    expect(result.depletedAge).toBeLessThan(43);
    // After lump at 50 (month 120), balance should be > 0
    expect(result.balances[121]).toBeGreaterThan(0);
  });

  it('yearsLeft is 0 when age >= life', () => {
    const result = computeRunway({ ...base, age: 95, life: 90 });
    expect(result.yearsLeft).toBe(0);
    expect(result.daysLeft).toBe(0);
  });

  it('income reduces monthly net correctly', () => {
    const noIncome = computeRunway({ ...base, monthlyIncome: 0 });
    const withIncome = computeRunway({ ...base, monthlyIncome: 4000 });
    expect(withIncome.finalBalance).toBeGreaterThan(noIncome.finalBalance);
  });

  it('finalBalance matches last entry of balances', () => {
    const result = computeRunway(base);
    expect(result.finalBalance).toBe(result.balances[result.balances.length - 1]);
  });

  it('returns savingsPerDay', () => {
    const result = computeRunway(base);
    expect(result.savingsPerDay).toBeCloseTo(500000 / result.daysLeft, 4);
  });

  it('returns finalMonthlyExpenses', () => {
    const result = computeRunway(base);
    // With no inflation, final expenses equal starting expenses
    expect(result.finalMonthlyExpenses).toBe(4000);
  });
});

describe('computeRunway — inflation', () => {
  const base = {
    age: 40,
    life: 90,
    savings: 500000,
    monthlyExpenses: 4000,
    monthlyIncome: 0,
    annualReturn: 0.07,
    annualInflation: 0.03,
  };

  it('inflation causes earlier depletion than no inflation', () => {
    const withInflation = computeRunway(base);
    const noInflation = computeRunway({ ...base, annualInflation: 0 });
    // With inflation, either depletes sooner or ends with less
    if (withInflation.depleted && noInflation.depleted) {
      expect(withInflation.depletedAge).toBeLessThan(noInflation.depletedAge);
    } else {
      expect(withInflation.finalBalance).toBeLessThan(noInflation.finalBalance);
    }
  });

  it('finalMonthlyExpenses grows with inflation', () => {
    const result = computeRunway(base);
    expect(result.finalMonthlyExpenses).toBeGreaterThan(4000);
  });

  it('cumulative needs are higher with inflation', () => {
    const withInflation = computeRunway(base);
    const noInflation = computeRunway({ ...base, annualInflation: 0 });
    const lastNeedInflation = withInflation.needs[withInflation.needs.length - 1];
    const lastNeedFlat = noInflation.needs[noInflation.needs.length - 1];
    expect(lastNeedInflation).toBeGreaterThan(lastNeedFlat);
  });
});

describe('computeRunway — social security', () => {
  const base = {
    age: 60,
    life: 90,
    savings: 800000,
    monthlyExpenses: 4000,
    monthlyIncome: 0,
    annualReturn: 0.05,
    annualInflation: 0,
  };

  it('social security income improves final balance', () => {
    const withSS = computeRunway({ ...base, socialSecurity: { monthlyAmount: 2000, startsAtAge: 67 } });
    const withoutSS = computeRunway(base);
    expect(withSS.finalBalance).toBeGreaterThan(withoutSS.finalBalance);
  });

  it('social security does not apply before startsAtAge', () => {
    // With SS starting at 67, first 7 years (84 months) have no SS
    const result = computeRunway({ ...base, socialSecurity: { monthlyAmount: 2000, startsAtAge: 67 } });
    // Balance at month 84 should be lower than if SS applied from the start
    const ssFromStart = computeRunway({ ...base, monthlyIncome: 2000 });
    // At month 84 (before SS kicks in for the first scenario), the from-start should be higher
    expect(ssFromStart.balances[84]).toBeGreaterThan(result.balances[84]);
  });

  it('social security can prevent depletion', () => {
    const withoutSS = computeRunway({ ...base, savings: 300000, monthlyExpenses: 5000 });
    const withSS = computeRunway({ ...base, savings: 300000, monthlyExpenses: 5000, socialSecurity: { monthlyAmount: 5000, startsAtAge: 62 } });
    expect(withoutSS.depleted).toBe(true);
    expect(withSS.depleted).toBe(false);
  });
});

describe('computeRunway — healthcare gap', () => {
  const base = {
    age: 55,
    life: 90,
    savings: 1000000,
    monthlyExpenses: 4000,
    monthlyIncome: 0,
    annualReturn: 0.06,
    annualInflation: 0,
  };

  it('healthcare gap adds cost before coveredUntilAge', () => {
    const withHC = computeRunway({ ...base, healthcareGap: { monthlyCost: 1500, coveredUntilAge: 65 } });
    const withoutHC = computeRunway(base);
    expect(withHC.finalBalance).toBeLessThan(withoutHC.finalBalance);
  });

  it('healthcare gap stops after coveredUntilAge', () => {
    // If coveredUntilAge is already past (age 55, covered until 54), no effect
    const noEffect = computeRunway({ ...base, healthcareGap: { monthlyCost: 1500, coveredUntilAge: 54 } });
    const withoutHC = computeRunway(base);
    expect(noEffect.finalBalance).toBe(withoutHC.finalBalance);
  });

  it('higher healthcare cost causes earlier depletion', () => {
    const low = computeRunway({ ...base, savings: 200000, healthcareGap: { monthlyCost: 500, coveredUntilAge: 65 } });
    const high = computeRunway({ ...base, savings: 200000, healthcareGap: { monthlyCost: 2500, coveredUntilAge: 65 } });
    if (low.depleted && high.depleted) {
      expect(high.depletedAge).toBeLessThan(low.depletedAge);
    } else {
      expect(high.finalBalance).toBeLessThan(low.finalBalance);
    }
  });
});

describe('computeRunway — lump-sum event', () => {
  const base = {
    age: 45,
    life: 90,
    savings: 800000,
    monthlyExpenses: 4000,
    monthlyIncome: 0,
    annualReturn: 0.06,
    annualInflation: 0,
  };

  it('positive lump sum increases final balance', () => {
    const withLump = computeRunway({ ...base, lumpEvent: { amount: 100000, atAge: 46 } });
    const withoutLump = computeRunway(base);
    expect(withLump.finalBalance).toBeGreaterThan(withoutLump.finalBalance);
  });

  it('negative lump sum decreases final balance', () => {
    const withLump = computeRunway({ ...base, lumpEvent: { amount: -50000, atAge: 50 } });
    const withoutLump = computeRunway(base);
    expect(withLump.finalBalance).toBeLessThan(withoutLump.finalBalance);
  });

  it('lump sum is applied only once', () => {
    const result = computeRunway({ ...base, lumpEvent: { amount: 100000, atAge: 46 } });
    // The jump should appear at month 12 (age 46) and not again
    const jumpMonth = 12; // age 45 + 12/12 = 46
    const balanceBefore = result.balances[jumpMonth - 1];
    const balanceAt = result.balances[jumpMonth];
    // After the lump is added, the next month should not have another jump
    const balanceAfter = result.balances[jumpMonth + 1];
    const firstDiff = balanceAt - balanceBefore;
    const secondDiff = balanceAfter - balanceAt;
    // The first diff includes the 100k lump; the second should be much smaller
    expect(firstDiff).toBeGreaterThan(secondDiff + 50000);
  });

  it('lump sum at atAge equal to current age applies in first month', () => {
    const result = computeRunway({ ...base, lumpEvent: { amount: 50000, atAge: 45 } });
    const withoutLump = computeRunway(base);
    // Balance at month 1 should reflect the lump
    expect(result.balances[1]).toBeGreaterThan(withoutLump.balances[1]);
  });
});

describe('computeRunway — combined scenarios', () => {
  it('all features together produce a valid result', () => {
    const result = computeRunway({
      age: 50,
      life: 90,
      savings: 400000,
      monthlyExpenses: 5000,
      monthlyIncome: 2000,
      annualReturn: 0.06,
      annualInflation: 0.03,
      socialSecurity: { monthlyAmount: 2500, startsAtAge: 67 },
      healthcareGap: { monthlyCost: 1200, coveredUntilAge: 65 },
      lumpEvent: { amount: 75000, atAge: 51 },
    });
    expect(result.yearsLeft).toBe(40);
    expect(result.balances.length).toBe(40 * 12 + 1);
    expect(result.balances[0]).toBe(400000);
    expect(result.finalBalance).toBeGreaterThanOrEqual(0);
    expect(result.finalMonthlyExpenses).toBeGreaterThan(5000); // inflation grew it
  });
});
