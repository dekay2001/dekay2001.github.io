/**
 * @jest-environment jsdom
 */

const { UIComponents, createUIComponents } = require('../../../../../assets/js/lyrical-learner/ui-components.js');

describe('UIComponents', () => {
  let mockConfig;
  let uiComponents;

  beforeEach(() => {
    // Set up mock DOM
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

    mockConfig = {
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

    uiComponents = new UIComponents(mockConfig);
  });

  afterEach(() => {
    uiComponents.removeAllEventListeners();
  });

  describe('constructor', () => {
    test('should create UIComponents instance with config', () => {
      expect(uiComponents).toBeInstanceOf(UIComponents);
      expect(uiComponents.config).toEqual(mockConfig);
    });
  });

  describe('initializeElements', () => {
    test('should find and store all UI elements', () => {
      const result = uiComponents.initializeElements();
      
      expect(result).toBe(true);
      expect(uiComponents.getElement('lyricsInputId')).toBeTruthy();
      expect(uiComponents.getElement('playBtnId')).toBeTruthy();
    });

    test('should return false if element is missing', () => {
      document.getElementById('playBtn').remove();
      
      const result = uiComponents.initializeElements();
      
      expect(result).toBe(false);
    });
  });

  describe('getElement', () => {
    test('should return element by key', () => {
      uiComponents.initializeElements();
      
      const element = uiComponents.getElement('lyricsInputId');
      
      expect(element).toBe(document.getElementById('lyricsInput'));
    });

    test('should return null for non-existent element', () => {
      const element = uiComponents.getElement('nonExistent');
      
      expect(element).toBeNull();
    });
  });

  describe('getAllElements', () => {
    test('should return all elements object', () => {
      uiComponents.initializeElements();
      
      const elements = uiComponents.getAllElements();
      
      expect(elements.lyricsInputId).toBeTruthy();
      expect(elements.playBtnId).toBeTruthy();
      expect(Object.keys(elements).length).toBeGreaterThan(0);
    });
  });

  describe('addEventListener', () => {
    test('should attach event listener to element', () => {
      uiComponents.initializeElements();
      const handler = jest.fn();
      
      const result = uiComponents.addEventListener('playBtnId', 'click', handler);
      
      expect(result).toBe(true);
      
      document.getElementById('playBtn').click();
      expect(handler).toHaveBeenCalledTimes(1);
    });

    test('should return false if element not found', () => {
      const handler = jest.fn();
      
      const result = uiComponents.addEventListener('nonExistent', 'click', handler);
      
      expect(result).toBe(false);
    });
  });

  describe('getLyricsText', () => {
    test('should return textarea value', () => {
      uiComponents.initializeElements();
      const textarea = document.getElementById('lyricsInput');
      textarea.value = 'Test lyrics';
      
      const text = uiComponents.getLyricsText();
      
      expect(text).toBe('Test lyrics');
    });
  });

  describe('setLyricsText', () => {
    test('should set textarea value', () => {
      uiComponents.initializeElements();
      
      uiComponents.setLyricsText('New lyrics');
      
      const textarea = document.getElementById('lyricsInput');
      expect(textarea.value).toBe('New lyrics');
    });
  });

  describe('getSpeed', () => {
    test('should return speed slider value', () => {
      uiComponents.initializeElements();
      document.getElementById('speedSlider').value = '1.5';
      
      const speed = uiComponents.getSpeed();
      
      expect(speed).toBe(1.5);
    });

    test('should return default 1.0 if element not found', () => {
      const speed = uiComponents.getSpeed();
      
      expect(speed).toBe(1.0);
    });
  });

  describe('getDelay', () => {
    test('should return delay slider value', () => {
      uiComponents.initializeElements();
      document.getElementById('delaySlider').value = '3.5';
      
      const delay = uiComponents.getDelay();
      
      expect(delay).toBe(3.5);
    });

    test('should return default 2.0 if element not found', () => {
      const delay = uiComponents.getDelay();
      
      expect(delay).toBe(2.0);
    });
  });

  describe('updateSpeedDisplay', () => {
    test('should update speed display value', () => {
      uiComponents.initializeElements();
      
      uiComponents.updateSpeedDisplay(1.7);
      
      const span = document.getElementById('speedValue');
      expect(span.textContent).toBe('1.7');
    });
  });

  describe('updateDelayDisplay', () => {
    test('should update delay display value', () => {
      uiComponents.initializeElements();
      
      uiComponents.updateDelayDisplay(3.0);
      
      const span = document.getElementById('delayValue');
      expect(span.textContent).toBe('3.0');
    });
  });

  describe('setButtonEnabled', () => {
    test('should enable button', () => {
      uiComponents.initializeElements();
      const button = document.getElementById('playBtn');
      button.disabled = true;
      
      uiComponents.setButtonEnabled('playBtnId', true);
      
      expect(button.disabled).toBe(false);
    });

    test('should disable button', () => {
      uiComponents.initializeElements();
      const button = document.getElementById('playBtn');
      
      uiComponents.setButtonEnabled('playBtnId', false);
      
      expect(button.disabled).toBe(true);
    });
  });

  describe('updateKaraokeDisplay', () => {
    test('should update display with HTML content', () => {
      uiComponents.initializeElements();
      
      uiComponents.updateKaraokeDisplay('<p>Test content</p>');
      
      const display = document.getElementById('karaokeDisplay');
      expect(display.innerHTML).toBe('<p>Test content</p>');
    });
  });

  describe('updateProgress', () => {
    test('should update progress bar and counters', () => {
      uiComponents.initializeElements();
      
      uiComponents.updateProgress(5, 10);
      
      const progressBar = document.getElementById('progressBar');
      const currentLine = document.getElementById('currentLine');
      const totalLines = document.getElementById('totalLines');
      
      expect(progressBar.style.width).toBe('50%');
      expect(currentLine.textContent).toBe('5');
      expect(totalLines.textContent).toBe('10');
    });

    test('should handle zero total lines', () => {
      uiComponents.initializeElements();
      
      uiComponents.updateProgress(0, 0);
      
      const progressBar = document.getElementById('progressBar');
      expect(progressBar.style.width).toBe('0%');
    });
  });

  describe('clearKaraokeDisplay', () => {
    test('should reset display to placeholder', () => {
      uiComponents.initializeElements();
      
      uiComponents.clearKaraokeDisplay();
      
      const display = document.getElementById('karaokeDisplay');
      expect(display.innerHTML).toContain('ll-placeholder-text');
      expect(display.innerHTML).toContain('Load lyrics to begin practicing');
    });
  });

  describe('resetControls', () => {
    test('should reset all controls to initial state', () => {
      uiComponents.initializeElements();
      
      uiComponents.resetControls();
      
      const display = document.getElementById('karaokeDisplay');
      const playBtn = document.getElementById('playBtn');
      const pauseBtn = document.getElementById('pauseBtn');
      const resetBtn = document.getElementById('resetBtn');
      
      expect(display.innerHTML).toContain('Load lyrics to begin practicing');
      expect(playBtn.disabled).toBe(true);
      expect(pauseBtn.disabled).toBe(true);
      expect(resetBtn.disabled).toBe(true);
    });
  });

  describe('getState', () => {
    test('should return current UI state', () => {
      uiComponents.initializeElements();
      document.getElementById('lyricsInput').value = 'Test';
      document.getElementById('speedSlider').value = '1.5';
      document.getElementById('delaySlider').value = '3.0';
      
      const state = uiComponents.getState();
      
      expect(state.lyricsText).toBe('Test');
      expect(state.speed).toBe(1.5);
      expect(state.delay).toBe(3.0);
      expect(state).toHaveProperty('playEnabled');
      expect(state).toHaveProperty('pauseEnabled');
      expect(state).toHaveProperty('resetEnabled');
    });
  });
});

describe('createUIComponents', () => {
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
  });

  test('should create and initialize UIComponents with default config', () => {
    const components = createUIComponents();
    
    expect(components).toBeInstanceOf(UIComponents);
    expect(components.getElement('lyricsInputId')).toBeTruthy();
    expect(components.getElement('playBtnId')).toBeTruthy();
  });
});
