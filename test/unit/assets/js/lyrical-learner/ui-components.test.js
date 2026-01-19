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
      <button id="skipNextBtn">Next</button>
      <button id="skipPrevBtn">Previous</button>
      <button id="loopBtn">Loop</button>
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
      skipNextBtnId: 'skipNextBtn',
      skipPrevBtnId: 'skipPrevBtn',
      loopBtnId: 'loopBtn',
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

    test('should handle element keys with underscores', () => {
      // Add an element with underscores in its ID
      const customElement = document.createElement('button');
      customElement.id = 'custom_button_id';
      document.body.appendChild(customElement);

      // Create a config with an element key containing underscores
      const customConfig = {
        ...mockConfig,
        custom_element_key: 'custom_button_id'
      };
      
      const customUI = new UIComponents(customConfig);
      customUI._elements['custom_element_key'] = customElement;
      
      const handler = jest.fn();
      const result = customUI.addEventListener('custom_element_key', 'click', handler);
      
      expect(result).toBe(true);
      customElement.click();
      expect(handler).toHaveBeenCalledTimes(1);
      
      // Cleanup should work correctly with underscore-containing keys
      customUI.removeAllEventListeners();
      customElement.click();
      expect(handler).toHaveBeenCalledTimes(1); // Should not be called again
      
      document.body.removeChild(customElement);
    });
  });

  describe('removeAllEventListeners', () => {
    test('should remove all event listeners', () => {
      uiComponents.initializeElements();
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      
      uiComponents.addEventListener('playBtnId', 'click', handler1);
      uiComponents.addEventListener('pauseBtnId', 'click', handler2);
      
      // Verify listeners work
      document.getElementById('playBtn').click();
      document.getElementById('pauseBtn').click();
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
      
      // Remove all listeners
      uiComponents.removeAllEventListeners();
      
      // Verify listeners are removed
      document.getElementById('playBtn').click();
      document.getElementById('pauseBtn').click();
      expect(handler1).toHaveBeenCalledTimes(1); // Not called again
      expect(handler2).toHaveBeenCalledTimes(1); // Not called again
    });

    test('should handle element keys with multiple underscores in cleanup', () => {
      const testElement = document.createElement('div');
      testElement.id = 'test_element_with_many_underscores';
      document.body.appendChild(testElement);

      const customConfig = { test_key_with_underscores: 'test_element_with_many_underscores' };
      const customUI = new UIComponents(customConfig);
      customUI._elements['test_key_with_underscores'] = testElement;
      
      const handler = jest.fn();
      customUI.addEventListener('test_key_with_underscores', 'click', handler);
      
      testElement.click();
      expect(handler).toHaveBeenCalledTimes(1);
      
      customUI.removeAllEventListeners();
      testElement.click();
      expect(handler).toHaveBeenCalledTimes(1); // Should not increment
      
      document.body.removeChild(testElement);
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

  describe('displayLyricsLine', () => {
    test('should safely display user text without HTML injection', () => {
      uiComponents.initializeElements();
      const display = document.getElementById('karaokeDisplay');
      
      const maliciousText = '<script>alert("XSS")</script>';
      uiComponents.displayLyricsLine(maliciousText);
      
      expect(display.innerHTML).not.toContain('<script>');
      expect(display.textContent).toBe(maliciousText);
    });

    test('should create paragraph element with default class', () => {
      uiComponents.initializeElements();
      const display = document.getElementById('karaokeDisplay');
      
      uiComponents.displayLyricsLine('Test lyrics');
      
      const paragraph = display.querySelector('p');
      expect(paragraph).toBeTruthy();
      expect(paragraph.className).toBe('ll-lyrics-line');
      expect(paragraph.textContent).toBe('Test lyrics');
    });

    test('should use custom CSS class when provided', () => {
      uiComponents.initializeElements();
      const display = document.getElementById('karaokeDisplay');
      
      uiComponents.displayLyricsLine('Test lyrics', 'custom-class');
      
      const paragraph = display.querySelector('p');
      expect(paragraph.className).toBe('custom-class');
    });

    test('should escape special HTML characters', () => {
      uiComponents.initializeElements();
      const display = document.getElementById('karaokeDisplay');
      
      const textWithSpecialChars = 'Lyrics with <tags> & "quotes" & \'apostrophes\'';
      uiComponents.displayLyricsLine(textWithSpecialChars);
      
      expect(display.textContent).toBe(textWithSpecialChars);
      expect(display.innerHTML).not.toContain('<tags>');
    });

    test('should replace existing content', () => {
      uiComponents.initializeElements();
      const display = document.getElementById('karaokeDisplay');
      display.innerHTML = '<p>Old content</p>';
      
      uiComponents.displayLyricsLine('New lyrics');
      
      expect(display.textContent).toBe('New lyrics');
      expect(display.innerHTML).not.toContain('Old content');
    });
  });

  describe('_escapeHtml', () => {
    test('should escape ampersands', () => {
      uiComponents.initializeElements();
      expect(uiComponents._escapeHtml('Rock & Roll')).toBe('Rock &amp; Roll');
    });

    test('should escape less than and greater than', () => {
      uiComponents.initializeElements();
      expect(uiComponents._escapeHtml('<script>')).toBe('&lt;script&gt;');
    });

    test('should escape quotes', () => {
      uiComponents.initializeElements();
      expect(uiComponents._escapeHtml('"double" and \'single\'')).toBe('&quot;double&quot; and &#39;single&#39;');
    });

    test('should escape multiple special characters', () => {
      uiComponents.initializeElements();
      expect(uiComponents._escapeHtml('<div class="test">A & B</div>'))
        .toBe('&lt;div class=&quot;test&quot;&gt;A &amp; B&lt;/div&gt;');
    });

    test('should not modify safe text', () => {
      uiComponents.initializeElements();
      expect(uiComponents._escapeHtml('Safe lyrics text')).toBe('Safe lyrics text');
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
