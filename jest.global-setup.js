'use strict';
/**
 * Jest globalSetup — runs once before test discovery.
 * Creates directories and test files needed for the life-money module.
 */
const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

module.exports = async function () {
  const root = __dirname;
  const srcDir = path.join(root, 'assets', 'js', 'life-money');
  const testDir = path.join(root, 'test', 'unit', 'assets', 'js', 'life-money');

  ensureDir(srcDir);
  ensureDir(testDir);

  // ── compute.test.js ──────────────────────────────────────────────────────
  const computeTest = `const { computeRunway } = require('../../../../../assets/js/life-money/compute.js');

describe('computeRunway', () => {
  const base = {
    age: 43,
    life: 95,
    savings: 675000,
    monthlyExpenses: 5954,
    monthlyIncome: 0,
    annualReturn: 0.07,
  };

  it('calculates years left correctly', () => {
    const result = computeRunway(base);
    expect(result.yearsLeft).toBe(52);
  });

  it('calculates days left correctly', () => {
    const result = computeRunway(base);
    expect(result.daysLeft).toBe(Math.round(52 * 365.25));
  });

  it('calculates daily cost correctly', () => {
    const result = computeRunway(base);
    expect(result.dailyCost).toBeCloseTo(5954 / 30.44, 4);
  });

  it('calculates daily generation correctly', () => {
    const result = computeRunway(base);
    expect(result.dailyGen).toBeCloseTo((675000 * 0.07) / 365, 4);
  });

  it('returns monthlyNet as expenses minus income', () => {
    const result = computeRunway({ ...base, monthlyIncome: 2000 });
    expect(result.monthlyNet).toBe(5954 - 2000);
  });

  it('initialises balances array with savings as first entry', () => {
    const result = computeRunway(base);
    expect(result.balances[0]).toBe(675000);
  });

  it('initialises needs array with 0 as first entry', () => {
    const result = computeRunway(base);
    expect(result.needs[0]).toBe(0);
  });

  it('balances length equals yearsLeft * 12 + 1', () => {
    const result = computeRunway(base);
    expect(result.balances.length).toBe(52 * 12 + 1);
  });

  it('returns depleted=false when portfolio survives', () => {
    const result = computeRunway({ ...base, savings: 3000000, monthlyExpenses: 3000, annualReturn: 0.07 });
    expect(result.depleted).toBe(false);
    expect(result.depletedAge).toBeNull();
  });

  it('returns depleted=true when portfolio runs out', () => {
    const result = computeRunway({ age: 43, life: 95, savings: 50000, monthlyExpenses: 5000, monthlyIncome: 0, annualReturn: 0.03 });
    expect(result.depleted).toBe(true);
    expect(result.depletedAge).toBeGreaterThan(43);
    expect(result.depletedAge).toBeLessThan(95);
  });

  it('depletedAge is within expected range when depleted', () => {
    const result = computeRunway({ age: 43, life: 95, savings: 50000, monthlyExpenses: 5000, monthlyIncome: 0, annualReturn: 0.03 });
    expect(result.depletedAge).toBeGreaterThan(43);
    expect(result.depletedAge).toBeLessThan(95);
  });

  it('balances are never negative (floored at 0)', () => {
    const result = computeRunway({ age: 43, life: 95, savings: 50000, monthlyExpenses: 5000, monthlyIncome: 0, annualReturn: 0.03 });
    expect(result.balances.every(b => b >= 0)).toBe(true);
  });

  it('yearsLeft is 0 when age >= life', () => {
    const result = computeRunway({ ...base, age: 95, life: 90 });
    expect(result.yearsLeft).toBe(0);
    expect(result.daysLeft).toBe(0);
  });

  it('income reduces monthly net correctly', () => {
    const noIncome = computeRunway({ ...base, monthlyIncome: 0 });
    const withIncome = computeRunway({ ...base, monthlyIncome: 5954 });
    expect(withIncome.finalBalance).toBeGreaterThan(noIncome.finalBalance);
  });

  it('finalBalance matches last entry of balances', () => {
    const result = computeRunway(base);
    expect(result.finalBalance).toBe(result.balances[result.balances.length - 1]);
  });
});
`;

  // ── chart.test.js ─────────────────────────────────────────────────────────
  const chartTest = `/**
 * @jest-environment jsdom
 */

const { drawChart } = require('../../../../../assets/js/life-money/chart.js');

function makeCanvas() {
  const canvas = document.createElement('canvas');
  const calls = [];
  const ctx = {
    scale: jest.fn(),
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    fill: jest.fn(),
    closePath: jest.fn(),
    fillText: jest.fn(),
    setLineDash: jest.fn(),
    createLinearGradient: jest.fn(() => ({
      addColorStop: jest.fn(),
    })),
    strokeStyle: '',
    fillStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: '',
  };
  canvas.getContext = jest.fn(() => ctx);
  canvas.parentElement = { clientWidth: 648 };
  canvas.style = {};
  return { canvas, ctx };
}

function makeData(overrides = {}) {
  const yearsLeft = 52;
  const months = yearsLeft * 12;
  const balances = Array.from({ length: months + 1 }, (_, i) => Math.max(675000 - i * 100, 0));
  const needs = Array.from({ length: months + 1 }, (_, i) => i * 5954);
  return {
    age: 43,
    life: 95,
    yearsLeft,
    balances,
    needs,
    savings: 675000,
    depleted: false,
    ...overrides,
  };
}

describe('drawChart', () => {
  it('calls getContext with "2d"', () => {
    const { canvas } = makeCanvas();
    drawChart(canvas, makeData());
    expect(canvas.getContext).toHaveBeenCalledWith('2d');
  });

  it('sets canvas width and height', () => {
    const { canvas } = makeCanvas();
    drawChart(canvas, makeData());
    expect(canvas.width).toBeGreaterThan(0);
    expect(canvas.height).toBeGreaterThan(0);
  });

  it('calls clearRect to reset the canvas', () => {
    const { canvas, ctx } = makeCanvas();
    drawChart(canvas, makeData());
    expect(ctx.clearRect).toHaveBeenCalled();
  });

  it('calls scale for device pixel ratio', () => {
    const { canvas, ctx } = makeCanvas();
    drawChart(canvas, makeData());
    expect(ctx.scale).toHaveBeenCalled();
  });

  it('draws grid lines (beginPath called multiple times)', () => {
    const { canvas, ctx } = makeCanvas();
    drawChart(canvas, makeData());
    expect(ctx.beginPath.mock.calls.length).toBeGreaterThan(2);
  });

  it('does not draw depletion marker when not depleted', () => {
    const { canvas, ctx } = makeCanvas();
    drawChart(canvas, makeData({ depleted: false }));
    const fillTextCalls = ctx.fillText.mock.calls.map(c => c[0]);
    expect(fillTextCalls).not.toContain('depleted');
  });

  it('draws depletion marker when depleted', () => {
    const { canvas, ctx } = makeCanvas();
    const yearsLeft = 10;
    const months = yearsLeft * 12;
    const balances = Array.from({ length: months + 1 }, (_, i) => (i < 5 ? 10000 - i * 2001 : 0));
    const needs = Array.from({ length: months + 1 }, (_, i) => i * 5000);
    drawChart(canvas, makeData({ depleted: true, yearsLeft, balances, needs }));
    const fillTextCalls = ctx.fillText.mock.calls.map(c => c[0]);
    expect(fillTextCalls).toContain('depleted');
  });

  it('creates a linear gradient for the fill', () => {
    const { canvas, ctx } = makeCanvas();
    drawChart(canvas, makeData());
    expect(ctx.createLinearGradient).toHaveBeenCalled();
  });

  it('calls stroke at least once (draws lines)', () => {
    const { canvas, ctx } = makeCanvas();
    drawChart(canvas, makeData());
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it('handles single data point without throwing', () => {
    const { canvas } = makeCanvas();
    expect(() =>
      drawChart(canvas, { age: 43, life: 43, yearsLeft: 0, balances: [675000], needs: [0], savings: 675000, depleted: false })
    ).not.toThrow();
  });
});
`;

  fs.writeFileSync(path.join(testDir, 'compute.test.js'), computeTest);
  fs.writeFileSync(path.join(testDir, 'chart.test.js'), chartTest);
  console.log('[globalSetup] life-money test files written to', testDir);
};

// Allow running directly: `node jest.global-setup.js`
if (require.main === module) {
  module.exports().catch(err => { console.error(err); process.exit(1); });
}
