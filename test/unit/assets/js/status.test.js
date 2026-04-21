const { generateStatusMessage } = require('../../../../assets/js/life-money/status.js');

describe('generateStatusMessage', () => {
  const baseGood = {
    depleted: false,
    depletedAge: null,
    finalBalance: 500000,
    dailyGen: 95.89,
    dailyCost: 131.40,
    gap: { amount: 1500, isSurplus: false },
    monthlyIncome: 2500,
    monthlyReturn: 0.005,
    annualInflation: 0,
    finalMonthlyExpenses: 4000,
    monthlyExpenses: 4000,
    life: 90,
    savings: 500000,
    socialSecurity: null,
    healthcareGap: null,
    lumpEvent: null,
  };

  const baseBad = {
    ...baseGood,
    depleted: true,
    depletedAge: 75,
    finalBalance: 0,
  };

  it('returns html property', () => {
    const result = generateStatusMessage(baseGood);
    expect(result).toHaveProperty('html');
    expect(typeof result.html).toBe('string');
  });

  it('reports portfolio outlasts when not depleted', () => {
    const { html } = generateStatusMessage(baseGood);
    expect(html).toContain('outlasts you');
  });

  it('reports depletion age when depleted', () => {
    const { html } = generateStatusMessage(baseBad);
    expect(html).toContain('age 75');
    expect(html).toContain('years short');
  });

  it('mentions income when present', () => {
    const { html } = generateStatusMessage(baseGood);
    expect(html).toContain('income is doing heavy lifting');
  });

  it('omits income note when zero', () => {
    const { html } = generateStatusMessage({ ...baseGood, monthlyIncome: 0 });
    expect(html).not.toContain('income is doing heavy lifting');
  });

  it('mentions inflation when present', () => {
    const { html } = generateStatusMessage({ ...baseGood, annualInflation: 0.03, finalMonthlyExpenses: 6000 });
    expect(html).toContain('3.0% annual inflation');
  });

  it('omits inflation note when zero', () => {
    const { html } = generateStatusMessage(baseGood);
    expect(html).not.toContain('annual inflation');
  });

  it('appends social security note', () => {
    const { html } = generateStatusMessage({ ...baseGood, socialSecurity: { monthlyAmount: 2000, startsAtAge: 67 } });
    expect(html).toContain('Social Security adds $2,000/mo starting at age 67');
  });

  it('appends healthcare gap note', () => {
    const { html } = generateStatusMessage({ ...baseGood, healthcareGap: { monthlyCost: 1500, coveredUntilAge: 65 } });
    expect(html).toContain('Healthcare gap costs $1,500/mo until age 65');
  });

  it('appends positive lump event note as windfall', () => {
    const { html } = generateStatusMessage({ ...baseGood, lumpEvent: { amount: 50000, atAge: 50 } });
    expect(html).toContain('One-time windfall of $50,000 at age 50');
  });

  it('appends negative lump event note as expense', () => {
    const { html } = generateStatusMessage({ ...baseGood, lumpEvent: { amount: -30000, atAge: 55 } });
    expect(html).toContain('One-time expense of $30,000 at age 55');
  });

  it('omits advanced notes when all null', () => {
    const { html } = generateStatusMessage(baseGood);
    expect(html).not.toContain('Social Security');
    expect(html).not.toContain('Healthcare gap');
    expect(html).not.toContain('One-time');
  });
});
