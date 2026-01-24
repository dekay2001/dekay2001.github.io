/**
 * Hamburger Menu Tests (SOLID Implementation)
 * @jest-environment jsdom
 */

import { createHamburgerMenu, initHamburgerMenu } from '../../../../../assets/js/base/hamburger-menu.js';

describe('Hamburger Menu (SOLID Implementation)', () => {
  let menuInstance;
  let originalMatchMedia;

  beforeEach(() => {
    originalMatchMedia = global.matchMedia;
    // Set up DOM structure for testing
    document.body.innerHTML = `
      <nav class="navbar_div">
        <button class="hamburger" id="hamburger-menu" aria-label="Toggle navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="nav-links" id="nav-links">
          <a href="/" class="current">Home</a>
          <a href="/blog/" class="navbarlink">Blog</a>
          <a href="/yoga/" class="navbarlink">Learn-Ashtanga</a>
        </div>
      </nav>
    `;
  });

  afterEach(() => {
    // Clean up instance if it was created
    if (menuInstance && menuInstance.destroy) {
      menuInstance.destroy();
      menuInstance = null;
    }
    // Restore matchMedia if it was mocked
    if (originalMatchMedia) {
      global.matchMedia = originalMatchMedia;
    }
    document.body.innerHTML = '';
  });

  describe('Factory Pattern', () => {
    test('should create menu instance with default config', () => {
      menuInstance = createHamburgerMenu();
      expect(menuInstance).not.toBeNull();
      expect(typeof menuInstance.destroy).toBe('function');
    });

    test('should return null when elements not found', () => {
      document.body.innerHTML = '';
      menuInstance = createHamburgerMenu();
      expect(menuInstance).toBeNull();
    });

    test('should accept custom configuration', () => {
      document.body.innerHTML = `
        <button id="custom-burger">Menu</button>
        <nav id="custom-nav">
          <a href="/">Home</a>
        </nav>
      `;

      menuInstance = createHamburgerMenu({
        hamburgerSelector: '#custom-burger',
        navLinksSelector: '#custom-nav',
        activeClass: 'is-open'
      });

      expect(menuInstance).not.toBeNull();
    });
  });

  describe('Menu Toggle Functionality', () => {
    test('should toggle menu when hamburger is clicked', () => {
      menuInstance = createHamburgerMenu();
      
      const hamburger = document.getElementById('hamburger-menu');
      const navLinks = document.getElementById('nav-links');
      
      // Initially, menu should not be active
      expect(hamburger.classList.contains('active')).toBe(false);
      expect(navLinks.classList.contains('active')).toBe(false);
      
      // Click hamburger to open menu
      hamburger.click();
      expect(hamburger.classList.contains('active')).toBe(true);
      expect(navLinks.classList.contains('active')).toBe(true);
      
      // Click again to close menu
      hamburger.click();
      expect(hamburger.classList.contains('active')).toBe(false);
      expect(navLinks.classList.contains('active')).toBe(false);
    });

    test('should work with custom active class', () => {
      document.body.innerHTML = `
        <button id="hamburger-menu">Menu</button>
        <nav id="nav-links"><a href="/">Home</a></nav>
      `;

      menuInstance = createHamburgerMenu({ activeClass: 'is-open' });
      
      const hamburger = document.getElementById('hamburger-menu');
      const navLinks = document.getElementById('nav-links');
      
      hamburger.click();
      expect(hamburger.classList.contains('is-open')).toBe(true);
      expect(navLinks.classList.contains('is-open')).toBe(true);
    });
  });

  describe('Auto-Close Behavior', () => {
    test('should close menu when navigation link is clicked', () => {
      menuInstance = createHamburgerMenu();
      
      const hamburger = document.getElementById('hamburger-menu');
      const navLinks = document.getElementById('nav-links');
      const link = navLinks.querySelector('a');
      
      // Open menu
      hamburger.click();
      expect(hamburger.classList.contains('active')).toBe(true);
      
      // Click a link
      link.click();
      expect(hamburger.classList.contains('active')).toBe(false);
      expect(navLinks.classList.contains('active')).toBe(false);
    });

    test('should close menu when clicking outside', () => {
      menuInstance = createHamburgerMenu();
      
      const hamburger = document.getElementById('hamburger-menu');
      const navLinks = document.getElementById('nav-links');
      
      // Open menu
      hamburger.click();
      expect(hamburger.classList.contains('active')).toBe(true);
      
      // Click outside nav
      document.body.click();
      expect(hamburger.classList.contains('active')).toBe(false);
      expect(navLinks.classList.contains('active')).toBe(false);
    });

    test('should not close menu when clicking inside nav', () => {
      menuInstance = createHamburgerMenu();
      
      const hamburger = document.getElementById('hamburger-menu');
      const navLinks = document.getElementById('nav-links');
      
      // Open menu
      hamburger.click();
      expect(hamburger.classList.contains('active')).toBe(true);
      
      // Click inside nav container (not on a link)
      navLinks.click();
      expect(hamburger.classList.contains('active')).toBe(true);
      expect(navLinks.classList.contains('active')).toBe(true);
    });

    test('should close menu on window resize to desktop width', () => {
      menuInstance = createHamburgerMenu();
      
      const hamburger = document.getElementById('hamburger-menu');
      const navLinks = document.getElementById('nav-links');
      
      // Open menu
      hamburger.click();
      expect(hamburger.classList.contains('active')).toBe(true);
      
      // Mock window resize to desktop width
      global.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(min-width: 451px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
      
      // Trigger resize event
      window.dispatchEvent(new Event('resize'));
      
      // Menu should be closed
      expect(hamburger.classList.contains('active')).toBe(false);
      expect(navLinks.classList.contains('active')).toBe(false);
    });
  });

  describe('Resource Management', () => {
    test('should clean up event listeners when destroyed', () => {
      menuInstance = createHamburgerMenu();
      
      const hamburger = document.getElementById('hamburger-menu');
      
      // Open menu
      hamburger.click();
      expect(hamburger.classList.contains('active')).toBe(true);
      
      // Destroy instance
      menuInstance.destroy();
      
      // Verify cleanup doesn't throw
      expect(() => menuInstance.destroy()).not.toThrow();
    });
  });

  describe('Backward Compatibility', () => {
    test('should support legacy initHamburgerMenu API', () => {
      const cleanup = initHamburgerMenu();
      
      expect(typeof cleanup).toBe('function');
      
      const hamburger = document.getElementById('hamburger-menu');
      hamburger.click();
      expect(hamburger.classList.contains('active')).toBe(true);
      
      // Cleanup
      if (cleanup) cleanup();
    });

    test('should return null for legacy API when elements missing', () => {
      document.body.innerHTML = '';
      const cleanup = initHamburgerMenu();
      expect(cleanup).toBeNull();
    });
  });

  describe('SOLID Principles Validation', () => {
    test('should allow configuration (Open/Closed Principle)', () => {
      document.body.innerHTML = `
        <button id="my-toggle">Toggle</button>
        <div id="my-menu"><a href="/">Link</a></div>
      `;

      const instance1 = createHamburgerMenu({
        hamburgerSelector: '#my-toggle',
        navLinksSelector: '#my-menu',
        breakpoint: '768px'
      });

      expect(instance1).not.toBeNull();
      instance1.destroy();
    });

    test('should handle multiple instances independently (SRP)', () => {
      document.body.innerHTML = `
        <button id="menu1-btn">Menu 1</button>
        <nav id="menu1-nav"><a href="/">Home</a></nav>
        <button id="menu2-btn">Menu 2</button>
        <nav id="menu2-nav"><a href="/">Home</a></nav>
      `;

      const menu1 = createHamburgerMenu({
        hamburgerSelector: '#menu1-btn',
        navLinksSelector: '#menu1-nav'
      });

      const menu2 = createHamburgerMenu({
        hamburgerSelector: '#menu2-btn',
        navLinksSelector: '#menu2-nav'
      });

      const btn1 = document.getElementById('menu1-btn');
      const btn2 = document.getElementById('menu2-btn');

      btn1.click();
      expect(btn1.classList.contains('active')).toBe(true);
      expect(btn2.classList.contains('active')).toBe(false);

      btn2.click();
      expect(btn2.classList.contains('active')).toBe(true);

      menu1.destroy();
      menu2.destroy();
    });
  });
});
