/**
 * @file Yoga Main Entry Point
 * @description Entry point for yoga sequence player on yoga page.
 * Initializes and starts the sequence application.
 */

import { getSequenceLinks, startApp, AppConfig, SequenceLinks } from './play-sequence.js';

/**
 * Main entry point for yoga sequence application
 * @param sequenceId - ID of the sequence to display
 * @example
 * main("suryanamskaraa");
 */
export function main(sequenceId: string): void {
    const sequenceLinks: SequenceLinks = getSequenceLinks();
    const config: AppConfig = {
        secondsInterval: 5,
        ashtangaSequencesDivId: "ashtanga-sequences",
        titleDivId: "sequence-title",
        resourceUrl: `..${sequenceLinks[sequenceId]}`
    };
    startApp(config);
}

// Initialize on page load
window.onload = (): void => {
    main("suryanamskaraa");
};
