/**
 * Hamburger Menu Toggle
 * SOLID-compliant implementation for mobile navigation management.
 * 
 * @module hamburger-menu
 * @example
 * // Auto-initializes on page load with defaults
 * import { createHamburgerMenu } from './hamburger-menu.js';
 * 
 * // Or create with custom configuration
 * const menu = createHamburgerMenu({
 *   hamburgerSelector: '#my-hamburger',
 *   navLinksSelector: '#my-nav',
 *   activeClass: 'is-open',
 *   breakpoint: '768px'
 * });
 * 
 * // Clean up when done
 * menu.destroy();
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Default configuration for hamburger menu behavior
 * @const {Object}
 */
const DEFAULT_CONFIG = {
  hamburgerSelector: '#hamburger-menu',
  navLinksSelector: '#nav-links',
  activeClass: 'active',
  breakpoint: '451px'
};

// ============================================================================
// DOM ABSTRACTION LAYER (Dependency Inversion Principle)
// ============================================================================

/**
 * Provides a clean interface to DOM operations, allowing for easy testing
 * and potential replacement with alternative implementations.
 * 
 * @class DOMAdapter
 */
class DOMAdapter {
  querySelector(selector) {
    return document.querySelector(selector);
  }

  querySelectorAll(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
  }

  removeEventListener(element, event, handler) {
    element.removeEventListener(event, handler);
  }

  hasClass(element, className) {
    return element.classList.contains(className);
  }

  addClass(element, className) {
    element.classList.add(className);
  }

  removeClass(element, className) {
    element.classList.remove(className);
  }

  toggleClass(element, className) {
    element.classList.toggle(className);
  }

  contains(parent, child) {
    return parent.contains(child);
  }

  matchesMediaQuery(query) {
    return window.matchMedia(query).matches;
  }
}

// ============================================================================
// DOMAIN CLASSES (Single Responsibility Principle)
// ============================================================================

/**
 * Manages the open/closed state of the menu.
 * Responsibility: State management only.
 * 
 * @class MenuState
 * @param {HTMLElement} hamburger - The hamburger button element
 * @param {HTMLElement} navLinks - The navigation links container
 * @param {string} activeClass - CSS class name indicating open state
 * @param {DOMAdapter} domAdapter - DOM operations adapter
 */
class MenuState {
  constructor(hamburger, navLinks, activeClass, domAdapter) {
    this._hamburger = hamburger;
    this._navLinks = navLinks;
    this._activeClass = activeClass;
    this._dom = domAdapter;
  }

  /**
   * Check if the menu is currently open
   * @returns {boolean} True if menu is open
   */
  isOpen() {
    return this._dom.hasClass(this._navLinks, this._activeClass);
  }

  /**
   * Open the menu by adding the active class
   */
  open() {
    this._dom.addClass(this._hamburger, this._activeClass);
    this._dom.addClass(this._navLinks, this._activeClass);
  }

  /**
   * Close the menu by removing the active class
   */
  close() {
    this._dom.removeClass(this._hamburger, this._activeClass);
    this._dom.removeClass(this._navLinks, this._activeClass);
  }

  /**
   * Toggle the menu between open and closed states
   */
  toggle() {
    this._dom.toggleClass(this._hamburger, this._activeClass);
    this._dom.toggleClass(this._navLinks, this._activeClass);
  }
}

/**
 * Manages event listener registration and cleanup.
 * Responsibility: Event lifecycle management only.
 * 
 * Tracks all registered listeners to ensure proper cleanup and prevent memory leaks.
 * 
 * @class EventManager
 * @param {DOMAdapter} domAdapter - DOM operations adapter
 */
class EventManager {
  constructor(domAdapter) {
    this._dom = domAdapter;
    this._listeners = [];
  }

  /**
   * Register an event listener and track it for cleanup
   * @param {HTMLElement} element - Element to attach listener to
   * @param {string} event - Event type (e.g., 'click', 'resize')
   * @param {Function} handler - Event handler function
   */
  register(element, event, handler) {
    this._dom.addEventListener(element, event, handler);
    this._listeners.push({ element, event, handler });
  }

  /**
   * Remove all registered event listeners
   */
  cleanup() {
    this._listeners.forEach(({ element, event, handler }) => {
      this._dom.removeEventListener(element, event, handler);
    });
    this._listeners = [];
  }
}

/**
 * Coordinates menu behavior by orchestrating MenuState and EventManager.
 * Responsibility: Coordination and configuration only.
 * 
 * This is the main controller that wires together all the pieces but doesn't
 * directly manage state or events itself (delegation pattern).
 * 
 * @class HamburgerMenuController
 * @param {Object} config - Configuration options
 * @param {DOMAdapter} domAdapter - DOM operations adapter (injected for testability)
 */
class HamburgerMenuController {
  constructor(config, domAdapter = new DOMAdapter()) {
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._dom = domAdapter;
    this._eventManager = new EventManager(domAdapter);
    this._menuState = null;
  }

  /**
   * Initialize the menu by finding DOM elements and setting up event handlers
   * @returns {boolean} True if initialization succeeded, false if elements not found
   */
  initialize() {
    const hamburger = this._dom.querySelector(this._config.hamburgerSelector);
    const navLinks = this._dom.querySelector(this._config.navLinksSelector);

    if (!hamburger || !navLinks) {
      return false;
    }

    this._menuState = new MenuState(
      hamburger,
      navLinks,
      this._config.activeClass,
      this._dom
    );

    this._setupEventHandlers(hamburger, navLinks);
    return true;
  }

  /**
   * Clean up all event listeners and reset state
   */
  destroy() {
    this._eventManager.cleanup();
    this._menuState = null;
  }

  /**
   * Set up all event handlers for menu behavior
   * @private
   * @param {HTMLElement} hamburger - The hamburger button element
   * @param {HTMLElement} navLinks - The navigation links container
   */
  _setupEventHandlers(hamburger, navLinks) {
    this._handleHamburgerClick(hamburger);
    this._handleOutsideClick(hamburger, navLinks);
    this._handleWindowResize();
    this._handleLinkClicks(navLinks);
  }

  /**
   * Handle hamburger button clicks to toggle menu
   * @private
   */
  _handleHamburgerClick(hamburger) {
    this._eventManager.register(hamburger, 'click', () => {
      this._menuState.toggle();
    });
  }

  /**
   * Handle clicks outside the menu to close it
   * @private
   */
  _handleOutsideClick(hamburger, navLinks) {
    this._eventManager.register(document, 'click', (event) => {
      const clickedInsideMenu = this._isClickInsideMenu(event.target, hamburger, navLinks);
      
      if (!clickedInsideMenu && this._menuState.isOpen()) {
        this._menuState.close();
      }
    });
  }

  /**
   * Handle window resize to close menu on desktop view
   * @private
   */
  _handleWindowResize() {
    this._eventManager.register(window, 'resize', () => {
      const isDesktopWidth = this._dom.matchesMediaQuery(
        `(min-width: ${this._config.breakpoint})`
      );
      
      if (isDesktopWidth) {
        this._menuState.close();
      }
    });
  }

  /**
   * Handle navigation link clicks to close menu
   * @private
   */
  _handleLinkClicks(navLinks) {
    const linkSelector = `${this._config.navLinksSelector} a`;
    const links = this._dom.querySelectorAll(linkSelector);
    
    links.forEach(link => {
      this._eventManager.register(link, 'click', () => {
        this._menuState.close();
      });
    });
  }

  /**
   * Check if a click occurred inside the menu area
   * @private
   * @param {HTMLElement} target - The clicked element
   * @param {HTMLElement} hamburger - The hamburger button element
   * @param {HTMLElement} navLinks - The navigation links container
   * @returns {boolean} True if click was inside menu
   */
  _isClickInsideMenu(target, hamburger, navLinks) {
    return this._dom.contains(navLinks, target) || 
           this._dom.contains(hamburger, target);
  }
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Factory function for creating hamburger menu instances.
 * Provides a clean, configuration-based API for menu creation.
 * 
 * @param {Object} [config={}] - Configuration options
 * @param {string} [config.hamburgerSelector='#hamburger-menu'] - CSS selector for hamburger button
 * @param {string} [config.navLinksSelector='#nav-links'] - CSS selector for navigation container
 * @param {string} [config.activeClass='active'] - CSS class for open state
 * @param {string} [config.breakpoint='451px'] - Breakpoint for mobile/desktop switch
 * @returns {Object|null} Menu instance with destroy method, or null if initialization failed
 * 
 * @example
 * const menu = createHamburgerMenu({
 *   hamburgerSelector: '#custom-burger',
 *   activeClass: 'is-open',
 *   breakpoint: '768px'
 * });
 * 
 * if (menu) {
 *   // Menu created successfully
 *   // Later, clean up:
 *   menu.destroy();
 * }
 */
export function createHamburgerMenu(config = {}) {
  const controller = new HamburgerMenuController(config);
  const initialized = controller.initialize();
  
  return initialized ? {
    destroy: () => controller.destroy()
  } : null;
}

/**
 * Legacy API for backward compatibility with original implementation.
 * 
 * @deprecated Use createHamburgerMenu instead for better control
 * @returns {Function|null} Cleanup function or null if initialization failed
 * 
 * @example
 * const cleanup = initHamburgerMenu();
 * if (cleanup) {
 *   // Later:
 *   cleanup();
 * }
 */
export function initHamburgerMenu() {
  const instance = createHamburgerMenu();
  return instance ? instance.destroy : null;
}

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

/**
 * Automatically initialize menu when DOM is ready.
 * This runs on page load to set up the default menu without manual intervention.
 * @private
 */
function _autoInitialize() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => createHamburgerMenu());
  } else {
    createHamburgerMenu();
  }
}

_autoInitialize();
