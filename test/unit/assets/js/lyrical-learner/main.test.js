/**
 * @jest-environment jsdom
 */

const { initializeLyricalLearner, getUIComponents, cleanup } = require('../../../../../assets/js/lyrical-learner/main.js');

describe('Lyrical Learner Main', () => {
  beforeEach(() => {
    // Set up complete mock DOM
    document.body.innerHTML = `
      <textarea id="lyricsInput"></textarea>
      <button id="loadLyricsBtn">Load</button>
      <div id="karaokeDisplay"></div>
      <input type="range" id="speedSlider" value="1.0" />
      <span id="speedValue">1.0</span>
      <input type="range" id="delaySlider" value="2.0" />
      <span id="delayValue">2.0</span>
      <button id="playBtn">Play</button>
      <button id="pauseBtn">Pause</button>
      <button id="resetBtn">Reset</button>
      <button id="skipNextBtn">Next</button>
      <button id="skipPrevBtn">Previous</button>
      <button id="loopBtn">Loop</button>
      <div id="progressBar"></div>
      <span id="currentLine">0</span>
      <span id="totalLines">0</span>
    `;
    
    // Mock console methods
    console.log = jest.fn();
  });

  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  describe('initializeLyricalLearner', () => {
    test('should initialize UI components', () => {
      initializeLyricalLearner();
      
      const uiComponents = getUIComponents();
      expect(uiComponents).toBeTruthy();
    });

    test('should set up event listeners', () => {
      initializeLyricalLearner();
      
      const speedSlider = document.getElementById('speedSlider');
      const speedValue = document.getElementById('speedValue');
      
      // Trigger speed slider change
      speedSlider.value = '1.5';
      speedSlider.dispatchEvent(new Event('input'));
      
      expect(speedValue.textContent).toBe('1.5');
    });

    test('should reset controls to initial state', () => {
      initializeLyricalLearner();
      
      const display = document.getElementById('karaokeDisplay');
      const playBtn = document.getElementById('playBtn');
      
      expect(display.innerHTML).toContain('Load lyrics to begin practicing');
      expect(playBtn.disabled).toBe(true);
    });
  });

  describe('Speed slider interaction', () => {
    test('should update speed display when slider changes', () => {
      initializeLyricalLearner();
      
      const speedSlider = document.getElementById('speedSlider');
      const speedValue = document.getElementById('speedValue');
      
      speedSlider.value = '0.8';
      speedSlider.dispatchEvent(new Event('input'));
      
      expect(speedValue.textContent).toBe('0.8');
    });
  });

  describe('Delay slider interaction', () => {
    test('should update delay display when slider changes', () => {
      initializeLyricalLearner();
      
      const delaySlider = document.getElementById('delaySlider');
      const delayValue = document.getElementById('delayValue');
      
      delaySlider.value = '4.5';
      delaySlider.dispatchEvent(new Event('input'));
      
      expect(delayValue.textContent).toBe('4.5');
    });
  });

  describe('Load lyrics button', () => {
    test('should handle empty lyrics', () => {
      initializeLyricalLearner();
      
      const loadBtn = document.getElementById('loadLyricsBtn');
      const display = document.getElementById('karaokeDisplay');
      
      loadBtn.click();
      
      expect(display.innerHTML).toContain('Please paste lyrics before loading');
    });

    test('should load lyrics and enable controls', () => {
      initializeLyricalLearner();
      
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');
      const resetBtn = document.getElementById('resetBtn');
      const display = document.getElementById('karaokeDisplay');
      
      textarea.value = 'Line 1\nLine 2\nLine 3';
      loadBtn.click();
      
      expect(display.innerHTML).toContain('Lyrics loaded: 3 lines ready');
      expect(playBtn.disabled).toBe(false);
      expect(resetBtn.disabled).toBe(false);
    });

    test('should update progress counter', () => {
      initializeLyricalLearner();
      
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const totalLines = document.getElementById('totalLines');
      
      textarea.value = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';
      loadBtn.click();
      
      expect(totalLines.textContent).toBe('5');
    });

    test('should filter empty lines', () => {
      initializeLyricalLearner();
      
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const display = document.getElementById('karaokeDisplay');
      
      textarea.value = 'Line 1\n\n\nLine 2\n\nLine 3\n';
      loadBtn.click();
      
      expect(display.innerHTML).toContain('Lyrics loaded: 3 lines ready');
    });
  });

  describe('Play button', () => {
    test('should toggle button states', () => {
      initializeLyricalLearner();
      
      // Load lyrics first
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      textarea.value = 'Test lyrics';
      loadBtn.click();
      
      const playBtn = document.getElementById('playBtn');
      const pauseBtn = document.getElementById('pauseBtn');
      
      playBtn.click();
      
      expect(playBtn.disabled).toBe(true);
      expect(pauseBtn.disabled).toBe(false);
    });
  });

  describe('Pause button', () => {
    test('should toggle button states', () => {
      initializeLyricalLearner();
      
      // Set up for pause
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      textarea.value = 'Test lyrics';
      loadBtn.click();
      
      const playBtn = document.getElementById('playBtn');
      const pauseBtn = document.getElementById('pauseBtn');
      
      playBtn.click();
      pauseBtn.click();
      
      expect(playBtn.disabled).toBe(false);
      expect(pauseBtn.disabled).toBe(true);
    });
  });

  describe('Reset button', () => {
    test('should reset UI to initial state', () => {
      initializeLyricalLearner();
      
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const resetBtn = document.getElementById('resetBtn');
      
      // Load lyrics
      textarea.value = 'Test lyrics';
      loadBtn.click();
      
      // Reset
      resetBtn.click();
      
      const display = document.getElementById('karaokeDisplay');
      const playBtn = document.getElementById('playBtn');
      
      expect(textarea.value).toBe('');
      expect(display.innerHTML).toContain('Load lyrics to begin practicing');
      expect(playBtn.disabled).toBe(true);
    });
  });

  describe('getUIComponents', () => {
    test('should return null before initialization', () => {
      const components = getUIComponents();
      
      expect(components).toBeNull();
    });

    test('should return UI components after initialization', () => {
      initializeLyricalLearner();
      
      const components = getUIComponents();
      
      expect(components).toBeTruthy();
      expect(components.getElement).toBeDefined();
    });
  });

  describe('cleanup', () => {
    test('should remove event listeners', () => {
      initializeLyricalLearner();
      
      const speedSlider = document.getElementById('speedSlider');
      const speedValue = document.getElementById('speedValue');
      
      // Verify listener works
      speedSlider.value = '1.5';
      speedSlider.dispatchEvent(new Event('input'));
      expect(speedValue.textContent).toBe('1.5');
      
      // Cleanup
      cleanup();
      
      // Listener should be removed
      const components = getUIComponents();
      expect(components).toBeNull();
    });

    test('should handle cleanup when not initialized', () => {
      expect(() => cleanup()).not.toThrow();
    });
  });

  describe('getParsedLyrics', () => {
    test('should return null when no lyrics loaded', () => {
      const { getParsedLyrics } = require('../../../../../assets/js/lyrical-learner/main.js');
      initializeLyricalLearner();
      
      const parsed = getParsedLyrics();
      
      expect(parsed).toBeNull();
    });

    test('should return parsed lyrics after loading', () => {
      const { getParsedLyrics } = require('../../../../../assets/js/lyrical-learner/main.js');
      initializeLyricalLearner();
      
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      
      textarea.value = 'Line 1\nLine 2\n[CHORUS]\nLine 3';
      loadBtn.click();
      
      const parsed = getParsedLyrics();
      
      expect(parsed).toHaveLength(4);
      expect(parsed[0].text).toBe('Line 1');
      expect(parsed[2].isSection).toBe(true);
      expect(parsed[2].text).toBe('[CHORUS]');
    });

    test('should handle empty lines during parsing', () => {
      const { getParsedLyrics } = require('../../../../../assets/js/lyrical-learner/main.js');
      initializeLyricalLearner();
      
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      
      textarea.value = 'Line 1\n\n\nLine 2\n\nLine 3';
      loadBtn.click();
      
      const parsed = getParsedLyrics();
      
      expect(parsed).toHaveLength(3);
    });
  });

  describe('playback integration', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.clearAllTimers();
      jest.useRealTimers();
    });

    test('should create playback engine when play button clicked', () => {
      const { getPlaybackEngine } = require('../../../../../assets/js/lyrical-learner/main.js');
      initializeLyricalLearner();
      
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');
      
      textarea.value = 'Line 1\nLine 2\nLine 3';
      loadBtn.click();
      playBtn.click();
      
      const engine = getPlaybackEngine();
      expect(engine).toBeTruthy();
      expect(engine.isPlaying()).toBe(true);
    });

    test('should display first line when playback starts', () => {
      initializeLyricalLearner();
      
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');
      const display = document.getElementById('karaokeDisplay');
      
      textarea.value = 'Line 1\nLine 2\nLine 3';
      loadBtn.click();
      playBtn.click();
      
      expect(display.textContent).toContain('Line 1');
    });

    test('should advance to next line after delay', () => {
      initializeLyricalLearner();
      
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');
      const display = document.getElementById('karaokeDisplay');
      
      textarea.value = 'Line 1\nLine 2\nLine 3';
      loadBtn.click();
      playBtn.click();
      
      jest.advanceTimersByTime(2000); // Default delay
      
      expect(display.textContent).toContain('Line 2');
    });

    test('should update progress counter during playback', () => {
      initializeLyricalLearner();
      
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');
      const currentLine = document.getElementById('currentLine');
      
      textarea.value = 'Line 1\nLine 2\nLine 3';
      loadBtn.click();
      playBtn.click();
      
      expect(currentLine.textContent).toBe('1');
      
      jest.advanceTimersByTime(2000);
      expect(currentLine.textContent).toBe('2');
    });

    test('should pause playback when pause button clicked', () => {
      const { getPlaybackEngine } = require('../../../../../assets/js/lyrical-learner/main.js');
      initializeLyricalLearner();
      
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');
      const pauseBtn = document.getElementById('pauseBtn');
      
      textarea.value = 'Line 1\nLine 2\nLine 3';
      loadBtn.click();
      playBtn.click();
      pauseBtn.click();
      
      const engine = getPlaybackEngine();
      expect(engine.isPlaying()).toBe(false);
      expect(playBtn.disabled).toBe(false);
      expect(pauseBtn.disabled).toBe(true);
    });

    test('should resume from current position after pause', () => {
      initializeLyricalLearner();
      
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');
      const pauseBtn = document.getElementById('pauseBtn');
      const display = document.getElementById('karaokeDisplay');
      
      textarea.value = 'Line 1\nLine 2\nLine 3';
      loadBtn.click();
      playBtn.click();
      
      jest.advanceTimersByTime(2000); // Advance to line 2
      expect(display.textContent).toContain('Line 2');
      
      pauseBtn.click();
      playBtn.click(); // Resume
      
      jest.advanceTimersByTime(2000);
      expect(display.textContent).toContain('Line 3');
    });

    test('should stop and reset playback when reset button clicked', () => {
      const { getPlaybackEngine } = require('../../../../../assets/js/lyrical-learner/main.js');
      initializeLyricalLearner();
      
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');
      const resetBtn = document.getElementById('resetBtn');
      const display = document.getElementById('karaokeDisplay');
      
      textarea.value = 'Line 1\nLine 2\nLine 3';
      loadBtn.click();
      playBtn.click();
      
      jest.advanceTimersByTime(2000);
      resetBtn.click();
      
      expect(display.innerHTML).toContain('Load lyrics to begin practicing');
      expect(playBtn.disabled).toBe(true);
      
      const engine = getPlaybackEngine();
      expect(engine).toBeNull();
    });

    test('should apply speed setting from slider', () => {
      initializeLyricalLearner();
      
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');
      const speedSlider = document.getElementById('speedSlider');
      const display = document.getElementById('karaokeDisplay');
      
      textarea.value = 'Line 1\nLine 2\nLine 3';
      speedSlider.value = '2.0';
      speedSlider.dispatchEvent(new Event('input'));
      
      loadBtn.click();
      playBtn.click();
      
      jest.advanceTimersByTime(1000); // 2000ms / 2.0 speed = 1000ms
      
      expect(display.textContent).toContain('Line 2');
    });

    test('should apply delay setting from slider', () => {
      initializeLyricalLearner();
      
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');
      const delaySlider = document.getElementById('delaySlider');
      const display = document.getElementById('karaokeDisplay');
      
      textarea.value = 'Line 1\nLine 2\nLine 3';
      delaySlider.value = '3.0';
      delaySlider.dispatchEvent(new Event('input'));
      
      loadBtn.click();
      playBtn.click();
      
      jest.advanceTimersByTime(3000);
      
      expect(display.textContent).toContain('Line 2');
    });

    test('should show completion message when lyrics finish', () => {
      initializeLyricalLearner();
      
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');
      const pauseBtn = document.getElementById('pauseBtn');
      const display = document.getElementById('karaokeDisplay');
      
      textarea.value = 'Line 1\nLine 2';
      loadBtn.click();
      playBtn.click();
      
      jest.advanceTimersByTime(4000); // Enough time for both lines
      
      expect(display.textContent).toContain('completed');
      expect(playBtn.disabled).toBe(true);
      expect(pauseBtn.disabled).toBe(true);
    });
  });

  describe('skip functionality', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should skip to next line when skip-next button clicked', () => {
      initializeLyricalLearner();
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');
      const skipNextBtn = document.getElementById('skipNextBtn');
      const display = document.getElementById('karaokeDisplay');

      textarea.value = 'Line 1\nLine 2\nLine 3';
      loadBtn.click();
      playBtn.click();
      jest.advanceTimersByTime(100);

      skipNextBtn.click();
      // Skip is synchronous, no timer advance needed

      expect(display.textContent).toContain('Line 2');
    });

    test('should skip to previous line when skip-prev button clicked', () => {
      initializeLyricalLearner();
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');
      const skipNextBtn = document.getElementById('skipNextBtn');
      const skipPrevBtn = document.getElementById('skipPrevBtn');
      const display = document.getElementById('karaokeDisplay');

      textarea.value = 'Line 1\nLine 2\nLine 3';
      loadBtn.click();
      playBtn.click();
      jest.advanceTimersByTime(100);
      skipNextBtn.click();

      skipPrevBtn.click();

      expect(display.textContent).toContain('Line 1');
    });
  });

  describe('keyboard shortcuts', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should play/pause with spacebar', () => {
      initializeLyricalLearner();
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');

      textarea.value = 'Line 1\nLine 2';
      loadBtn.click();

      // Press spacebar to play
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      document.dispatchEvent(spaceEvent);

      expect(playBtn.disabled).toBe(true);

      // Press spacebar again to pause
      document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

      expect(playBtn.disabled).toBe(false);
    });

    test('should skip to next line with right arrow', () => {
      initializeLyricalLearner();
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');
      const display = document.getElementById('karaokeDisplay');

      textarea.value = 'Line 1\nLine 2\nLine 3';
      loadBtn.click();
      playBtn.click();
      jest.advanceTimersByTime(100);

      const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      document.dispatchEvent(rightArrowEvent);

      expect(display.textContent).toContain('Line 2');
    });

    test('should skip to previous line with left arrow', () => {
      initializeLyricalLearner();
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');
      const display = document.getElementById('karaokeDisplay');

      textarea.value = 'Line 1\nLine 2\nLine 3';
      loadBtn.click();
      playBtn.click();
      jest.advanceTimersByTime(100);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      const leftArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      document.dispatchEvent(leftArrowEvent);

      expect(display.textContent).toContain('Line 1');
    });

    test('should reset with escape key', () => {
      initializeLyricalLearner();
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');
      const display = document.getElementById('karaokeDisplay');

      textarea.value = 'Line 1\nLine 2';
      loadBtn.click();
      playBtn.click();
      jest.advanceTimersByTime(100);

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);

      expect(display.textContent).toContain('Load lyrics to begin');
      expect(playBtn.disabled).toBe(false);
    });

    test('should not trigger shortcuts when typing in textarea', () => {
      initializeLyricalLearner();
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');

      textarea.value = 'Line 1\nLine 2';
      loadBtn.click();
      playBtn.click();
      jest.advanceTimersByTime(100);

      // Focus textarea and press spacebar
      textarea.focus();
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', target: textarea });
      Object.defineProperty(spaceEvent, 'target', { value: textarea, enumerable: true });
      document.dispatchEvent(spaceEvent);

      // Should still be playing
      expect(playBtn.disabled).toBe(true);
    });
  });

  describe('loop functionality', () => {
    test('should toggle loop mode with loop button', () => {
      initializeLyricalLearner();
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const loopBtn = document.getElementById('loopBtn');

      textarea.value = 'Line 1\nLine 2';
      loadBtn.click();

      // Initially not looping
      expect(loopBtn.classList.contains('active')).toBe(false);

      // Click to enable loop
      loopBtn.click();
      expect(loopBtn.classList.contains('active')).toBe(true);

      // Click to disable loop
      loopBtn.click();
      expect(loopBtn.classList.contains('active')).toBe(false);
    });

    test('should auto-restart playback when loop enabled', () => {
      initializeLyricalLearner();
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      const playBtn = document.getElementById('playBtn');
      const loopBtn = document.getElementById('loopBtn');
      const display = document.getElementById('karaokeDisplay');

      textarea.value = 'Line 1\nLine 2';
      loadBtn.click();
      
      // Enable loop
      loopBtn.click();
      
      // Start playback
      playBtn.click();
      
      // Advance past both lines (should restart)
      jest.advanceTimersByTime(5000);

      // Should still be playing and showing content
      expect(playBtn.disabled).toBe(true);
      expect(display.textContent).not.toContain('Load lyrics to begin');
    });
  });
});
