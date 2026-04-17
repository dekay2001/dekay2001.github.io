'use strict';
/**
 * Jest globalSetup — runs once before test discovery.
 * Ensures the source directory needed for the life-money module exists.
 */
const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

module.exports = async function () {
  const root = __dirname;
  const srcDir = path.join(root, 'assets', 'js', 'life-money');

  ensureDir(srcDir);
};

// Allow running directly: `node jest.global-setup.js`
if (require.main === module) {
  module.exports().catch(err => { console.error(err); process.exit(1); });
}
