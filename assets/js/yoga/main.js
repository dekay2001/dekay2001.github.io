import { start_app } from './play-sequence.js';

function main() {
    const config = {
        secondsInterval: 5,
        displayInDivId: "yoga-sequence",
        titleDivId: "sequence-title",
        resourceUrl: "../assets/data/yoga/fundamental-basic-sequence.json"
    }
    start_app(config);
}

window.onload = () => {
    main();
}