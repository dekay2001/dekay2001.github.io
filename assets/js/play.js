import { playSequence } from './base/play-sequence.js';

class ResourceCollection {
    constructor(resourceUrl) {
        this.resourceUrl = resourceUrl;
        this.data = null;
    }

    fetch() {
        let fetchedData = null;
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = () => {
            if (this.status == 200) {
                console.log(`Fetched data: ${fetchedData}`);
                fetchedData = JSON.parse(this.responseText);
            } else {
                console.log(`Error fetching data. Status: ${this.status} ${this.responseText}`);
            }
        }
        xmlhttp.open("GET", this.resourceUrl, true);
        xmlhttp.send();
        this.data = fetchedData;
    }
}

function main() {
    const secondsInterval = 5;
    const displayInDivId = "dynamicdiv";
    const resourceUrl = "../assets/data/yoga/fundamental-basic-sequence.json"
    const resourceCollection = new ResourceCollection(resourceUrl);
    resourceCollection.fetch();
    playSequence(secondsInterval, displayInDivId, resourceCollection);
}

window.onload = () => {
    main();
}