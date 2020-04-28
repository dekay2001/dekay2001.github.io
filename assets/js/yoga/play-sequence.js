import { DisplayableCollection, DisplayablePlayer, NameAsTextDisplayer } from "../base/displayables.js";
import { get_resource_collection } from "../base/models.js";

export function start_app(config) {
    const app = new application(config);
    app.start();
}

class application {
    constructor(config) {
        this.config = config;
        this.secondsInterval = config.secondsInterval;
        this.resourceUrl = config.resourceUrl;
        this.displayInDiv = config.displayInDiv
    }

    async start() {
        const displayer = new NameAsTextDisplayer(this.displayInDiv);
        const resourceCollection = get_resource_collection(this.resourceUrl);
        await resourceCollection.fetchAll();
        const displayableCollection = new DisplayableCollection(resourceCollection);
        const player = new DisplayablePlayer(displayableCollection, displayer);
        player.play(this.secondsInterval);
    }
}