/**
 * @jest-environment jsdom
 */

const { drawChart } = require('../../../../assets/js/life-money/chart.js');

function makeCanvas() {
  const canvas = document.createElement('canvas');
  const parent = document.createElement('div');
  Object.defineProperty(parent, 'clientWidth', { value: 648 });
  parent.appendChild(canvas);
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
  canvas.style = {};
  return { canvas, ctx };
}

function makeData(overrides = {}) {
  const yearsLeft = 50;
  const months = yearsLeft * 12;
  const balances = Array.from({ length: months + 1 }, (_, i) => Math.max(500000 - i * 100, 0));
  const needs = Array.from({ length: months + 1 }, (_, i) => i * 4000);
  return {
    age: 40,
    life: 90,
    yearsLeft,
    balances,
    needs,
    savings: 500000,
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
      drawChart(canvas, { age: 40, life: 40, yearsLeft: 0, balances: [500000], needs: [0], savings: 500000, depleted: false })
    ).not.toThrow();
  });
});
