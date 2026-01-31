/**
 * @jest-environment jsdom
 */

import {
    saveLyrics,
    loadLyrics,
    clearLyrics,
    saveSettings,
    loadSettings,
    clearAllData,
    hasSavedLyrics
} from '../../../../../assets/js/lyrical-learner/storage.js';

describe('Lyrical Learner Storage', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        // Restore all mocks
        jest.restoreAllMocks();
    });

    describe('saveLyrics', () => {
        test('should save lyrics to localStorage', () => {
            const lyrics = 'Test lyrics\nLine 2\nLine 3';
            const result = saveLyrics(lyrics);
            
            expect(result).toBe(true);
            expect(localStorage.getItem('lyricalLearner_lyrics')).toBe(lyrics);
        });

        test('should handle localStorage errors', () => {
            const consoleError = jest.spyOn(console, 'error').mockImplementation();
            jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
                throw new Error('Storage full');
            });

            const result = saveLyrics('test');
            
            expect(result).toBe(false);
            expect(consoleError).toHaveBeenCalled();
            
            consoleError.mockRestore();
        });
    });

    describe('loadLyrics', () => {
        test('should load saved lyrics from localStorage', () => {
            const lyrics = 'Saved lyrics\nLine 2';
            localStorage.setItem('lyricalLearner_lyrics', lyrics);
            
            const loaded = loadLyrics();
            
            expect(loaded).toBe(lyrics);
        });

        test('should return null when no lyrics saved', () => {
            const loaded = loadLyrics();
            
            expect(loaded).toBeNull();
        });

        test('should handle localStorage errors', () => {
            const consoleError = jest.spyOn(console, 'error').mockImplementation();
            jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
                throw new Error('Storage error');
            });

            const result = loadLyrics();
            
            expect(result).toBeNull();
            expect(consoleError).toHaveBeenCalled();
            
            consoleError.mockRestore();
        });
    });

    describe('clearLyrics', () => {
        test('should remove lyrics from localStorage', () => {
            localStorage.setItem('lyricalLearner_lyrics', 'test lyrics');
            
            const result = clearLyrics();
            
            expect(result).toBe(true);
            expect(localStorage.getItem('lyricalLearner_lyrics')).toBeNull();
        });

        test('should handle localStorage errors', () => {
            const consoleError = jest.spyOn(console, 'error').mockImplementation();
            jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
                throw new Error('Storage error');
            });

            const result = clearLyrics();
            
            expect(result).toBe(false);
            expect(consoleError).toHaveBeenCalled();
            
            consoleError.mockRestore();
        });
    });

    describe('saveSettings', () => {
        test('should save speed setting', () => {
            const result = saveSettings({ speed: 1.5 });
            
            expect(result).toBe(true);
            expect(localStorage.getItem('lyricalLearner_speed')).toBe('1.5');
        });

        test('should save delay setting', () => {
            const result = saveSettings({ delay: 3.0 });
            
            expect(result).toBe(true);
            expect(localStorage.getItem('lyricalLearner_delay')).toBe('3');
        });

        test('should save loop setting', () => {
            const result = saveSettings({ loop: true });
            
            expect(result).toBe(true);
            expect(localStorage.getItem('lyricalLearner_loop')).toBe('true');
        });

        test('should save multiple settings at once', () => {
            const result = saveSettings({ speed: 1.5, delay: 2.5, loop: true });
            
            expect(result).toBe(true);
            expect(localStorage.getItem('lyricalLearner_speed')).toBe('1.5');
            expect(localStorage.getItem('lyricalLearner_delay')).toBe('2.5');
            expect(localStorage.getItem('lyricalLearner_loop')).toBe('true');
        });

        test('should handle partial settings', () => {
            saveSettings({ speed: 1.0, delay: 2.0 });
            const result = saveSettings({ speed: 1.5 });
            
            expect(result).toBe(true);
            expect(localStorage.getItem('lyricalLearner_speed')).toBe('1.5');
            expect(localStorage.getItem('lyricalLearner_delay')).toBe('2');
        });
    });

    describe('loadSettings', () => {
        test('should load saved settings', () => {
            localStorage.setItem('lyricalLearner_speed', '1.5');
            localStorage.setItem('lyricalLearner_delay', '3.0');
            localStorage.setItem('lyricalLearner_loop', 'true');
            
            const settings = loadSettings();
            
            expect(settings.speed).toBe(1.5);
            expect(settings.delay).toBe(3.0);
            expect(settings.loop).toBe(true);
        });

        test('should return defaults when no settings saved', () => {
            const settings = loadSettings();
            
            expect(settings.speed).toBe(1.0);
            expect(settings.delay).toBe(2.0);
            expect(settings.loop).toBe(false);
        });

        test('should handle partial saved settings', () => {
            localStorage.setItem('lyricalLearner_speed', '1.5');
            
            const settings = loadSettings();
            
            expect(settings.speed).toBe(1.5);
            expect(settings.delay).toBe(2.0);
            expect(settings.loop).toBe(false);
        });

        test('should handle invalid saved values', () => {
            localStorage.setItem('lyricalLearner_speed', 'invalid');
            
            const settings = loadSettings();
            
            expect(isNaN(settings.speed)).toBe(true);
        });
    });

    describe('clearAllData', () => {
        test('should remove all saved data', () => {
            localStorage.setItem('lyricalLearner_lyrics', 'test');
            localStorage.setItem('lyricalLearner_speed', '1.5');
            localStorage.setItem('lyricalLearner_delay', '3.0');
            localStorage.setItem('lyricalLearner_loop', 'true');
            
            const result = clearAllData();
            
            expect(result).toBe(true);
            expect(localStorage.getItem('lyricalLearner_lyrics')).toBeNull();
            expect(localStorage.getItem('lyricalLearner_speed')).toBeNull();
            expect(localStorage.getItem('lyricalLearner_delay')).toBeNull();
            expect(localStorage.getItem('lyricalLearner_loop')).toBeNull();
        });
    });

    describe('hasSavedLyrics', () => {
        test('should return true when lyrics exist', () => {
            localStorage.setItem('lyricalLearner_lyrics', 'test lyrics');
            
            expect(hasSavedLyrics()).toBe(true);
        });

        test('should return false when no lyrics', () => {
            expect(hasSavedLyrics()).toBe(false);
        });

        test('should return false for empty lyrics', () => {
            localStorage.setItem('lyricalLearner_lyrics', '   ');
            
            expect(hasSavedLyrics()).toBe(false);
        });

        test('should handle localStorage errors', () => {
            jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
                throw new Error('Storage error');
            });

            expect(hasSavedLyrics()).toBe(false);
        });
    });
});
