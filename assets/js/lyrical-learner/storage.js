/**
 * @file LocalStorage Manager
 * @description Handles saving and loading lyrics and settings to browser localStorage
 */

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEYS = {
    LYRICS: 'lyricalLearner_lyrics',
    SPEED: 'lyricalLearner_speed',
    DELAY: 'lyricalLearner_delay',
    LOOP: 'lyricalLearner_loop'
};

// ============================================================================
// PUBLIC INTERFACE
// ============================================================================

/**
 * Save lyrics to localStorage
 * @param {string} lyrics - The lyrics text to save
 * @returns {boolean} True if save succeeded, false otherwise
 * @public
 */
export function saveLyrics(lyrics) {
    try {
        localStorage.setItem(STORAGE_KEYS.LYRICS, lyrics);
        return true;
    } catch (error) {
        console.error('Failed to save lyrics:', error);
        return false;
    }
}

/**
 * Load lyrics from localStorage
 * @returns {string|null} The saved lyrics or null if not found
 * @public
 */
export function loadLyrics() {
    try {
        return localStorage.getItem(STORAGE_KEYS.LYRICS);
    } catch (error) {
        console.error('Failed to load lyrics:', error);
        return null;
    }
}

/**
 * Clear saved lyrics from localStorage
 * @returns {boolean} True if clear succeeded, false otherwise
 * @public
 */
export function clearLyrics() {
    try {
        localStorage.removeItem(STORAGE_KEYS.LYRICS);
        return true;
    } catch (error) {
        console.error('Failed to clear lyrics:', error);
        return false;
    }
}

/**
 * Save playback settings to localStorage
 * @param {Object} settings - Settings object
 * @param {number} [settings.speed] - Playback speed (0.5 - 2.0)
 * @param {number} [settings.delay] - Line delay in seconds (0.5 - 5.0)
 * @param {boolean} [settings.loop] - Loop mode enabled
 * @returns {boolean} True if save succeeded, false otherwise
 * @public
 */
export function saveSettings(settings) {
    try {
        if (settings.speed !== undefined) {
            localStorage.setItem(STORAGE_KEYS.SPEED, settings.speed.toString());
        }
        if (settings.delay !== undefined) {
            localStorage.setItem(STORAGE_KEYS.DELAY, settings.delay.toString());
        }
        if (settings.loop !== undefined) {
            localStorage.setItem(STORAGE_KEYS.LOOP, settings.loop.toString());
        }
        return true;
    } catch (error) {
        console.error('Failed to save settings:', error);
        return false;
    }
}

/**
 * Load playback settings from localStorage
 * @returns {{speed: number, delay: number, loop: boolean}} Settings object with saved values
 *          or defaults (speed: 1.0, delay: 2.0, loop: false)
 * @public
 */
export function loadSettings() {
    try {
        const speed = localStorage.getItem(STORAGE_KEYS.SPEED);
        const delay = localStorage.getItem(STORAGE_KEYS.DELAY);
        const loop = localStorage.getItem(STORAGE_KEYS.LOOP);

        return {
            speed: speed ? parseFloat(speed) : 1.0,
            delay: delay ? parseFloat(delay) : 2.0,
            loop: loop === 'true'
        };
    } catch (error) {
        console.error('Failed to load settings:', error);
        return { speed: 1.0, delay: 2.0, loop: false };
    }
}

/**
 * Clear all saved data from localStorage
 * @returns {boolean} True if clear succeeded, false otherwise
 * @public
 */
export function clearAllData() {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        return true;
    } catch (error) {
        console.error('Failed to clear all data:', error);
        return false;
    }
}

/**
 * Check if there are any saved lyrics
 * @returns {boolean} True if lyrics exist in storage
 * @public
 */
export function hasSavedLyrics() {
    try {
        const lyrics = localStorage.getItem(STORAGE_KEYS.LYRICS);
        return lyrics !== null && lyrics.trim().length > 0;
    } catch (error) {
        return false;
    }
}
