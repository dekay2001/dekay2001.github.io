## Project Setup and Test Execution Summary

### Current test infrastructure

1. **`package.json`**
   - `npm test` runs `jest --watchAll=false`
   - Jest is configured with:
     - `globalSetup: ./jest.global-setup.js`
     - `setupFilesAfterEnv: ["<rootDir>/jest.setup.js"]`

2. **`jest.global-setup.js`**
   - Runs once before test discovery
   - Ensures `assets/js/life-money/` exists

3. **`jest.setup.js`**
   - Runs after the test framework is installed
   - Kept as an explicit shared setup hook
   - Does not create directories or generate source files

### Life-money source modules

Committed under `assets/js/life-money/`:
- `compute.js`
- `chart.js`
- `main.js`

### Unit tests

- `test/unit/assets/js/compute.test.js`
  - Imports `../../../../assets/js/life-money/compute.js`
  - Covers runway calculations and depletion behavior

- `test/unit/assets/js/chart.test.js`
  - Imports `../../../../assets/js/life-money/chart.js`
  - Covers canvas rendering behavior and edge cases

### How to run tests

From repository root:

```bash
npm test
```

### Verification checklist

- Source modules are committed in `assets/js/life-money/`
- Test imports target committed modules directly
- Jest setup runs once through Jest configuration (no duplicate pretest bootstrap)
- Test command is repo-relative and platform-neutral
