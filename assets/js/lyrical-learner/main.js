/**
 * @file Lyrical Learner Main Entry Point
 * @description Entry point for the Lyrical Learner application.
 * Sets up UI components and attaches basic event listeners (without playback functionality).
 */

import { createUIComponents } from './ui-components.js';

// ============================================================================
// MODULE STATE
// ============================================================================

/**
 * Main application instance
 * @private
 */
let uiComponents = null;

// ============================================================================
// PUBLIC INTERFACE
// ============================================================================

/**
 * Initialize the Lyrical Learner application
 * @description Sets up UI components and event listeners
 * @public
 */
export function initializeLyricalLearner() {
  uiComponents = createUIComponents();
  _setupEventListeners();
  uiComponents.resetControls();
}

/**
 * Get the current UI components instance
 * @returns {UIComponents|null} The UI components instance
 * @public
 */
export function getUIComponents() {
  return uiComponents;
}

/**
 * Cleanup function for application shutdown
 * @public
 */
export function cleanup() {
  if (uiComponents) {
    uiComponents.removeAllEventListeners();
    uiComponents = null;
  }
}

// ============================================================================
// PRIVATE IMPLEMENTATION
// ============================================================================

/**
 * Set up event listeners for all UI controls
 * @private
 */
function _setupEventListeners() {
  uiComponents.addEventListener('speedSliderId', 'input', (event) => {
    const speed = parseFloat(event.target.value);
    uiComponents.updateSpeedDisplay(speed);
  });

  uiComponents.addEventListener('delaySliderId', 'input', (event) => {
    const delay = parseFloat(event.target.value);
    uiComponents.updateDelayDisplay(delay);
  });

  uiComponents.addEventListener('loadBtnId', 'click', () => {
    _handleLoadLyrics();
  });

  uiComponents.addEventListener('playBtnId', 'click', () => {
    _handlePlay();
  });

  uiComponents.addEventListener('pauseBtnId', 'click', () => {
    _handlePause();
  });

  uiComponents.addEventListener('resetBtnId', 'click', () => {
    _handleReset();
  });
}

/**
 * Handle load lyrics button click
 * @private
 */
function _handleLoadLyrics() {
  const lyricsText = uiComponents.getLyricsText();
  
  if (!lyricsText.trim()) {
    uiComponents.updateKaraokeDisplay(
      '<p class="ll-placeholder-text">Please paste lyrics before loading</p>'
    );
    return;
  }

  const lines = lyricsText.split('\n').filter(line => line.trim());
  
  uiComponents.updateKaraokeDisplay(
    `<p class="ll-placeholder-text">Lyrics loaded: ${lines.length} lines ready</p>`
  );
  
  uiComponents.updateProgress(0, lines.length);
  uiComponents.setButtonEnabled('playBtnId', true);
  uiComponents.setButtonEnabled('resetBtnId', true);
}

/**
 * Handle play button click (placeholder)
 * @private
 */
function _handlePlay() {
  uiComponents.setButtonEnabled('playBtnId', false);
  uiComponents.setButtonEnabled('pauseBtnId', true);
  
  uiComponents.updateKaraokeDisplay(
    '<p class="ll-placeholder-text">▶ Playback functionality coming soon...</p>'
  );
}

/**
 * Handle pause button click (placeholder)
 * @private
 */
function _handlePause() {
  uiComponents.setButtonEnabled('playBtnId', true);
  uiComponents.setButtonEnabled('pauseBtnId', false);
  
  uiComponents.updateKaraokeDisplay(
    '<p class="ll-placeholder-text">⏸ Paused</p>'
  );
}

/**
 * Handle reset button click
 * @private
 */
function _handleReset() {
  uiComponents.resetControls();
  uiComponents.setLyricsText('');
}

// CommonJS compatibility for Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initializeLyricalLearner, getUIComponents, cleanup };
}
