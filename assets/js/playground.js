import { start_app } from './yoga/play-sequence.js';

function main() {
    const config = {
        secondsInterval: 5,
        displayInDivId: "dynamicdiv",
        resourceUrl: "../assets/data/yoga/suryanamaskara-a.json",
        titleDivId: "dynamictitle"
    }
    start_app(config);
}

window.onload = () => {
    main();
}