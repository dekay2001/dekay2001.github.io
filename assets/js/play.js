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
            if (this.readyState == 4 && this.status == 200) {
                fetchedData = JSON.parse(this.responseText);
                console.log(`Fetched data: ${fetchedData}`);
            } else {
                console.log('Error fetching data.')
            }
        }
        xmlhttp.open("GET", "../data/yoga/fundamental-basic-sequence.json", true);
        xmlhttp.send();
        this.data = fetchedData;
    }
}

function main() {
    const secondsInterval = 5;
    const displayInDivId = "dynamicdiv";
    const resourceUrl = "../data/yoga/fundamental-basic-sequence.json"
    const resourceCollection = ResourceCollection(resourceUrl);
    resourceCollection.fetch();
    playSequence(secondsInterval, displayInDivId, resourceCollection);
}

window.onload = () => {
    main();
}