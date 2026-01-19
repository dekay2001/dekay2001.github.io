/**
 * @file Playback Engine
 * @description Manages lyric playback timing and state
 */

/**
 * PlaybackEngine class - Manages timed playback of parsed lyrics
 * @class
 */
export class PlaybackEngine {
  /**
   * Creates a new PlaybackEngine instance
   * @param {Array} lyrics - Parsed lyrics array
   * @param {Object} settings - Playback settings
   * @param {number} settings.speed - Playback speed multiplier (default: 1.0)
   * @param {number} settings.lineDelay - Delay between lines in ms (default: 2000)
   * @public
   */
  constructor(lyrics, settings = {}) {
    if (!lyrics || lyrics.length === 0) {
      throw new Error('Lyrics are required');
    }

    this._lyrics = lyrics;
    this._settings = {
      speed: settings.speed || 1.0,
      lineDelay: settings.lineDelay || 2000,
      loop: settings.loop || false
    };

    this._currentLineIndex = -1;
    this._isPlaying = false;
    this._timer = null;
    this._eventListeners = new Map();
  }

  /**
   * Start or resume playback
   * @public
   */
  play() {
    if (this._isPlaying) {
      return; // Already playing
    }

    this._isPlaying = true;

    // If starting from beginning, show first line immediately
    if (this._currentLineIndex === -1) {
      this._currentLineIndex = 0;
      this._emitLineChanged();
    }

    // Schedule next line
    this._scheduleNextLine();
  }

  /**
   * Pause playback
   * @public
   */
  pause() {
    if (!this._isPlaying) {
      return;
    }

    this._isPlaying = false;
    this._clearTimer();
    this._emit('paused');
  }

  /**
   * Stop playback and reset to beginning
   * @public
   */
  stop() {
    this._isPlaying = false;
    this._clearTimer();
    this._currentLineIndex = -1;
    this._emit('stopped');
  }

  /**
   * Reset to beginning without changing play state
   * @public
   */
  reset() {
    this._clearTimer();
    this._currentLineIndex = -1;
    this._isPlaying = false;
  }

  /**
   * Update playback settings
   * @param {Object} settings - New settings to apply
   * @param {number} settings.speed - Playback speed multiplier
   * @param {number} settings.lineDelay - Delay between lines in ms
   * @param {boolean} settings.loop - Whether to loop playback
   * @public
   */
  updateSettings(settings) {
    if (settings.speed !== undefined) {
      this._settings.speed = settings.speed;
    }
    if (settings.lineDelay !== undefined) {
      this._settings.lineDelay = settings.lineDelay;
    }
    if (settings.loop !== undefined) {
      this._settings.loop = settings.loop;
    }
  }

  /**
   * Check if currently playing
   * @returns {boolean} True if playing
   * @public
   */
  isPlaying() {
    return this._isPlaying;
  }

  /**
   * Get current line index
   * @returns {number} Current line index (-1 if not started)
   * @public
   */
  getCurrentLineIndex() {
    return this._currentLineIndex;
  }

  /**
   * Get current line object
   * @returns {Object|null} Current line or null
   * @public
   */
  getCurrentLine() {
    if (this._currentLineIndex === -1 || this._currentLineIndex >= this._lyrics.length) {
      return null;
    }
    return this._lyrics[this._currentLineIndex];
  }

  /**
   * Get total number of lines
   * @returns {number} Total lines
   * @public
   */
  getTotalLines() {
    return this._lyrics.length;
  }

  /**
   * Register event listener
   * @param {string} eventName - Event name (lineChanged, completed, paused, stopped)
   * @param {Function} callback - Callback function
   * @public
   */
  on(eventName, callback) {
    if (!this._eventListeners.has(eventName)) {
      this._eventListeners.set(eventName, []);
    }
    this._eventListeners.get(eventName).push(callback);
  }

  /**
   * Remove event listener
   * @param {string} eventName - Event name
   * @param {Function} callback - Callback function to remove
   * @public
   */
  off(eventName, callback) {
    if (!this._eventListeners.has(eventName)) {
      return;
    }

    const listeners = this._eventListeners.get(eventName);
    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * Skip to next line
   * @public
   */
  skipToNext() {
    // Only allow skipping if we've started playback
    if (this._currentLineIndex < 0) {
      return;
    }

    const wasPlaying = this._isPlaying;
    this._clearTimer();

    // Advance to next line
    this._currentLineIndex++;

    // Check if we've reached the end
    if (this._currentLineIndex >= this._lyrics.length) {
      this._isPlaying = false;
      this._emit('completed');
      return;
    }

    // Emit line changed event
    this._emitLineChanged();

    // Resume playback if we were playing
    if (wasPlaying) {
      this._scheduleNextLine();
    }
  }

  /**
   * Skip to previous line
   * @public
   */
  skipToPrevious() {
    // Only allow skipping if we've started playback
    if (this._currentLineIndex < 0) {
      return;
    }

    // Can't go before the first line
    if (this._currentLineIndex === 0) {
      return;
    }

    const wasPlaying = this._isPlaying;
    this._clearTimer();

    // Go back to previous line
    this._currentLineIndex--;

    // Emit line changed event
    this._emitLineChanged();

    // Resume playback if we were playing
    if (wasPlaying) {
      this._scheduleNextLine();
    }
  }

  /**
   * Seek to a specific line index
   * @param {number} lineIndex - Target line index (0-based)
   * @public
   */
  seekToLine(lineIndex) {
    // Do nothing if not started
    if (this._currentLineIndex < 0) {
      return;
    }

    // Clear existing timer
    this._clearTimer();

    // Clamp index to valid range
    const clampedIndex = Math.max(0, Math.min(lineIndex, this._lyrics.length));

    // Check if seeking beyond last line
    if (clampedIndex >= this._lyrics.length) {
      this._isPlaying = false;
      this._emit('completed');
      return;
    }

    // Update current line
    this._currentLineIndex = clampedIndex;

    // Emit line changed event
    this._emitLineChanged();

    // Resume scheduling if playing
    if (this._isPlaying) {
      this._scheduleNextLine();
    }
  }

  // ============================================================================
  // PRIVATE IMPLEMENTATION
  // ============================================================================

  /**
   * Schedule the next line to display
   * @private
   */
  _scheduleNextLine() {
    if (!this._isPlaying) {
      return;
    }

    const adjustedDelay = this._settings.lineDelay / this._settings.speed;

    this._timer = setTimeout(() => {
      this._advanceLine();
    }, adjustedDelay);
  }

  /**
   * Advance to next line
   * @private
   */
  _advanceLine() {
    if (!this._isPlaying) {
      return;
    }

    this._currentLineIndex++;

    if (this._currentLineIndex >= this._lyrics.length) {
      // Reached end of lyrics
      if (this._settings.loop) {
        // Restart from beginning when loop enabled
        this._currentLineIndex = 0;
        this._emitLineChanged();
        this._scheduleNextLine();
      } else {
        // Stop playback when loop disabled
        this._isPlaying = false;
        this._emit('completed');
      }
      return;
    }

    this._emitLineChanged();
    this._scheduleNextLine();
  }

  /**
   * Emit line changed event
   * @private
   */
  _emitLineChanged() {
    const currentLine = this._lyrics[this._currentLineIndex];
    this._emit('lineChanged', {
      line: currentLine,
      index: this._currentLineIndex,
      total: this._lyrics.length
    });
  }

  /**
   * Emit an event to all registered listeners
   * @param {string} eventName - Event name
   * @param {*} data - Event data
   * @private
   */
  _emit(eventName, data) {
    if (!this._eventListeners.has(eventName)) {
      return;
    }

    const listeners = this._eventListeners.get(eventName);
    listeners.forEach(callback => callback(data));
  }

  /**
   * Clear the active timer
   * @private
   */
  _clearTimer() {
    if (this._timer !== null) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
}

// CommonJS compatibility for Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PlaybackEngine };
}
