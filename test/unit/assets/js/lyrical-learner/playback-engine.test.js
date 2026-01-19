/**
 * @jest-environment jsdom
 */

const { PlaybackEngine } = require('../../../../../assets/js/lyrical-learner/playback-engine.js');

describe('PlaybackEngine', () => {
  let mockLyrics;
  let engine;

  beforeEach(() => {
    mockLyrics = [
      { text: 'Line 1', lineNumber: 1, isSection: false },
      { text: '[CHORUS]', lineNumber: 2, isSection: true },
      { text: 'Line 2', lineNumber: 3, isSection: false },
      { text: 'Line 3', lineNumber: 4, isSection: false }
    ];

    jest.useFakeTimers();
  });

  afterEach(() => {
    if (engine) {
      engine.stop();
    }
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('constructor', () => {
    test('should create engine with lyrics and default settings', () => {
      engine = new PlaybackEngine(mockLyrics);
      
      expect(engine).toBeInstanceOf(PlaybackEngine);
      expect(engine.getCurrentLineIndex()).toBe(-1);
      expect(engine.isPlaying()).toBe(false);
    });

    test('should create engine with custom settings', () => {
      engine = new PlaybackEngine(mockLyrics, {
        speed: 1.5,
        lineDelay: 3000
      });
      
      expect(engine).toBeInstanceOf(PlaybackEngine);
    });

    test('should throw error if no lyrics provided', () => {
      expect(() => new PlaybackEngine(null)).toThrow('Lyrics are required');
    });

    test('should throw error if lyrics array is empty', () => {
      expect(() => new PlaybackEngine([])).toThrow('Lyrics are required');
    });
  });

  describe('play', () => {
    test('should start playback from beginning', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      const lineChangedCallback = jest.fn();
      engine.on('lineChanged', lineChangedCallback);
      
      engine.play();
      
      expect(engine.isPlaying()).toBe(true);
      expect(lineChangedCallback).toHaveBeenCalledWith({
        line: mockLyrics[0],
        index: 0,
        total: 4
      });
    });

    test('should advance to next line after delay', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      const lineChangedCallback = jest.fn();
      engine.on('lineChanged', lineChangedCallback);
      
      engine.play();
      jest.advanceTimersByTime(1000);
      
      expect(lineChangedCallback).toHaveBeenCalledTimes(2);
      expect(lineChangedCallback).toHaveBeenLastCalledWith({
        line: mockLyrics[1],
        index: 1,
        total: 4
      });
    });

    test('should respect speed multiplier', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000, speed: 2.0 });
      const lineChangedCallback = jest.fn();
      engine.on('lineChanged', lineChangedCallback);
      
      engine.play();
      jest.advanceTimersByTime(500); // 1000ms / 2.0 speed = 500ms
      
      expect(lineChangedCallback).toHaveBeenCalledTimes(2);
    });

    test('should emit completed event when finished', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      const completedCallback = jest.fn();
      engine.on('completed', completedCallback);
      
      engine.play();
      jest.advanceTimersByTime(4000); // Advance through all lines
      
      expect(completedCallback).toHaveBeenCalled();
      expect(engine.isPlaying()).toBe(false);
    });

    test('should not restart if already playing', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      const lineChangedCallback = jest.fn();
      engine.on('lineChanged', lineChangedCallback);
      
      engine.play();
      engine.play(); // Try to play again
      
      expect(lineChangedCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('pause', () => {
    test('should pause playback', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      const pausedCallback = jest.fn();
      engine.on('paused', pausedCallback);
      
      engine.play();
      engine.pause();
      
      expect(engine.isPlaying()).toBe(false);
      expect(pausedCallback).toHaveBeenCalled();
    });

    test('should maintain current line index when paused', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      
      engine.play();
      jest.advanceTimersByTime(2000); // Advance to line 2
      const indexBeforePause = engine.getCurrentLineIndex();
      
      engine.pause();
      
      expect(engine.getCurrentLineIndex()).toBe(indexBeforePause);
    });

    test('should allow resuming from paused position', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      const lineChangedCallback = jest.fn();
      engine.on('lineChanged', lineChangedCallback);
      
      engine.play();
      jest.advanceTimersByTime(1000); // Advance to line 1
      engine.pause();
      
      lineChangedCallback.mockClear();
      engine.play(); // Resume
      jest.advanceTimersByTime(1000);
      
      expect(lineChangedCallback).toHaveBeenCalledWith({
        line: mockLyrics[2],
        index: 2,
        total: 4
      });
    });
  });

  describe('stop', () => {
    test('should stop playback and reset to beginning', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      const stoppedCallback = jest.fn();
      engine.on('stopped', stoppedCallback);
      
      engine.play();
      jest.advanceTimersByTime(2000);
      engine.stop();
      
      expect(engine.isPlaying()).toBe(false);
      expect(engine.getCurrentLineIndex()).toBe(-1);
      expect(stoppedCallback).toHaveBeenCalled();
    });

    test('should clear all timers when stopped', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      const lineChangedCallback = jest.fn();
      engine.on('lineChanged', lineChangedCallback);
      
      engine.play();
      engine.stop();
      
      lineChangedCallback.mockClear();
      jest.advanceTimersByTime(5000);
      
      expect(lineChangedCallback).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    test('should reset to beginning without stopping', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      
      engine.play();
      jest.advanceTimersByTime(2000);
      engine.reset();
      
      expect(engine.getCurrentLineIndex()).toBe(-1);
      expect(engine.isPlaying()).toBe(false);
    });
  });

  describe('updateSettings', () => {
    test('should update speed setting', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000, speed: 1.0 });
      
      engine.updateSettings({ speed: 2.0 });
      
      const lineChangedCallback = jest.fn();
      engine.on('lineChanged', lineChangedCallback);
      engine.play();
      
      jest.advanceTimersByTime(500); // Should advance at 2x speed
      expect(lineChangedCallback).toHaveBeenCalledTimes(2);
    });

    test('should update line delay setting', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      
      engine.updateSettings({ lineDelay: 2000 });
      
      const lineChangedCallback = jest.fn();
      engine.on('lineChanged', lineChangedCallback);
      engine.play();
      
      jest.advanceTimersByTime(2000);
      expect(lineChangedCallback).toHaveBeenCalledTimes(2);
    });

    test('should not affect current playback when settings updated while playing', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      engine.play();
      
      engine.updateSettings({ speed: 2.0 });
      
      // Current playback continues with old settings
      // New settings take effect on next play
      expect(engine.isPlaying()).toBe(true);
    });
  });

  describe('event system', () => {
    test('should allow multiple listeners for same event', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      engine.on('lineChanged', callback1);
      engine.on('lineChanged', callback2);
      
      engine.play();
      
      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    test('should allow removing event listeners', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      const callback = jest.fn();
      
      engine.on('lineChanged', callback);
      engine.off('lineChanged', callback);
      
      engine.play();
      
      expect(callback).not.toHaveBeenCalled();
    });

    test('should handle unknown event types gracefully', () => {
      engine = new PlaybackEngine(mockLyrics);
      
      expect(() => engine.on('unknownEvent', jest.fn())).not.toThrow();
    });
  });

  describe('getCurrentLine', () => {
    test('should return null when no line is active', () => {
      engine = new PlaybackEngine(mockLyrics);
      
      expect(engine.getCurrentLine()).toBeNull();
    });

    test('should return current line object', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      
      engine.play();
      jest.advanceTimersByTime(1000);
      
      expect(engine.getCurrentLine()).toEqual(mockLyrics[1]);
    });
  });

  describe('getTotalLines', () => {
    test('should return total number of lines', () => {
      engine = new PlaybackEngine(mockLyrics);
      
      expect(engine.getTotalLines()).toBe(4);
    });
  });

  describe('edge cases', () => {
    test('should handle single line lyrics', () => {
      const singleLine = [{ text: 'Only line', lineNumber: 1, isSection: false }];
      engine = new PlaybackEngine(singleLine, { lineDelay: 1000 });
      const completedCallback = jest.fn();
      engine.on('completed', completedCallback);
      
      engine.play();
      jest.advanceTimersByTime(1000);
      
      expect(completedCallback).toHaveBeenCalled();
    });

    test('should handle very fast speed', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000, speed: 2.0 });
      const lineChangedCallback = jest.fn();
      engine.on('lineChanged', lineChangedCallback);
      
      engine.play();
      jest.advanceTimersByTime(2000);
      
      expect(lineChangedCallback).toHaveBeenCalledTimes(4);
    });

    test('should handle very slow speed', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000, speed: 0.5 });
      const lineChangedCallback = jest.fn();
      engine.on('lineChanged', lineChangedCallback);
      
      engine.play();
      jest.advanceTimersByTime(2000); // 1000 / 0.5 = 2000ms per line
      
      expect(lineChangedCallback).toHaveBeenCalledTimes(2);
    });
  });

  describe('skipToNext', () => {
    test('should skip to next line when paused', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      const lineChangedCallback = jest.fn();
      engine.on('lineChanged', lineChangedCallback);
      
      engine.play();
      jest.advanceTimersByTime(100); // Advance to line 1
      engine.pause();
      
      engine.skipToNext();
      
      expect(engine.getCurrentLineIndex()).toBe(1);
      expect(lineChangedCallback).toHaveBeenCalledTimes(2);
    });

    test('should skip to next line during playback', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      const lineChangedCallback = jest.fn();
      engine.on('lineChanged', lineChangedCallback);
      
      engine.play();
      jest.advanceTimersByTime(100);
      
      engine.skipToNext();
      
      expect(engine.getCurrentLineIndex()).toBe(1);
      expect(engine.isPlaying()).toBe(true);
    });

    test('should emit completed when skipping past last line', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      const completedCallback = jest.fn();
      engine.on('completed', completedCallback);
      
      engine.play();
      jest.advanceTimersByTime(100);
      engine.skipToNext(); // line 1
      engine.skipToNext(); // line 2
      engine.skipToNext(); // line 3
      engine.skipToNext(); // past end
      
      expect(completedCallback).toHaveBeenCalled();
      expect(engine.isPlaying()).toBe(false);
    });

    test('should do nothing when not started', () => {
      engine = new PlaybackEngine(mockLyrics);
      const lineChangedCallback = jest.fn();
      engine.on('lineChanged', lineChangedCallback);
      
      engine.skipToNext();
      
      expect(engine.getCurrentLineIndex()).toBe(-1);
      expect(lineChangedCallback).not.toHaveBeenCalled();
    });
  });

  describe('skipToPrevious', () => {
    test('should skip to previous line when paused', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      const lineChangedCallback = jest.fn();
      engine.on('lineChanged', lineChangedCallback);
      
      engine.play();
      jest.advanceTimersByTime(100);
      engine.skipToNext();
      engine.pause();
      
      engine.skipToPrevious();
      
      expect(engine.getCurrentLineIndex()).toBe(0);
      expect(lineChangedCallback).toHaveBeenCalledWith(
        expect.objectContaining({ index: 0 })
      );
    });

    test('should skip to previous line during playback', () => {
      engine = new PlaybackEngine(mockLyrics, { lineDelay: 1000 });
      
      engine.play();
      jest.advanceTimersByTime(100);
      engine.skipToNext();
      
      engine.skipToPrevious();
      
      expect(engine.getCurrentLineIndex()).toBe(0);
      expect(engine.isPlaying()).toBe(true);
    });

    test('should stay at beginning when already at first line', () => {
      engine = new PlaybackEngine(mockLyrics);
      const lineChangedCallback = jest.fn();
      engine.on('lineChanged', lineChangedCallback);
      
      engine.play();
      jest.advanceTimersByTime(100);
      lineChangedCallback.mockClear();
      
      engine.skipToPrevious();
      
      expect(engine.getCurrentLineIndex()).toBe(0);
      expect(lineChangedCallback).not.toHaveBeenCalled();
    });

    test('should do nothing when not started', () => {
      engine = new PlaybackEngine(mockLyrics);
      const lineChangedCallback = jest.fn();
      engine.on('lineChanged', lineChangedCallback);
      
      engine.skipToPrevious();
      
      expect(engine.getCurrentLineIndex()).toBe(-1);
      expect(lineChangedCallback).not.toHaveBeenCalled();
    });
  });
});
