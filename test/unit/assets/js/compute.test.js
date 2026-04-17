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
});
