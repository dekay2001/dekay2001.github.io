/**
 * @jest-environment jsdom
 */

const { renderMonthlyTable } = require('../../../../../assets/js/life-money/table.js');

function makeTbody() {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);
  return tbody;
}

function makeData(overrides = {}) {
  return {
    age: 40,
    monthlyIncome: [2000, 2000, 2000],
    monthlyExpensesApplied: [4000, 4000, 4000],
    monthlyGrowth: [100, 100, 100],
    monthlyNetChange: [-1900, -1900, 8100],
    monthlyPenalty: [0, 0, 0],
    brokerageBalances: [500000, 498100, 496200, 504300],
    retirementBalances: [0, 0, 0, 0],
    lumpEventMonth: null,
    ...overrides,
  };
}

describe('renderMonthlyTable', () => {
  it('renders one row per simulated month', () => {
    const tbody = makeTbody();
    renderMonthlyTable(tbody, makeData());
    expect(tbody.children.length).toBe(3);
  });

  it('renders month number and age in the first two cells', () => {
    const tbody = makeTbody();
    renderMonthlyTable(tbody, makeData());
    const firstRow = tbody.children[0];
    expect(firstRow.children[0].textContent).toBe('1');
    expect(firstRow.children[1].textContent).toBe((40 + 1 / 12).toFixed(1));
  });

  it('formats income, expenses, and balance cells as currency', () => {
    const tbody = makeTbody();
    renderMonthlyTable(tbody, makeData());
    const firstRow = tbody.children[0];
    expect(firstRow.children[2].textContent).toBe('$2,000');
    expect(firstRow.children[3].textContent).toBe('$4,000');
    expect(firstRow.children[7].textContent).toBe('$498,100');
    expect(firstRow.children[8].textContent).toBe('$0');
  });

  it('marks negative net-change cells with the negative class and a minus sign', () => {
    const tbody = makeTbody();
    renderMonthlyTable(tbody, makeData());
    const netChangeCell = tbody.children[0].children[5];
    expect(netChangeCell.textContent).toBe('-$1,900');
    expect(netChangeCell.className).toContain('amount-negative');
  });

  it('marks positive net-change cells with the positive class and a plus sign', () => {
    const tbody = makeTbody();
    renderMonthlyTable(tbody, makeData());
    const netChangeCell = tbody.children[2].children[5];
    expect(netChangeCell.textContent).toBe('+$8,100');
    expect(netChangeCell.className).toContain('amount-positive');
  });

  it('flags the row where the lump-sum event was applied', () => {
    const tbody = makeTbody();
    renderMonthlyTable(tbody, makeData({ lumpEventMonth: 2 }));
    expect(tbody.children[1].className).toContain('lump-event-row');
    expect(tbody.children[0].className).not.toContain('lump-event-row');
    expect(tbody.children[2].className).not.toContain('lump-event-row');
  });

  it('replaces existing rows on repeated calls instead of appending', () => {
    const tbody = makeTbody();
    renderMonthlyTable(tbody, makeData());
    renderMonthlyTable(tbody, makeData());
    expect(tbody.children.length).toBe(3);
  });

  it('renders an em dash in the penalty cell when no penalty was paid', () => {
    const tbody = makeTbody();
    renderMonthlyTable(tbody, makeData());
    const penaltyCell = tbody.children[0].children[6];
    expect(penaltyCell.textContent).toBe('—');
    expect(penaltyCell.className).not.toContain('amount-negative');
  });

  it('renders the penalty amount and flags the row when a penalty was paid', () => {
    const tbody = makeTbody();
    renderMonthlyTable(tbody, makeData({ monthlyPenalty: [222, 0, 0] }));
    const firstRow = tbody.children[0];
    expect(firstRow.children[6].textContent).toBe('-$222');
    expect(firstRow.children[6].className).toContain('amount-negative');
    expect(firstRow.className).toContain('penalty-row');
    expect(tbody.children[1].className).not.toContain('penalty-row');
  });

  it('does not render or flag penalties that round to zero dollars', () => {
    const tbody = makeTbody();
    renderMonthlyTable(tbody, makeData({ monthlyPenalty: [0.4, 0, 0] }));
    expect(tbody.children[0].children[6].textContent).toBe('\u2014');
    expect(tbody.children[0].className).not.toContain('penalty-row');
  });
});
