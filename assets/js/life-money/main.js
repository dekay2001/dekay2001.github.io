/**
 * Main entry point for Life Financial Runway.
 * Wires up DOM events and orchestrates compute + chart.
 */

import { computeRunway } from './compute.js';
import { drawChart } from './chart.js';

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
  $('m-savings-day').textContent = fmtD(daysLeft > 0 ? savings / daysLeft : 0);
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
    statusHTML = `Your portfolio <span class="good">outlasts you</span> — ending at <span>${fmt(finalBalance)}</span> at age ${life}. `;
    statusHTML += `Your investments generate <span class="good">${fmtD(portfolioDaily)}/day</span> vs your ${fmtD(dailyNeed)}/day need. `;
    if (monthlyIncome > 0) statusHTML += `The ${fmt(monthlyIncome)}/mo income is doing heavy lifting. `;
    statusHTML += `You have more than enough — the question is what to do with the surplus.`;
  } else {
    const yearsShort = life - Math.round(depletedAge);
    statusHTML = `At this rate, your portfolio runs out at <span class="bad">age ${Math.round(depletedAge)}</span> — <span class="bad">${yearsShort} years short</span> of age ${life}. `;
    const neededSavings = monthlyNet / monthlyReturn;
    statusHTML += `To never touch principal, you'd need <span class="warn">${fmt(neededSavings)}</span> invested. `;
    const incomeNeeded = monthlyNet;
    statusHTML += `Or generate an extra <span class="warn">${fmt(incomeNeeded)}/mo</span> in income. `;
    statusHTML += `Your ${fmt(savings)} portfolio generates <span class="warn">${fmtD(portfolioDaily)}/day</span> — your need is ${fmtD(dailyNeed)}/day.`;
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

export { update, fmt, fmtD };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { update, fmt, fmtD };
}
