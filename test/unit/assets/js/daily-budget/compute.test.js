const { computeTotals, computeStatus, DAYS_PER_MONTH } = require('../../../../../assets/js/daily-budget/compute.js');
const { CATEGORIES, SCENARIOS } = require('../../../../../assets/js/daily-budget/data.js');

function buildCategoriesFromScenario(scenario) {
  return CATEGORIES.map((cat, i) => ({
    dailyCost: cat.tiers[scenario.tiers[i]].cost,
    daysPerWeek: scenario.days[i],
  }));
}

describe('computeTotals', () => {
  it('computes balanced scenario to approximately $28/day', () => {
    const categories = buildCategoriesFromScenario(SCENARIOS.balanced);
    const result = computeTotals(categories, 0);
    expect(result.dailyAvg).toBeGreaterThan(26);
    expect(result.dailyAvg).toBeLessThan(30);
  });

  it('switching a tier increases total by the expected difference', () => {
    const baseCategories = buildCategoriesFromScenario(SCENARIOS.balanced);
    const baseResult = computeTotals(baseCategories, 0);

    // Switch lunch from tier 1 ($12) to tier 2 ($20), 4 days/week
    const modified = [...baseCategories];
    modified[2] = { dailyCost: 20, daysPerWeek: 4 };
    const modifiedResult = computeTotals(modified, 0);

    const expectedIncrease = (20 - 12) * 4 / 7;
    expect(modifiedResult.dailyAvg - baseResult.dailyAvg).toBeCloseTo(expectedIncrease, 2);
  });

  it('setting daysPerWeek to 0 zeroes out that category', () => {
    const categories = [
      { dailyCost: 10, daysPerWeek: 0 },
      { dailyCost: 5, daysPerWeek: 7 },
    ];
    const result = computeTotals(categories, 0);
    expect(result.dailyAvg).toBeCloseTo(5, 2);
  });

  it('computes weekly as totalDaily * 7', () => {
    const categories = [{ dailyCost: 7, daysPerWeek: 7 }];
    const result = computeTotals(categories, 0);
    expect(result.weekly).toBeCloseTo(49, 2);
  });

  it('computes monthly as totalDaily * 30.44', () => {
    const categories = [{ dailyCost: 10, daysPerWeek: 7 }];
    const result = computeTotals(categories, 0);
    expect(result.monthly).toBeCloseTo(10 * DAYS_PER_MONTH, 2);
  });

  it('computes annual as monthly * 12', () => {
    const categories = [{ dailyCost: 10, daysPerWeek: 7 }];
    const result = computeTotals(categories, 0);
    expect(result.annual).toBeCloseTo(10 * DAYS_PER_MONTH * 12, 2);
  });

  it('includes fixed monthly costs as daily share (÷ 30.44)', () => {
    const categories = [{ dailyCost: 10, daysPerWeek: 7 }];
    const fixedMonthly = 995;
    const result = computeTotals(categories, fixedMonthly);
    expect(result.fixedDaily).toBeCloseTo(995 / DAYS_PER_MONTH, 2);
    expect(result.totalDaily).toBeCloseTo(10 + 995 / DAYS_PER_MONTH, 2);
  });

  it('fixed costs sum correctly from default data', () => {
    const { DEFAULT_FIXED_COSTS } = require('../../../../../assets/js/daily-budget/data.js');
    const totalFixed = DEFAULT_FIXED_COSTS.reduce((sum, item) => sum + item.amount, 0);
    expect(totalFixed).toBe(995);
    const dailyShare = totalFixed / DAYS_PER_MONTH;
    expect(dailyShare).toBeCloseTo(32.69, 1);
  });
});

describe('computeStatus', () => {
  it('returns under when total < target', () => {
    const result = computeStatus(25, 30);
    expect(result.status).toBe('under');
    expect(result.difference).toBeCloseTo(5, 2);
  });

  it('returns over when total > target', () => {
    const result = computeStatus(35, 30);
    expect(result.status).toBe('over');
    expect(result.difference).toBeCloseTo(-5, 2);
  });

  it('returns on-target when total equals target', () => {
    const result = computeStatus(30, 30);
    expect(result.status).toBe('on-target');
  });

  it('computes percent of target', () => {
    const result = computeStatus(15, 30);
    expect(result.percent).toBeCloseTo(50, 2);
  });
});
