import { playSequence } from './base/play-sequence.js';

function main() {
    const secondsInterval = 5;
    const displayInDivId = "dynamicdiv";
    playSequence(secondsInterval, displayInDivId);
}

window.onload = () => {
    main();
}