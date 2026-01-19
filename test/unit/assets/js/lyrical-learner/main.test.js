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

    test('should show placeholder message', () => {
      initializeLyricalLearner();
      
      // Load lyrics first
      const textarea = document.getElementById('lyricsInput');
      const loadBtn = document.getElementById('loadLyricsBtn');
      textarea.value = 'Test lyrics';
      loadBtn.click();
      
      const playBtn = document.getElementById('playBtn');
      const display = document.getElementById('karaokeDisplay');
      
      playBtn.click();
      
      expect(display.innerHTML).toContain('Playback functionality coming soon');
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
});
