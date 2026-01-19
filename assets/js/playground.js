/**
 * @file Playground Main Entry Point
 * @description Entry point for Lyrical Learner application.
 * Experimental/demo area for learning rap lyrics at adjustable speeds.
 */

import { initializeLyricalLearner } from './lyrical-learner/main.js';

/**
 * Main entry point for playground
 * @description Initializes the Lyrical Learner application
 */
function main() {
    initializeLyricalLearner();
}

// Initialize on page load
window.onload = () => {
    main();
};