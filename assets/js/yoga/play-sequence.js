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
        const ashtangaResources = new InteractiveAshtangaResources(this.yogaSequencePlayer);
        await ashtangaResources.showInteractiveSequences(this.ashtangaSequencesDivId);
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
        const getReady = new TextDisplayer("ashtanga-sequences");
        getReady.display({ text: 'Get ready...' });
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

// class YogaSequenceCollection extends DisplayableCollection {
//     constructor(yogaSequenceData) {
//         super(yogaSequenceData);
//         this.text = yogaSequenceData.title; // The collection itself is Displayable
//     }
// }

// export class DisplayableCollection {
//     constructor(sourceData) {
//         this.data = this.toDisplayableData(sourceData);
//         this.nextIndex = 0;
//     }

//     nextDisplayable() {
//         this.nextIndex++;
//         if (this.nextIndex <= this.data.items.length) {
//             return new Displayable(this.data.items[this.nextIndex - 1]);
//         }
//         return null;
//     }

//     toDisplayableData(sourceData) {
//         // Override on descendents to provide text property if it doesn't exist
//         return sourceData;
//     }
// }


class YogaPoseDisplayer {
    constructor(displayInDivId) {
        this.displayInDivId = displayInDivId;
    }

    display(yogaPoseData) {
        this.setInnerText("name", yogaPoseData.name);
        this.setInnerText("englishName", yogaPoseData.englishName);
    }

    setInnerText(elementId, text) {
        const displayInElement = document.getElementById(elementId);
        displayInElement.innerText = text;
    }
}