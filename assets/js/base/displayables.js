
export class TextDisplayer {
    constructor(elementId) {
        this.elementId = elementId;
    }

    display(displayable) {
        const displayInElement = document.getElementById(this.elementId);
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

    displayPrevious() {
        const previousDisplayable = this.displayableCollection.previousDisplayable();
        if (previousDisplayable !== null) {
            this.displayer.display(previousDisplayable);
        }
    }

    display(displayable, seconds) {
        this.displayer.display(displayable);
        this.play(seconds);
    }
}

export class Displayable {
    constructor(content) {
        this.content = content;
        this.text = content.text;
    }
}