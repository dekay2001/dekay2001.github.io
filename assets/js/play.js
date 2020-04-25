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

    play(seconds) {
        this.displayables.forEach(displayable => {
            console.log(`Displaying ${displayable}`);
            setTimeout(() => { this.displayer.display(displayable); }, seconds * 1000);
        });
    }
}

function main() {
    const elementId = "dynamicdiv";
    const displayer = new NameAsTextDisplayer(elementId);
    const displayableProvider = new DisplayableProvider();
    const displayables = displayableProvider.getDisplayables();
    const secondsInterval = 5;
    const player = new DisplayablePlayer(displayables, displayer);
    player.play(secondsInterval);
}

main();