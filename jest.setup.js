const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

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

console.log('Jest setup: all life-money modules created');

