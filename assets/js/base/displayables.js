export class DisplayableCollection {
    constructor(sourceData) {
        this.data = this.toDisplayableData(sourceData);
        this.nextIndex = 0;
    }

    nextDisplayable() {
        this.nextIndex++;
        if (this.nextIndex <= this.data.items.length) {
            return new Displayable(this.data.items[this.nextIndex - 1]);
        }
        return null;
    }

    toDisplayableData(sourceData) {
        // Override on descendents to provide text property if it doesn't exist
        return sourceData;
    }
}

export class TextDisplayer {
    constructor(elementId) {
        this.elementId = elementId;
    }

    display(displayable) {
        const displayInElement = document.getElementById(this.elementId)
        displayInElement.innerText = displayable.text;
    }
}

export class DisplayablePlayer {
    constructor(displayableCollection, displayer) {
        this.displayableCollection = displayableCollection;
        this.displayer = displayer;
    }

    play(seconds) {
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
        this.displayer.display(displayable);
        this.play(seconds);
    }
}

class Displayable {
    constructor(content) {
        this.content = content;
        this.text = content.text;
    }
}