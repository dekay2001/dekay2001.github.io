const itemData = {
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


class DisplayableCollection {
    constructor() {
        this.data = itemData;
        this.nextIndex = 0;
    }

    nextDisplayable() {
        this.nextIndex++;
        if (this.nextIndex <= this.data.items.length) {
            return new Displayable(this.data.items[this.nextIndex - 1]);
        }
        return null;
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
    constructor(displayableCollection, displayer) {
        this.displayableCollection = displayableCollection;
        this.displayer = displayer;
    }

    play(seconds) {
        let self = this;
        let timerId = setTimeout(() => {
            this.displayNext(seconds);
        }, seconds * 1000, seconds);
    }

    displayNext(seconds) {
        const nextDisplayable = this.displayableCollection.nextDisplayable();
        if (nextDisplayable !== null) {
            this.display(nextDisplayable, seconds);
        }
    }

    display(displayable, seconds) {
        console.log(`Displaying ${displayable}`);
        this.displayer.display(displayable);
        let timerId = setTimeout(this.displayNext, seconds * 1000);
    }
}

function main() {
    const elementId = "dynamicdiv";
    const displayer = new NameAsTextDisplayer(elementId);
    const displayableCollection = new DisplayableCollection();
    const secondsInterval = 5;
    const player = new DisplayablePlayer(displayableCollection, displayer);
    player.play(secondsInterval);
}

main();