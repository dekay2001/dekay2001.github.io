const fs = require('fs');
const path = require('path');

// Create directories
const dirs = [
  'assets/js/life-money',
  'test/unit/assets/js/life-money'
];

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

console.log('Setup complete');
