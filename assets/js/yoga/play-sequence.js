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
        this.sequenceView = new SequenceView(
            config.titleDivId,
            config.secondsInterval
        );
    }

    async start() {
        const controller = new SequencesView(this.sequenceView);
        await controller.displayAll(this.ashtangaSequencesDivId);
    }
}

class SequencesView {
    constructor(sequenceView) {
        this.allSeriesOptions = null;
        this.sequenceView = sequenceView;
    }

    async displayAll(displayInElementId) {
        this.allSeriesOptions = await this._createSeriesOptions();
        this._displayAll(displayInElementId);
    }

    displayPrevious() {
        this.sequenceView.displayPrevious();
    }

    _displayAll(displayInElementId) {
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
        this.sequenceView.displaySequence(yogaSequence);
    }

    async _getYogaSequenceCollection(resourceUrl) {
        const resourceCollection = get_resource_collection(resourceUrl);
        await resourceCollection.fetchAll();
        const yogaSequenceCollection = new YogaSequenceCollection(resourceCollection.data);
        return yogaSequenceCollection;
    }
}

// TODO: New Listener class to handle back button and register an
// instance of the new listener class this.player.register(this.backButtonDisplayer);
// The new BackButtonDisplayer should respond to displayPrevious(previousDisplayable)
// detecting it is the first and hide the button.
class SequenceView {
    constructor(titleDivId, secondsInterval) {
        this._titleDivId = titleDivId;
        this._secondsInterval = secondsInterval;
        this._player = null;  // initialized in this.play
        this._backButton = null;
    }

    displaySequence(yogaSequence) {
        this._displaySequenceTitle(yogaSequence);
        this._play(yogaSequence);
        this._displayBackButton();
    }

    _displayBackButton() {
        // TODO:  Initialize the back button or make it displayble and bind it to displayPrevious().
        // this._displayer.displayBackButton();
        /*
            <div style="width:50%;float:left">←</div>
            <div style="style=width: 50%">→</div>
        */
        const displayInElement = document.getElementById("yoga-sequences");
        this._backButton = new PreviousPoseButton("previous-pose", "←", this._player);
        displayInElement.appendChild(this._backButton.playerButton);
    }

    _displaySequenceTitle(yogaSequence) {
        const titleDisplayer = new TextDisplayer(this._titleDivId);
        titleDisplayer.display(yogaSequence);
    }

    _play(yogaSequenceCollection) {
        const displayer = new YogaPoseDisplayer();
        this._player = new DisplayablePlayer(yogaSequenceCollection);
        this._player.register(displayer);
        this._player.play(this._secondsInterval);
    }
}

class PreviousPoseButton {
    constructor(id, text, player) {
        this.playerButton = document.createElement("button");
        this.playerButton.innerText = text;
        this.playerButton.id = id;
        this.player = player;
        this.playerButton.addEventListener("click", async () => {
            this.player.displayPrevious();
        });
    }
}

class YogaSequenceCollection {
    constructor(yogaSequenceData) {
        this.text = yogaSequenceData.title;
        this.nextIndex = -1;
        this.data = yogaSequenceData;
    }

    nextDisplayable() {
        this.nextIndex++;
        if (this.nextIndex < this.data.items.length) {
            return this._yogaPose(this.nextIndex);
        }
        return null;
    }

    previousDisplayable() {
        if (this.nextIndex > 0) {
            this.nextIndex--;
            return this._yogaPose(this.nextIndex);
        }
        return null
    }

    _yogaPose(index) {
        return new YogaPose(this.data.items[index]);
    }
}


class YogaPose {
    constructor(poseData) {
        this.name = poseData.name;
        this.englishName = poseData.englishName;
    }
}


class YogaPoseDisplayer {
    constructor() {
        this._currentPoseData = null;
        this._greetingDisplayer = new TextDisplayer("ashtanga-sequences");
        this._displayGreetingText('Get ready...');
    }

    displayNext(yogaPoseData) {
        this._clearGreetingText();
        this._currentPoseData = yogaPoseData;
        this._setInnerText("name", yogaPoseData.name);
        this._setInnerText("englishName", yogaPoseData.englishName);
    }

    displayPrevious(previousDisplayable) {
        if (previousDisplayable !== null) {
            this.display(previousDisplayable);
        }
    }

    _clearGreetingText() {
        if (this._isDisplayingPose()) {
            this._displayGreetingText('');
        }
    }

    _displayGreetingText(greetingText) {
        this._greetingDisplayer.display({ text: greetingText });
    }

    _isDisplayingPose() {
        return this._currentPoseData == null;
    }

    _setInnerText(elementId, text) {
        const displayInElement = document.getElementById(elementId);
        displayInElement.innerText = text;
    }
}
