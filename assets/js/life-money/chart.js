/**
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
  if (yearsLeft === 0 || points <= 1) {
    ctx.fillText('Age ' + age, pad.left, H - 8);
  } else {
    const labelCount = Math.min(yearsLeft, 8);
    for (let i = 0; i <= labelCount; i++) {
      const yearIdx = Math.round((i / labelCount) * (points - 1));
      const x = xScale(yearIdx);
      const labelAge = age + Math.round((yearIdx / (points - 1)) * yearsLeft);
      ctx.fillText('Age ' + labelAge, x, H - 8);
    }
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

export { drawChart };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { drawChart };
}
