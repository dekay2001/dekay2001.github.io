import { application } from './yoga/play-sequence.js';

const config = {
    secondsInterval: 5,
    displayInDivId: "dynamicdiv",
    resourceUrl: "../assets/data/yoga/fundamental-basic-sequence.json"
}

function main() {
    app = new application(config);
    app.start();
}

window.onload = () => {
    main();
}