const myDataCollection = {
    items: [
        {
            id: "1",
            name: "name1"
        },
        {
            id: "2",
            name: "name2"
        }
    ]
};


class DisplayableProvider {
    constructor() {
        this.data = myDataCollection;
    }

    getDisplayables() {
        const displayables = [];
        this.data.items.forEach(item => {
            displayables.push(new Displayable(item));
        });
        return displayables;
    }
}

class NameAsTextDisplayer {
    constructor(elementId) {
        this.elementId = elementId;
    }

    display(displayable) {
        const displayInElement = document.getElementById(this.elementId)
        displayInElement.innerText = displayable.content.name;
    }
}

class Displayable {
    constructor(content) {
        this.content = content;
    }
}

class DisplayablePlayer {
    constructor(displayables, displayer) {
        this.displayables = displayables;
        this.displayer = displayer;
    }

    async play(seconds) {
        for (const displayable of this.displayables) {
            await this.display(displayable, seconds);
        }
    }

    async display(displayable, seconds) {
        console.log(`Displaying ${displayable}`);
        this.displayer.display(displayable);
        await new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
}

async function main() {
    const elementId = "dynamicdiv";
    const displayer = new NameAsTextDisplayer(elementId);
    const displayableProvider = new DisplayableProvider();
    const displayables = displayableProvider.getDisplayables();
    const secondsInterval = 5;
    const player = new DisplayablePlayer(displayables, displayer);
    await player.play(secondsInterval);
}

await main();