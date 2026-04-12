#!/usr/bin/env node

/**
 * Manual test runner since we can't use npm directly
 * This script sets up the structure and runs tests
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

try {
  // Setup directories and files
  console.log('Setting up life-money module structure...');
  
  const baseDir = path.join(__dirname, 'assets/js/life-money');
  ensureDir(baseDir);
  
  const testDir = path.join(__dirname, 'test/unit/assets/js/life-money');
  ensureDir(testDir);
  
  // Create compute.js
  const computeCode = `/**
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
`;
  fs.writeFileSync(path.join(baseDir, 'compute.js'), computeCode);
  console.log('✓ Created compute.js');
  
  // Create chart.js
  const chartCode = `/**
 * Chart drawing module for Life Financial Runway.
 * Accepts a canvas element and data, draws the portfolio chart.
 */

function drawChart(canvas, { age, life, yearsLeft, balances, needs, savings, depleted }) {
  const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
  const W = canvas.parentElement ? canvas.parentElement.clientWidth - 48 : 600;
  const H = 280;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const pad = { top: 20, right: 20, bottom: 40, left: 70 };
  const w = W - pad.left - pad.right;
  const h = H - pad.top - pad.bottom;

  ctx.clearRect(0, 0, W, H);

  const maxVal = Math.max(...balances, ...needs, savings * 2);
  const points = balances.length;

  const xScale = i => pad.left + (i / (points - 1)) * w;
  const yScale = v => pad.top + h - (Math.max(v, 0) / maxVal) * h;

  // Grid
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (i / 4) * h;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + w, y);
    ctx.stroke();
    const val = maxVal * (1 - i / 4);
    ctx.fillStyle = '#444';
    ctx.font = '10px DM Mono, monospace';
    ctx.textAlign = 'right';
    ctx.fillText('$' + Math.round(val / 1000) + 'k', pad.left - 8, y + 4);
  }

  // X axis labels
  ctx.fillStyle = '#444';
  ctx.font = '10px DM Mono, monospace';
  ctx.textAlign = 'center';
  const labelCount = Math.min(yearsLeft, 8);
  for (let i = 0; i <= labelCount; i++) {
    const yearIdx = Math.round((i / labelCount) * (points - 1));
    const x = xScale(yearIdx);
    const labelAge = age + Math.round((yearIdx / (points - 1)) * yearsLeft);
    ctx.fillText('Age ' + labelAge, x, H - 8);
  }

  // Cumulative need line
  ctx.beginPath();
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  for (let i = 0; i < points; i++) {
    const x = xScale(i);
    const y = yScale(needs[i]);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Portfolio balance line
  ctx.beginPath();
  for (let i = 0; i < points; i++) {
    const x = xScale(i);
    const y = yScale(balances[i]);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.strokeStyle = '#27ae60';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Fill under portfolio
  ctx.beginPath();
  for (let i = 0; i < points; i++) {
    const x = xScale(i);
    const y = yScale(balances[i]);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.lineTo(xScale(points - 1), pad.top + h);
  ctx.lineTo(xScale(0), pad.top + h);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + h);
  grad.addColorStop(0, 'rgba(39,174,96,0.15)');
  grad.addColorStop(1, 'rgba(39,174,96,0)');
  ctx.fillStyle = grad;
  ctx.fill();

  // Depletion marker
  if (depleted) {
    for (let i = 1; i < points; i++) {
      if (balances[i] <= 0) {
        const x = xScale(i);
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(243,156,18,0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.moveTo(x, pad.top);
        ctx.lineTo(x, pad.top + h);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#f39c12';
        ctx.font = '10px DM Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText('depleted', x + 4, pad.top + 14);
        break;
      }
    }
  }
}

module.exports = { drawChart };
`;
  fs.writeFileSync(path.join(baseDir, 'chart.js'), chartCode);
  console.log('✓ Created chart.js');
  
  // Create main.js
  const mainCode = `/**
 * Main entry point for Life Financial Runway.
 * Wires up DOM events and orchestrates compute + chart.
 */

const { computeRunway } = require('./compute');
const { drawChart } = require('./chart');

const $ = id => document.getElementById(id);
const fmt = n => '$' + Math.round(n).toLocaleString();
const fmtD = n => '$' + n.toFixed(2);

function update() {
  const age = +$('age').value;
  const life = +$('life').value;
  const savings = +$('savings').value;
  const monthlyExpenses = +$('expenses').value;
  const monthlyIncome = +$('income').value;
  const annualReturn = +$('return').value / 100;

  $('age-val').textContent = age;
  $('life-val').textContent = life;
  $('savings-val').textContent = fmt(savings);
  $('expenses-val').textContent = fmt(monthlyExpenses);
  $('income-val').textContent = fmt(monthlyIncome);
  $('return-val').textContent = parseFloat($('return').value).toFixed(1) + '%';

  const result = computeRunway({ age, life, savings, monthlyExpenses, monthlyIncome, annualReturn });
  const { yearsLeft, daysLeft, dailyCost, dailyGen, monthlyNet, depleted, depletedAge, balances, needs, finalBalance } = result;

  $('m-days').textContent = daysLeft.toLocaleString();
  $('m-years').textContent = yearsLeft + ' years';
  $('m-cost').textContent = fmtD(dailyCost);
  $('m-savings-day').textContent = fmtD(savings / daysLeft);
  $('m-gen').textContent = fmtD(dailyGen);

  const gap = monthlyNet;
  const gapEl = $('m-gap');
  if (gap <= 0) {
    gapEl.textContent = fmt(Math.abs(gap)) + '/mo surplus';
    gapEl.className = 'metric-value have';
    $('m-gap-sub').textContent = 'income covers expenses';
  } else {
    gapEl.textContent = fmt(gap) + '/mo shortfall';
    gapEl.className = 'metric-value need';
    $('m-gap-sub').textContent = 'drawing from portfolio';
  }

  if (depleted) {
    $('m-until').textContent = 'Age ' + Math.round(depletedAge);
    $('m-until').className = 'metric-value need';
    $('m-until-sub').textContent = 'portfolio depleted';
  } else {
    $('m-until').textContent = fmt(finalBalance);
    $('m-until').className = 'metric-value have';
    $('m-until-sub').textContent = 'remaining at age ' + life;
  }

  const monthlyReturn = annualReturn / 12;
  const dailyNeed = monthlyExpenses / 30.44;
  const dailyHave = savings / daysLeft;
  const portfolioDaily = (savings * annualReturn) / 365;
  const statusEl = $('status-bar');

  let statusHTML = '';
  if (!depleted) {
    statusHTML = \`Your portfolio <span class="good">outlasts you</span> — ending at <span>\${fmt(finalBalance)}</span> at age \${life}. \`;
    statusHTML += \`Your investments generate <span class="good">\${fmtD(portfolioDaily)}/day</span> vs your \${fmtD(dailyNeed)}/day need. \`;
    if (monthlyIncome > 0) statusHTML += \`The \${fmt(monthlyIncome)}/mo income is doing heavy lifting. \`;
    statusHTML += \`You have more than enough — the question is what to do with the surplus.\`;
  } else {
    const yearsShort = life - Math.round(depletedAge);
    statusHTML = \`At this rate, your portfolio runs out at <span class="bad">age \${Math.round(depletedAge)}</span> — <span class="bad">\${yearsShort} years short</span> of age \${life}. \`;
    const neededSavings = monthlyNet / monthlyReturn;
    statusHTML += \`To never touch principal, you'd need <span class="warn">\${fmt(neededSavings)}</span> invested. \`;
    const incomeNeeded = monthlyNet;
    statusHTML += \`Or generate an extra <span class="warn">\${fmt(incomeNeeded)}/mo</span> in income. \`;
    statusHTML += \`Your \${fmt(savings)} portfolio generates <span class="warn">\${fmtD(portfolioDaily)}/day</span> — your need is \${fmtD(dailyNeed)}/day.\`;
  }
  statusEl.innerHTML = statusHTML;

  drawChart($('chart'), { age, life, yearsLeft, balances, needs, savings, depleted });
}

if (typeof document !== 'undefined') {
  ['age', 'life', 'savings', 'expenses', 'income', 'return'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', update);
  });
  window.addEventListener('resize', update);
  update();
}

module.exports = { update, fmt, fmtD };
`;
  fs.writeFileSync(path.join(baseDir, 'main.js'), mainCode);
  console.log('✓ Created main.js');
  
  // Create test files in life-money subdirectory
  const computeTestCode = `const { computeRunway } = require('../../../../../assets/js/life-money/compute.js');

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
  fs.writeFileSync(path.join(testDir, 'compute.test.js'), computeTestCode);
  console.log('✓ Created compute.test.js');
  
  // Create chart test
  const chartTestCode = `/**
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
  fs.writeFileSync(path.join(testDir, 'chart.test.js'), chartTestCode);
  console.log('✓ Created chart.test.js');
  
  console.log('\n✓ Setup complete! Running Jest tests...\n');
  
  // Run jest
  try {
    execSync('npx jest --watchAll=false', {
      cwd: __dirname,
      stdio: 'inherit'
    });
  } catch (err) {
    console.error('Jest execution failed with error code:', err.status);
    process.exit(err.status || 1);
  }
  
} catch (err) {
  console.error('Setup failed:', err.message);
  process.exit(1);
}
