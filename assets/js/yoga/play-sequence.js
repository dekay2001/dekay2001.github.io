import { DisplayablePlayer, TextDisplayer } from "../base/displayables.js";
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
        this.ashtangaSequencesDivId = config.ashtangaSequencesDivId;
        this.yogaSequencePlayer = new YogaSequencePlayer(
            config.titleDivId,
            config.displayYogaPoseDivId,
            config.secondsInterval
        );
    }

    async start() {
        const ashtangaResources = new AshtangaController(this.yogaSequencePlayer);
        await ashtangaResources.showInteractiveSequences(this.ashtangaSequencesDivId);
    }
}

class AshtangaController {
    constructor(yogaSequencePlayer) {
        this.allSeriesOptions = null;
        this.yogaSequencePlayer = yogaSequencePlayer;
    }

    async showInteractiveSequences(displayInElementId) {
        this.allSeriesOptions = await this.createSeriesOptions();
        this.displaySeriesOptions(displayInElementId);
    }

    displaySeriesOptions(displayInElementId) {
        const displayInElement = document.getElementById(displayInElementId);
        const buttons = this.createButtons();
        buttons.forEach((button) => {
            displayInElement.appendChild(button);
        });
    }

    async createSeriesOptions() {
        const interactiveResources = get_resource_collection('../assets/data/yoga/interactive-series.json');
        await interactiveResources.fetchAll();
        const allSeriesOptions = [];
        interactiveResources.data.items.forEach((interactiveResource) => {
            allSeriesOptions.push(interactiveResource);
        });
        return allSeriesOptions;
    }

    createButtons() {
        const buttons = [];
        this.allSeriesOptions.forEach((seriesOption) => {
            buttons.push(this.createButton(seriesOption));
        });
        return buttons;
    }

    createButton(seriesOption) {
        const button = document.createElement("button");
        button.innerText = seriesOption.name;
        button.id = seriesOption.id;
        button.addEventListener("click", async () => {
            await this.playSequence(`..${seriesOption.ref}`);
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
    constructor(titleDivId, displayYogaPoseDivId, secondsInterval) {
        this.titleDivId = titleDivId;
        this.displayYogaPoseDivId = displayYogaPoseDivId;
        this.secondsInterval = secondsInterval;
    }

    displaySequence(yogaSequence) {
        this.displaySequenceTitle(yogaSequence);
        this.play(yogaSequence);
    }

    displaySequenceTitle(yogaSequence) {
        const titleDisplayer = new TextDisplayer(this.titleDivId);
        titleDisplayer.display(yogaSequence);
        // const getReady = new TextDisplayer("ashtanga-sequences");
        // getReady.display({ text: 'Get ready...' });
    }

    play(yogaSequenceCollection) {
        // Update style.css to handle hover (maybe) of the name to display the englishName
        const displayer = new YogaPoseDisplayer(this.displayYogaPoseDivId);
        const player = new DisplayablePlayer(yogaSequenceCollection, displayer);
        player.play(this.secondsInterval);
    }
}

class YogaSequenceCollection {
    constructor(yogaSequenceData) {
        this.text = yogaSequenceData.title;
        this.nextIndex = 0;
        this.data = yogaSequenceData;
    }

    nextDisplayable() {
        this.nextIndex++;
        if (this.nextIndex <= this.data.items.length) {
            return new YogaPose(this.data.items[this.nextIndex - 1]);
        }
        return null;
    }
}


class YogaPose {
    constructor(poseData) {
        this.name = poseData.name;
        this.englishName = poseData.englishName;
    }
}


class YogaPoseDisplayer {
    constructor(displayInDivId) {
        this.displayInDivId = displayInDivId;
        this.currentPoseData = null;
        this.greetingDisplayer = new TextDisplayer("ashtanga-sequences");
        this.displayGreetingText('Get ready...');
    }

    clearGreetingText() {
        if (this.isFirstPose()) {
            this.displayGreetingText('');
        }
    }

    displayGreetingText(greetingText) {
        this.greetingDisplayer.display(greetingText);
    }

    display(yogaPoseData) {
        this.clearGreetingText();
        this.currentPoseData = yogaPoseData;
        this.setInnerText("name", yogaPoseData.name);
        this.setInnerText("englishName", yogaPoseData.englishName);
    }

    isFirstPose() {
        return this.currentPoseData == null;
    }

    setInnerText(elementId, text) {
        const displayInElement = document.getElementById(elementId);
        displayInElement.innerText = text;
    }
}