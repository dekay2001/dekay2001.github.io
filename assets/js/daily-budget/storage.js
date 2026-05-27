/**
 * LocalStorage persistence for Daily Budget selections.
 */

const STORAGE_KEY = 'daily-budget-state';

function loadSelections() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSelections(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // silently fail if storage unavailable
  }
}

export { loadSelections, saveSelections };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { loadSelections, saveSelections };
}
