import { playSequence } from './base/play-sequence.js';
import { ResourceCollection } from "./base/models.js";

function main() {
    const secondsInterval = 5;
    const displayInDivId = "dynamicdiv";
    const resourceUrl = "../assets/data/yoga/fundamental-basic-sequence.json"
    const resourceCollection = new ResourceCollection(resourceUrl);
    playSequence(secondsInterval, displayInDivId, resourceCollection);
}

window.onload = () => {
    main();
}