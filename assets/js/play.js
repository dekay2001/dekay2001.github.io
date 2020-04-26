import { playSequence } from './base/play-sequence.js';

class ResourceCollection {
    constructor(resourceUrl) {
        this.resourceUrl = resourceUrl;
        this.data = null;
    }

    async fetch() {

        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.status == 200) {
                this.data = JSON.parse(xmlhttp.responseText);
                console.log(`Fetched data ${this.data}`);
            } else {
                console.log('Error fetching data.')
                console.log(xmlhttp);
            }
        }
        xmlhttp.open("GET", this.resourceUrl, true);
        xmlhttp.send();
    }
}

function main() {
    const secondsInterval = 5;
    const displayInDivId = "dynamicdiv";
    const resourceUrl = "../assets/data/yoga/fundamental-basic-sequence.json"
    const resourceCollection = new ResourceCollection(resourceUrl);
    resourceCollection.fetch();
    console.log("Calling playSequence");
    playSequence(secondsInterval, displayInDivId, resourceCollection);
}

window.onload = () => {
    main();
}