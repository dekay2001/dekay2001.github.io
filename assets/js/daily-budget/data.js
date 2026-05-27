/**
 * Category definitions and scenario presets for Daily Budget.
 */

const CATEGORIES = [
  {
    id: 'coffee',
    label: 'Coffee',
    tiers: [
      { label: 'Home brew', cost: 0.50 },
      { label: 'Coffee shop', cost: 5.00 },
      { label: 'Specialty café', cost: 7.00 },
    ],
    defaultTier: 1,
    defaultDays: 5,
  },
  {
    id: 'breakfast',
    label: 'Breakfast',
    tiers: [
      { label: 'Home', cost: 1.50 },
      { label: 'Grab-and-go', cost: 6.00 },
      { label: 'Sit-down', cost: 12.00 },
    ],
    defaultTier: 0,
    defaultDays: 7,
  },
  {
    id: 'lunch',
    label: 'Lunch',
    tiers: [
      { label: 'Cook', cost: 3.00 },
      { label: 'Fast casual', cost: 12.00 },
      { label: 'Restaurant', cost: 20.00 },
    ],
    defaultTier: 0,
    defaultDays: 7,
  },
  {
    id: 'dinner',
    label: 'Dinner',
    tiers: [
      { label: 'Cook', cost: 6.00 },
      { label: 'Takeout', cost: 15.00 },
      { label: 'Eat out', cost: 25.00 },
    ],
    defaultTier: 0,
    defaultDays: 7,
  },
  {
    id: 'drinks',
    label: 'Drinks',
    tiers: [
      { label: 'Skip', cost: 0 },
      { label: 'Budget', cost: 5.00 },
      { label: 'Standard', cost: 7.00 },
    ],
    defaultTier: 2,
    defaultDays: 3,
  },
  {
    id: 'transport',
    label: 'Gas/Transport',
    tiers: [
      { label: 'Stay in', cost: 0 },
      { label: 'Short drive', cost: 2.00 },
      { label: 'Long drive', cost: 6.00 },
    ],
    defaultTier: 1,
    defaultDays: 5,
  },
  {
    id: 'recreation',
    label: 'Recreation',
    tiers: [
      { label: 'Free (walk/park)', cost: 0 },
      { label: 'Low-cost activity', cost: 10.00 },
      { label: 'Night out', cost: 30.00 },
    ],
    defaultTier: 0,
    defaultDays: 3,
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions (daily share)',
    tiers: [
      { label: 'Minimal', cost: 0.65 },
      { label: 'Moderate', cost: 1.50 },
      { label: 'Full', cost: 3.00 },
    ],
    defaultTier: 0,
    defaultDays: 7,
  },
];

const DEFAULT_FIXED_COSTS = [
  { label: 'Housing', amount: 700 },
  { label: 'Phone', amount: 80 },
  { label: 'Internet', amount: 70 },
  { label: 'Gym', amount: 25 },
  { label: 'Insurance', amount: 100 },
  { label: 'Tools/Subscriptions', amount: 20 },
];

const SCENARIOS = {
  frugal: {
    tiers: [0, 0, 0, 0, 0, 0, 0, 0],
    days: [5, 7, 7, 7, 0, 3, 2, 7],
  },
  balanced: {
    tiers: [1, 1, 1, 1, 1, 1, 1, 1],
    days: [5, 4, 4, 3, 2, 5, 2, 7],
  },
  flexible: {
    tiers: [2, 2, 2, 2, 2, 2, 2, 2],
    days: [6, 7, 6, 5, 3, 5, 3, 7],
  },
};

export { CATEGORIES, DEFAULT_FIXED_COSTS, SCENARIOS };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CATEGORIES, DEFAULT_FIXED_COSTS, SCENARIOS };
}
