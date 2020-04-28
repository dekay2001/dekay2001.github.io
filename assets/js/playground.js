import { ResourceCollection } from "./base/models.js";
import { NameAsTextDisplayer } from "./base/displayables.js";
import { playSequence } from './yoga/play-sequence.js';


function main() {
    const secondsInterval = 5;
    const displayInDivId = "dynamicdiv";
    const displayer = new NameAsTextDisplayer(displayInDivId);
    const resourceUrl = "../assets/data/yoga/fundamental-basic-sequence.json"
    const resourceCollection = new ResourceCollection(resourceUrl);
    playSequence(secondsInterval, displayer, resourceCollection);
}

window.onload = () => {
    main();
}