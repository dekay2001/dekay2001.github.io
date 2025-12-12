/**
 * @file Playground Main Entry Point
 * @description Experimental/demo area for yoga sequence player.
 * Used for testing and development of yoga sequence features.
 */

import { startApp, AppConfig } from './yoga/play-sequence.js';

/**
 * Main entry point for playground
 * @description Initializes yoga sequence player with demo configuration
 */
function main(): void {
    const config: AppConfig = {
        secondsInterval: 5,
        ashtangaSequencesDivId: "dynamicdiv",
        titleDivId: "dynamictitle",
        resourceUrl: "../assets/data/yoga/suryanamaskara-a.json"
    };
    startApp(config);
}

// Initialize on page load
window.onload = (): void => {
    main();
};
