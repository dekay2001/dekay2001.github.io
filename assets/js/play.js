import { playSequence } from './base/play-sequence.js';

class ResourceCollection {
    constructor(resourceUrl) {
        this.resourceUrl = resourceUrl;
        this.data = null;
    }

    async fetchAll() {
        const response = await fetch(this.resourceUrl);
        console.log(response);
        this.data = await response.json();
        console.log(this.data);
    }
}

function main() {
    const secondsInterval = 5;
    const displayInDivId = "dynamicdiv";
    const resourceUrl = "../assets/data/yoga/fundamental-basic-sequence.json"
    const resourceCollection = new ResourceCollection(resourceUrl);
    console.log("Calling playSequence");
    playSequence(secondsInterval, displayInDivId, resourceCollection);
}

window.onload = () => {
    main();
}