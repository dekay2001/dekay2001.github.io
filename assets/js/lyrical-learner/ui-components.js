/**
 * @file UI Components Manager for Lyrical Learner
 * @description Manages all UI elements and their interactions (without playback functionality).
 * Provides interfaces for DOM element access, event listener setup, and UI state management.
 */

/**
 * Create and initialize a UIComponents instance with default element IDs
 * @returns {UIComponents} Initialized UIComponents instance
 */
export function createUIComponents() {
  const config = {
    lyricsInputId: 'lyricsInput',
    loadBtnId: 'loadLyricsBtn',
    karaokeDisplayId: 'karaokeDisplay',
    speedSliderId: 'speedSlider',
    speedValueId: 'speedValue',
    delaySliderId: 'delaySlider',
    delayValueId: 'delayValue',
    playBtnId: 'playBtn',
    pauseBtnId: 'pauseBtn',
    resetBtnId: 'resetBtn',
    progressBarId: 'progressBar',
    currentLineId: 'currentLine',
    totalLinesId: 'totalLines'
  };

  const uiComponents = new UIComponents(config);
  uiComponents.initializeElements();
  
  return uiComponents;
}

/**
 * UIComponents class - Manages all UI elements for the Lyrical Learner application
 * @class
 */
export class UIComponents {
  /**
   * Creates a new UIComponents instance
   * @constructor
   * @param {Object} config - Configuration object for UI components
   * @param {string} config.lyricsInputId - ID of the lyrics textarea element
   * @param {string} config.loadBtnId - ID of the load lyrics button
   * @param {string} config.karaokeDisplayId - ID of the karaoke display container
   * @param {string} config.speedSliderId - ID of the speed control slider
   * @param {string} config.speedValueId - ID of the speed value display span
   * @param {string} config.delaySliderId - ID of the line delay slider
   * @param {string} config.delayValueId - ID of the delay value display span
   * @param {string} config.playBtnId - ID of the play button
   * @param {string} config.pauseBtnId - ID of the pause button
   * @param {string} config.resetBtnId - ID of the reset button
   * @param {string} config.progressBarId - ID of the progress bar fill element
   * @param {string} config.currentLineId - ID of the current line counter span
   * @param {string} config.totalLinesId - ID of the total lines counter span
   */
  constructor(config) {
    this.config = config;
    this._elements = {};
    this._eventListeners = new Map();
  }

  /**
   * Initialize all UI elements by querying the DOM
   * @returns {boolean} True if all elements were found, false otherwise
   */
  initializeElements() {
    const elementIds = [
      'lyricsInputId',
      'loadBtnId',
      'karaokeDisplayId',
      'speedSliderId',
      'speedValueId',
      'delaySliderId',
      'delayValueId',
      'playBtnId',
      'pauseBtnId',
      'resetBtnId',
      'progressBarId',
      'currentLineId',
      'totalLinesId'
    ];

    let allFound = true;
    
    elementIds.forEach(configKey => {
      const elementId = this.config[configKey];
      const element = document.getElementById(elementId);
      
      if (!element) {
        allFound = false;
      }
      
      this._elements[configKey] = element;
    });

    return allFound;
  }

  /**
   * Get a specific UI element
   * @param {string} elementKey - The configuration key for the element
   * @returns {HTMLElement|null} The DOM element or null if not found
   */
  getElement(elementKey) {
    return this._elements[elementKey] || null;
  }

  /**
   * Get all UI elements
   * @returns {Object} Object containing all UI elements
   */
  getAllElements() {
    return { ...this._elements };
  }

  /**
   * Attach an event listener to a UI element
   * @param {string} elementKey - The configuration key for the element
   * @param {string} eventType - The type of event (e.g., 'click', 'input')
   * @param {Function} handler - The event handler function
   * @returns {boolean} True if listener was attached, false otherwise
   */
  addEventListener(elementKey, eventType, handler) {
    const element = this.getElement(elementKey);
    
    if (!element) {
      return false;
    }

    element.addEventListener(eventType, handler);
    
    const key = `${elementKey}::${eventType}`;
    if (!this._eventListeners.has(key)) {
      this._eventListeners.set(key, []);
    }
    this._eventListeners.get(key).push(handler);

    return true;
  }

  /**
   * Remove all event listeners (cleanup method)
   */
  removeAllEventListeners() {
    this._eventListeners.forEach((handlers, key) => {
      const [elementKey, eventType] = key.split('::');
      const element = this.getElement(elementKey);
      
      if (element) {
        handlers.forEach(handler => {
          element.removeEventListener(eventType, handler);
        });
      }
    });
    
    this._eventListeners.clear();
  }

  /**
   * Get the current value of the lyrics textarea
   * @returns {string} The lyrics text
   */
  getLyricsText() {
    const element = this.getElement('lyricsInputId');
    return element ? element.value : '';
  }

  /**
   * Set the lyrics textarea value
   * @param {string} text - The lyrics text to set
   */
  setLyricsText(text) {
    const element = this.getElement('lyricsInputId');
    if (element) {
      element.value = text;
    }
  }

  /**
   * Get the current speed value from the slider
   * @returns {number} The speed value (0.5 to 2.0)
   */
  getSpeed() {
    const element = this.getElement('speedSliderId');
    return element ? parseFloat(element.value) : 1.0;
  }

  /**
   * Get the current line delay value from the slider
   * @returns {number} The delay value in seconds (0.5 to 5.0)
   */
  getDelay() {
    const element = this.getElement('delaySliderId');
    return element ? parseFloat(element.value) : 2.0;
  }

  /**
   * Update the speed display value
   * @param {number} speed - The speed value to display
   */
  updateSpeedDisplay(speed) {
    const element = this.getElement('speedValueId');
    if (element) {
      element.textContent = speed.toFixed(1);
    }
  }

  /**
   * Update the delay display value
   * @param {number} delay - The delay value to display
   */
  updateDelayDisplay(delay) {
    const element = this.getElement('delayValueId');
    if (element) {
      element.textContent = delay.toFixed(1);
    }
  }

  /**
   * Enable or disable a button
   * @param {string} elementKey - The button element key
   * @param {boolean} enabled - True to enable, false to disable
   */
  setButtonEnabled(elementKey, enabled) {
    const element = this.getElement(elementKey);
    if (element) {
      element.disabled = !enabled;
    }
  }

  /**
   * Update the karaoke display content
   * @param {string} content - HTML content to display
   * @warning This method uses innerHTML. Only use with trusted static HTML.
   *          For user-provided content, use displayLyricsLine() instead.
   */
  updateKaraokeDisplay(content) {
    const element = this.getElement('karaokeDisplayId');
    if (element) {
      element.innerHTML = content;
    }
  }

  /**
   * Safely display user-provided lyrics line with HTML escaping
   * @param {string} lyricsText - User-provided lyrics text to display
   * @param {string} [className='ll-lyrics-line'] - CSS class for the line element
   */
  displayLyricsLine(lyricsText, className = 'll-lyrics-line') {
    const element = this.getElement('karaokeDisplayId');
    if (element) {
      const p = document.createElement('p');
      p.className = className;
      p.textContent = lyricsText;
      element.innerHTML = '';
      element.appendChild(p);
    }
  }

  /**
   * Escape HTML special characters to prevent XSS attacks
   * @param {string} text - Text to escape
   * @returns {string} Escaped text safe for HTML display
   * @private
   */
  _escapeHtml(text) {
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, char => escapeMap[char]);
  }

  /**
   * Update the progress bar
   * @param {number} current - Current line number (0-based)
   * @param {number} total - Total number of lines
   */
  updateProgress(current, total) {
    const progressBar = this.getElement('progressBarId');
    const currentLineSpan = this.getElement('currentLineId');
    const totalLinesSpan = this.getElement('totalLinesId');

    if (progressBar) {
      const percentage = total > 0 ? (current / total) * 100 : 0;
      progressBar.style.width = `${percentage}%`;
    }

    if (currentLineSpan) {
      currentLineSpan.textContent = current;
    }

    if (totalLinesSpan) {
      totalLinesSpan.textContent = total;
    }
  }

  /**
   * Clear the karaoke display to placeholder state
   */
  clearKaraokeDisplay() {
    this.updateKaraokeDisplay('<p class="ll-placeholder-text">Load lyrics to begin practicing</p>');
  }

  /**
   * Reset all UI controls to initial state
   */
  resetControls() {
    this.clearKaraokeDisplay();
    this.updateProgress(0, 0);
    this.setButtonEnabled('playBtnId', false);
    this.setButtonEnabled('pauseBtnId', false);
    this.setButtonEnabled('resetBtnId', false);
  }

  /**
   * Get current UI state
   * @returns {Object} Object containing current UI state values
   */
  getState() {
    return {
      lyricsText: this.getLyricsText(),
      speed: this.getSpeed(),
      delay: this.getDelay(),
      playEnabled: !this.getElement('playBtnId')?.disabled,
      pauseEnabled: !this.getElement('pauseBtnId')?.disabled,
      resetEnabled: !this.getElement('resetBtnId')?.disabled
    };
  }
}

// CommonJS compatibility for Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UIComponents, createUIComponents };
}
