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
        this.resourceUrl = config.resourceUrl;
        this.displayInDivId = config.displayInDivId;
        this.yogaSequencePlayer = new YogaSequencePlayer(
            config.titleDivId,
            config.displayYogaPoseDivId,
            config.secondsInterval
        );
    }

    async start() {
        const ashtangaResources = new InteractiveAshtangaResources(this.yogaSequencePlayer);
        await ashtangaResources.showInteractiveSequences(this.displayInDivId);
    }
}

class InteractiveAshtangaResources {
    constructor(yogaSequencePlayer) {
        this.interactiveYogaSequences = null;
        this.yogaSequencePlayer = yogaSequencePlayer;
    }

    async showInteractiveSequences(displayInElementId) {
        this.interactiveYogaSequences = await this.getInteractiveYogaSequences();
        this.addInteractiveButtons(displayInElementId, this.interactiveYogaSequences);
    }

    addInteractiveButtons(displayInElementId, interactiveYogaSequences) {
        const displayInElement = document.getElementById(displayInElementId);
        const buttons = this.getInteractiveButtons(interactiveYogaSequences);
        buttons.forEach((button) => {
            displayInElement.appendChild(button);
        });
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

    getInteractiveButtons(interactiveYogaSequences) {
        const buttons = [];
        interactiveYogaSequences.forEach((interactiveYogaSequence) => {
            buttons.push(this.getInteractiveButton(interactiveYogaSequence));
        });
        return buttons;
    }

    getInteractiveButton(interactiveYogaSequence) {
        const button = document.createElement("button");
        button.innerText = interactiveYogaSequence.name;
        button.id = interactiveYogaSequence.id;
        button.addEventListener("click", async () => {
            await this.playSequence(`..${interactiveYogaSequence.ref}`);
        });
        return button;
    }

    async playSequence(resourceUrl) {
        const yogaSequence = await this.getYogaSequenceCollection(resourceUrl);
        this.yogaSequencePlayer.displaySequence(yogaSequence);
    }

    async getYogaSequenceCollection(resourceUrl) {
        const resourceCollection = get_resource_collection(resourceUrl);
        await resourceCollection.fetchAll();
        const yogaSequenceCollection = new YogaSequenceCollection(resourceCollection.data);
        return yogaSequenceCollection;
    }
}

class YogaSequencePlayer {
    constructor(titleDivId, displayInDivId, secondsInterval) {
        this.titleDivId = titleDivId;
        this.displayInDivId = displayInDivId;
        this.secondsInterval = secondsInterval;
    }

    displaySequence(yogaSequence) {
        this.displaySequenceTitle(yogaSequence);
        this.play(yogaSequence);
    }

    displaySequenceTitle(yogaSequence) {
        const titleDisplayer = new TextDisplayer(this.titleDivId);
        titleDisplayer.display(yogaSequence);
        const getReady = new TextDisplayer(this.displayInDivId);
        getReady.display({ text: 'Get ready...' });
    }

    play(yogaSequenceCollection) {
        // Update style.css to handle hover (maybe) of the name to display the englishName
        const displayer = new YogaPoseDisplayer(this.displayInDivId);
        const player = new DisplayablePlayer(yogaSequenceCollection, displayer);
        player.play(this.secondsInterval);
    }
}

class YogaSequenceCollection extends DisplayableCollection {
    constructor(yogaSequenceData) {
        super(yogaSequenceData);
        this.text = yogaSequenceData.title; // The collection itself is Displayable
    }
}

class YogaPoseDisplayer {
    constructor(displayInDivId) {
        this.displayInDivId = displayInDivId;
    }

    display(yogaPoseData) {
        const yogaPose = JSON.parse(yogaPoseData);
        this.setInnerText("name", yogaPose.name);
        this.setInnerText("englishName", yogaPose.englishName);
    }

    setInnerText(elementId, text) {
        const displayInElement = document.getElementById(elementId);
        displayInElement.innerText = text;
    }
}