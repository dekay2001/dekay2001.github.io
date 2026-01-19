/**
 * @file Lyrical Learner Main Entry Point
 * @description Entry point for the Lyrical Learner application.
 * Sets up UI components and attaches basic event listeners (without playback functionality).
 */

import { createUIComponents } from './ui-components.js';
import { parseLyrics } from './lyrics-parser.js';
import { PlaybackEngine } from './playback-engine.js';

// ============================================================================
// MODULE STATE
// ============================================================================

/**
 * Main application instance
 * @private
 */
let uiComponents = null;

/**
 * Parsed lyrics lines
 * @private
 */
let parsedLyrics = null;

/**
 * Playback engine instance
 * @private
 */
let playbackEngine = null;

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
 * Get the parsed lyrics
 * @returns {Array|null} The parsed lyrics or null if not loaded
 * @public
 */
export function getParsedLyrics() {
  return parsedLyrics;
}

/**
 * Get the playback engine instance
 * @returns {PlaybackEngine|null} The playback engine or null if not created
 * @public
 */
export function getPlaybackEngine() {
  return playbackEngine;
}

/**
 * Cleanup function for application shutdown
 * @public
 */
export function cleanup() {
  if (playbackEngine) {
    playbackEngine.stop();
    playbackEngine = null;
  }
  if (uiComponents) {
    uiComponents.removeAllEventListeners();
    uiComponents = null;
  }
  parsedLyrics = null;
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

  parsedLyrics = parseLyrics(lyricsText);
  
  uiComponents.updateKaraokeDisplay(
    `<p class="ll-placeholder-text">Lyrics loaded: ${parsedLyrics.length} lines ready</p>`
  );
  
  uiComponents.updateProgress(0, parsedLyrics.length);
  uiComponents.setButtonEnabled('playBtnId', true);
  uiComponents.setButtonEnabled('resetBtnId', true);
}

/**
 * Handle play button click
 * @private
 */
function _handlePlay() {
  if (!parsedLyrics || parsedLyrics.length === 0) {
    return;
  }

  // Create engine if doesn't exist
  if (!playbackEngine) {
    const speed = uiComponents.getSpeed();
    const delay = uiComponents.getDelay() * 1000; // Convert to ms
    
    playbackEngine = new PlaybackEngine(parsedLyrics, {
      speed: speed,
      lineDelay: delay
    });

    _setupPlaybackListeners();
  }

  playbackEngine.play();
  uiComponents.setButtonEnabled('playBtnId', false);
  uiComponents.setButtonEnabled('pauseBtnId', true);
}

/**
 * Handle pause button click
 * @private
 */
function _handlePause() {
  if (!playbackEngine) {
    return;
  }

  playbackEngine.pause();
  uiComponents.setButtonEnabled('playBtnId', true);
  uiComponents.setButtonEnabled('pauseBtnId', false);
}

/**
 * Handle reset button click
 * @private
 */
function _handleReset() {
  if (playbackEngine) {
    playbackEngine.stop();
    playbackEngine = null;
  }
  
  uiComponents.resetControls();
  uiComponents.setLyricsText('');
  parsedLyrics = null;
}

/**
 * Setup playback engine event listeners
 * @private
 */
function _setupPlaybackListeners() {
  playbackEngine.on('lineChanged', (data) => {
    const { line, index, total } = data;
    
    // Display the line safely using textContent
    if (line.isSection) {
      uiComponents.updateKaraokeDisplay(
        `<p class="ll-section-marker">${_escapeHtml(line.text)}</p>`
      );
    } else {
      uiComponents.displayLyricsLine(line.text, 'll-lyrics-line');
    }
    
    // Update progress
    uiComponents.updateProgress(index + 1, total);
  });

  playbackEngine.on('completed', () => {
    uiComponents.updateKaraokeDisplay(
      '<p class="ll-placeholder-text">✓ Lyrics completed! Click Reset to start over.</p>'
    );
    uiComponents.setButtonEnabled('playBtnId', false);
    uiComponents.setButtonEnabled('pauseBtnId', false);
  });
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 * @private
 */
function _escapeHtml(text) {
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, char => escapeMap[char]);
}

// CommonJS compatibility for Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initializeLyricalLearner, getUIComponents, getParsedLyrics, getPlaybackEngine, cleanup };
}
