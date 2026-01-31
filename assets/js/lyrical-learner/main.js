/**
 * @file Lyrical Learner Main Entry Point
 * @description Entry point for the Lyrical Learner application.
 * Sets up UI components and attaches basic event listeners (without playback functionality).
 */

import { createUIComponents } from './ui-components.js';
import { parseLyrics } from './lyrics-parser.js';
import { PlaybackEngine } from './playback-engine.js';
import {
    saveLyrics,
    loadLyrics,
    clearLyrics,
    saveSettings,
    loadSettings,
    hasSavedLyrics
} from './storage.js';

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
  _loadSavedData();
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
    document.removeEventListener('keydown', _handleKeyboardShortcut);
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
    saveSettings({ speed });
  });

  uiComponents.addEventListener('delaySliderId', 'input', (event) => {
    const delay = parseFloat(event.target.value);
    uiComponents.updateDelayDisplay(delay);
    saveSettings({ delay });
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

  uiComponents.addEventListener('skipNextBtnId', 'click', () => {
    _handleSkipNext();
  });

  uiComponents.addEventListener('skipPrevBtnId', 'click', () => {
    _handleSkipPrevious();
  });

  uiComponents.addEventListener('loopBtnId', 'click', () => {
    _handleLoopToggle();
  });

  // Clear saved lyrics button (if exists)
  const clearSavedBtn = document.getElementById('clearSavedBtn');
  if (clearSavedBtn) {
    clearSavedBtn.addEventListener('click', _handleClearSaved);
  }

  // Keyboard shortcuts - remove existing listener first to prevent duplicates
  document.removeEventListener('keydown', _handleKeyboardShortcut);
  document.addEventListener('keydown', _handleKeyboardShortcut);
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

  // Save lyrics to localStorage
  saveLyrics(lyricsText);

  parsedLyrics = parseLyrics(lyricsText);
  
  uiComponents.updateKaraokeDisplay(
    `<p class="ll-placeholder-text">Lyrics loaded: ${parsedLyrics.length} lines ready</p>`
  );
  
  uiComponents.updateProgress(0, parsedLyrics.length);
  uiComponents.setButtonEnabled('playBtnId', true);
  uiComponents.setButtonEnabled('resetBtnId', true);
  _updateClearSavedButton();
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
    const loopBtn = uiComponents.getElement('loopBtnId');
    const isLoopEnabled = loopBtn ? loopBtn.classList.contains('active') : false;
    
    playbackEngine = new PlaybackEngine(parsedLyrics, {
      speed: speed,
      lineDelay: delay,
      loop: isLoopEnabled
    });

    _setupPlaybackListeners();
  } else {
    // Update settings if engine already exists (e.g., after pause)
    const speed = uiComponents.getSpeed();
    const delay = uiComponents.getDelay() * 1000; // Convert to ms
    playbackEngine.updateSettings({
      speed: speed,
      lineDelay: delay
    });
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
 * @param {boolean} clearLyrics - Whether to clear lyrics text (default: true)
 * @private
 */
function _handleReset(clearLyrics = true) {
  if (playbackEngine) {
    playbackEngine.stop();
    playbackEngine = null;
  }
  
  if (clearLyrics) {
    uiComponents.resetControls();
    uiComponents.setLyricsText('');
    parsedLyrics = null;
  } else {
    // Keyboard shortcut reset - keep lyrics but stop playback
    uiComponents.clearKaraokeDisplay();
    uiComponents.updateProgress(0, 0);
    uiComponents.setButtonEnabled('playBtnId', true);
    uiComponents.setButtonEnabled('pauseBtnId', false);
    uiComponents.setButtonEnabled('resetBtnId', true);
  }
}

/**
 * Handle skip to next line
 * @private
 */
function _handleSkipNext() {
  if (!playbackEngine) return;
  playbackEngine.skipToNext();
}

/**
 * Handle skip to previous line
 * @private
 */
function _handleSkipPrevious() {
  if (!playbackEngine) return;
  playbackEngine.skipToPrevious();
}

/**
 * Handle loop button toggle
 * @private
 */
function _handleLoopToggle() {
  const loopBtn = uiComponents.getElement('loopBtnId');
  if (!loopBtn) return;
  
  const isLoopEnabled = loopBtn.classList.toggle('active');
  
  // Save loop setting
  saveSettings({ loop: isLoopEnabled });
  
  // Update engine setting if engine exists
  if (playbackEngine) {
    playbackEngine.updateSettings({ loop: isLoopEnabled });
  }
}

/**
 * Handle clear saved lyrics button click
 * @private
 */
function _handleClearSaved() {
  if (confirm('Clear saved lyrics and settings? This cannot be undone.')) {
    clearLyrics();
    uiComponents.setLyricsText('');
    _handleReset();
    _updateClearSavedButton();
  }
}

/**
 * Load saved data from localStorage
 * @private
 */
function _loadSavedData() {
  // Load saved settings
  const settings = loadSettings();
  
  // Apply saved settings to UI
  const speedSlider = uiComponents.getElement('speedSliderId');
  if (speedSlider) {
    speedSlider.value = settings.speed;
    uiComponents.updateSpeedDisplay(settings.speed);
  }
  
  const delaySlider = uiComponents.getElement('delaySliderId');
  if (delaySlider) {
    delaySlider.value = settings.delay;
    uiComponents.updateDelayDisplay(settings.delay);
  }
  
  const loopBtn = uiComponents.getElement('loopBtnId');
  if (loopBtn && settings.loop) {
    loopBtn.classList.add('active');
  }
  
  // Load saved lyrics
  const savedLyrics = loadLyrics();
  if (savedLyrics) {
    uiComponents.setLyricsText(savedLyrics);
    uiComponents.updateKaraokeDisplay(
      '<p class="ll-placeholder-text">Saved lyrics loaded. Click "Load Lyrics" to begin practicing.</p>'
    );
  } else {
    uiComponents.resetControls();
  }
  
  _updateClearSavedButton();
}

/**
 * Update the clear saved button visibility/state
 * @private
 */
function _updateClearSavedButton() {
  const clearSavedBtn = document.getElementById('clearSavedBtn');
  if (clearSavedBtn) {
    clearSavedBtn.style.display = hasSavedLyrics() ? 'inline-block' : 'none';
  }
}

/**
 * Handle keyboard shortcuts
 * @param {KeyboardEvent} event - Keyboard event
 * @private
 */
function _handleKeyboardShortcut(event) {
  // Don't trigger shortcuts when typing in input fields
  const target = event.target;
  if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
    return;
  }

  switch (event.key) {
    case ' ': // Spacebar - play/pause
      event.preventDefault();
      if (!parsedLyrics || parsedLyrics.length === 0) return;
      if (playbackEngine && playbackEngine.isPlaying()) {
        _handlePause();
      } else {
        _handlePlay();
      }
      break;
    case 'ArrowRight': // Right arrow - skip next
      event.preventDefault();
      _handleSkipNext();
      break;
    case 'ArrowLeft': // Left arrow - skip previous
      event.preventDefault();
      _handleSkipPrevious();
      break;
    case 'Escape': // Escape - reset without clearing lyrics
      event.preventDefault();
      _handleReset(false);
      break;
  }
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
      uiComponents.displayLyricsLine(line.text, 'll-section-marker');
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

// CommonJS compatibility for Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initializeLyricalLearner, getUIComponents, getParsedLyrics, getPlaybackEngine, cleanup };
}
