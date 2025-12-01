/**
 * @file Playground Main Entry Point
 * @description Experimental/demo area for yoga sequence player.
 * Used for testing and development of yoga sequence features.
 */

import { startApp } from './yoga/play-sequence.js';

/**
 * Main entry point for playground
 * @description Initializes yoga sequence player with demo configuration
 */
function main() {
    const config = {
        secondsInterval: 5,
        displayInDivId: "dynamicdiv",
        resourceUrl: "../assets/data/yoga/suryanamaskara-a.json",
        titleDivId: "dynamictitle"
    };
    startApp(config);
}

// Initialize on page load
window.onload = () => {
    main();
};