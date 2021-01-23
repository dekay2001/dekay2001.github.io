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
        const controller = new AshtangaController(this.yogaSequencePlayer);
        await controller.displayAllSeries(this.ashtangaSequencesDivId);
    }
}

class AshtangaController {
    constructor(yogaSequencePlayer) {
        this.allSeriesOptions = null;
        this.yogaSequencePlayer = yogaSequencePlayer;
    }

    async displayAllSeries(displayInElementId) {
        this.allSeriesOptions = await this._createSeriesOptions();
        this._displaySeriesOptions(displayInElementId);
    }

    _displaySeriesOptions(displayInElementId) {
        const displayInElement = document.getElementById(displayInElementId);
        const buttons = this._createButtons();
        buttons.forEach((button) => {
            displayInElement.appendChild(button);
        });
    }

    async _createSeriesOptions() {
        const interactiveResources = get_resource_collection('../assets/data/yoga/interactive-series.json');
        await interactiveResources.fetchAll();
        const allSeriesOptions = [];
        interactiveResources.data.items.forEach((interactiveResource) => {
            allSeriesOptions.push(interactiveResource);
        });
        return allSeriesOptions;
    }

    _createButtons() {
        const buttons = [];
        this.allSeriesOptions.forEach((seriesOption) => {
            buttons.push(this._createButton(seriesOption));
        });
        return buttons;
    }

    _createButton(seriesOption) {
        const button = document.createElement("button");
        button.innerText = seriesOption.name;
        button.id = seriesOption.id;
        button.addEventListener("click", async () => {
            await this._playSequence(`..${seriesOption.ref}`);
        });
        return button;
    }

    async _playSequence(resourceUrl) {
        const yogaSequence = await this._getYogaSequenceCollection(resourceUrl);
        this.yogaSequencePlayer.displaySequence(yogaSequence);
    }

    async _getYogaSequenceCollection(resourceUrl) {
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
        this._displaySequenceTitle(yogaSequence);
        this._play(yogaSequence);
    }

    _displaySequenceTitle(yogaSequence) {
        const titleDisplayer = new TextDisplayer(this.titleDivId);
        titleDisplayer.display(yogaSequence);
    }

    _play(yogaSequenceCollection) {
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
        this.greetingDisplayer.display({ text: greetingText });
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