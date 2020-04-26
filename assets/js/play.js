import { playSequence } from './base/play-sequence.js';

class ResourceCollection {
    constructor(resourceUrl) {
        this.resourceUrl = resourceUrl;
        this.data = null;
    }

    async fetch() {
        const response = await this.fetch(this.resourceUrl);
        this.data = await response.json();
    }
    // async fetch() {
    //     const xmlhttp = new XMLHttpRequest();
    //     xmlhttp.onreadystatechange = () => {
    //         if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //             console.log('Fetched data.')
    //             console.log(xmlhttp.responseText);
    //             this.data = JSON.parse(xmlhttp.responseText);
    //             console.log(this.data);
    //         } else {
    //             console.log('Error fetching data.')
    //             console.log(xmlhttp);
    //         }
    //     }
    //     xmlhttp.open("GET", this.resourceUrl, true);
    //     xmlhttp.send();
    // }
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