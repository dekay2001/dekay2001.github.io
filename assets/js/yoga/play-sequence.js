import { DisplayableCollection, DisplayablePlayer, TextDisplayer } from "../base/displayables.js";
import { get_resource_collection } from "../base/models.js";

export async function start_app(config) {
    const app = new application(config);
    await app.start();
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

class application {
    constructor(config) {
        this.config = config;
        this.secondsInterval = config.secondsInterval;
        this.resourceUrl = config.resourceUrl;
        this.displayInDivId = config.displayInDivId;
        this.titleDivId = config.titleDivId;
    }

    async start() {
        const yogaSequence = await this.getYogaSequenceCollection();
        this.displaySequenceTitle(yogaSequence);
        this.play(yogaSequence);
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

    displaySequenceTitle(yogaSequence) {
        const titleDisplayer = new TextDisplayer(this.titleDivId);
        titleDisplayer.display(yogaSequence);
    }
}