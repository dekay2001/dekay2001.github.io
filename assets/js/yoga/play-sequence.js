import { Displayable, DisplayableCollection, DisplayablePlayer, TextDisplayer } from "../base/displayables.js";
import { get_resource_collection } from "../base/models.js";

export function getSequenceLinks() {
    return {
        suryanamskaraa: "/assets/data/yoga/suryanamaskara-a.json",
        fundamental: "/assets/data/yoga/fundamental-basic-sequence.json"
    };
}

export async function start_app(config) {
    const app = new application(config);
    await app.start();
}

class application {
    constructor(config) {
        this.config = config;
        this.secondsInterval = config.secondsInterval;
        this.resourceUrl = config.resourceUrl;
        this.displayInDivId = config.displayInDivId;
        this.titleDivId = config.titleDivId;
    }

    async start() {
        const ashtangaResources = new InteractiveAshtangaResources();
        ashtangaResources.showInteractiveSequences(this.displayInDivId);
        // const yogaSequence = await this.getYogaSequenceCollection();
    }

    displaySequence(yogaSequence) {
        this.displaySequenceTitle(yogaSequence);
        this.play(yogaSequence);
    }

    displaySequenceTitle(yogaSequence) {
        const titleDisplayer = new TextDisplayer(this.titleDivId);
        titleDisplayer.display(yogaSequence);
    }

    async getYogaSequenceCollection() {
        const resourceCollection = get_resource_collection(this.resourceUrl);
        await resourceCollection.fetchAll();
        const yogaSequenceCollection = new YogaSequenceCollection(resourceCollection.data);
        return yogaSequenceCollection;
    }

    play(yogaSequenceCollection) {
        const displayer = new TextDisplayer(this.displayInDivId);
        const player = new DisplayablePlayer(yogaSequenceCollection, displayer);
        player.play(this.secondsInterval);
    }
}

class InteractiveAshtangaResources {
    constructor() {

    }

    showInteractiveSequences(displayInElementId) {
        const interactiveYogaSequences = this.getInteractiveYogaSequences();
        const displayable = this.getDisplayable(interactiveYogaSequences);
        const textDisplayer = new TextDisplayer(displayInElementId);
        textDisplayer.display(displayable);
        // ToDo:  implement class to bind the displayables to the buttons now displayed.
    }

    async getInteractiveYogaSequences() {
        const interactiveResources = get_resource_collection('../assets/data/yoga/interactive-series.json');
        await interactiveResources.fetchAll();
        const interactiveYogaSequences = [];
        interactiveResources.data.items.forEach((interactiveResource) => {
            interactiveYogaSequences.push(interactiveResource);
        });
        return interactiveYogaSequences;
    }

    getDisplayable(interactiveYogaSequences) {
        return new Displayable(this.getDisplayableContent(interactiveYogaSequences));
    }

    getDisplayableContent(interactiveYogaSequences) {
        const allInteractiveButtonsHtml = this.getInteractiveButtonsHtml(interactiveYogaSequences);
        return {
            text: allInteractiveButtonsHtml
        };
    }

    getInteractiveButtonsHtml(interactiveYogaSequences) {
        let buttonHtml = '';
        interactiveYogaSequences.forEach((interactiveYogaSequence) => {
            buttonHtml += this.getInteractiveButtonHtml(interactiveYogaSequence);
        });
        return buttonHtml;
    }

    getInteractiveButtonHtml(interactiveYogaSequence) {
        return `<button id="${interactiveYogaSequence.id}">${interactiveYogaSequence.name}</button>`;
    }
}

class YogaSequenceCollection extends DisplayableCollection {
    constructor(yogaSequenceData) {
        super(yogaSequenceData);
        this.text = yogaSequenceData.title; // The collection itself is Displayable
    }

    toDisplayableData(sourceData) {
        sourceData.items.forEach(item => {
            item.text = item.name;
        });
        return sourceData;
    }
}

/*
TODO:  As an ashtanga page I want to display a list of the resource names so that when
I can click the resource to start playing the sequences.
*/
// class HtmlAsText {
//     constructor() {
//         this.content = 'some content';
//         this.buttonId = "next";
//         this.text = `<button id="next">→</button>`
//     }

//     addEventListener() {
//         const button = document.getElementById(this.buttonId);
//         button.addEventListener("click", () => {

//         });
//     }
// }


// document.getElementById("myBtn").addEventListener("click", function(){
//     document.getElementById("demo").innerHTML = "Hello World";
//   });

