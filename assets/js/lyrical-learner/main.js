/**
 * @file Lyrical Learner Main Entry Point
 * @description Entry point for the Lyrical Learner application.
 * Sets up UI components and attaches basic event listeners (without playback functionality).
 */

import { createUIComponents } from './ui-components.js';

/**
 * Main application instance
 */
let uiComponents = null;

/**
 * Initialize the Lyrical Learner application
 * @description Sets up UI components and event listeners
 */
export function initializeLyricalLearner() {
  // Create and initialize UI components
  uiComponents = createUIComponents();
  
  // Set up event listeners for UI controls
  setupEventListeners();
  
  // Initialize UI to default state
  uiComponents.resetControls();
  
  console.log('Lyrical Learner initialized (UI only - no playback functionality yet)');
}

/**
 * Set up event listeners for all UI controls
 * @private
 */
function setupEventListeners() {
  // Speed slider - update display value
  uiComponents.addEventListener('speedSliderId', 'input', (event) => {
    const speed = parseFloat(event.target.value);
    uiComponents.updateSpeedDisplay(speed);
  });

  // Delay slider - update display value
  uiComponents.addEventListener('delaySliderId', 'input', (event) => {
    const delay = parseFloat(event.target.value);
    uiComponents.updateDelayDisplay(delay);
  });

  // Load lyrics button - enable player controls when lyrics are loaded
  uiComponents.addEventListener('loadBtnId', 'click', () => {
    handleLoadLyrics();
  });

  // Play button - placeholder for future functionality
  uiComponents.addEventListener('playBtnId', 'click', () => {
    handlePlay();
  });

  // Pause button - placeholder for future functionality
  uiComponents.addEventListener('pauseBtnId', 'click', () => {
    handlePause();
  });

  // Reset button - clear and reset UI
  uiComponents.addEventListener('resetBtnId', 'click', () => {
    handleReset();
  });
}

/**
 * Handle load lyrics button click
 * @private
 */
function handleLoadLyrics() {
  const lyricsText = uiComponents.getLyricsText();
  
  if (!lyricsText.trim()) {
    console.log('No lyrics to load');
    uiComponents.updateKaraokeDisplay(
      '<p class="ll-placeholder-text">Please paste lyrics before loading</p>'
    );
    return;
  }

  // Parse lyrics into lines (simple split for now)
  const lines = lyricsText.split('\n').filter(line => line.trim());
  
  // Update UI to show lyrics loaded
  uiComponents.updateKaraokeDisplay(
    `<p class="ll-placeholder-text">Lyrics loaded: ${lines.length} lines ready</p>`
  );
  
  // Update progress
  uiComponents.updateProgress(0, lines.length);
  
  // Enable player controls
  uiComponents.setButtonEnabled('playBtnId', true);
  uiComponents.setButtonEnabled('resetBtnId', true);
  
  console.log(`Loaded ${lines.length} lines of lyrics`);
}

/**
 * Handle play button click (placeholder)
 * @private
 */
function handlePlay() {
  console.log('Play clicked (functionality not implemented yet)');
  
  // Toggle button states
  uiComponents.setButtonEnabled('playBtnId', false);
  uiComponents.setButtonEnabled('pauseBtnId', true);
  
  // Update display
  uiComponents.updateKaraokeDisplay(
    '<p class="ll-placeholder-text">▶ Playback functionality coming soon...</p>'
  );
}

/**
 * Handle pause button click (placeholder)
 * @private
 */
function handlePause() {
  console.log('Pause clicked (functionality not implemented yet)');
  
  // Toggle button states
  uiComponents.setButtonEnabled('playBtnId', true);
  uiComponents.setButtonEnabled('pauseBtnId', false);
  
  // Update display
  uiComponents.updateKaraokeDisplay(
    '<p class="ll-placeholder-text">⏸ Paused</p>'
  );
}

/**
 * Handle reset button click
 * @private
 */
function handleReset() {
  console.log('Reset clicked');
  
  // Reset UI to initial state
  uiComponents.resetControls();
  uiComponents.setLyricsText('');
  
  console.log('UI reset complete');
}

/**
 * Get the current UI components instance
 * @returns {UIComponents|null} The UI components instance
 */
export function getUIComponents() {
  return uiComponents;
}

/**
 * Cleanup function for application shutdown
 */
export function cleanup() {
  if (uiComponents) {
    uiComponents.removeAllEventListeners();
    uiComponents = null;
  }
}

// CommonJS compatibility for Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initializeLyricalLearner, getUIComponents, cleanup };
}
