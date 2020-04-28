export class DisplayableCollection {
    constructor(displayableData) {
        this.data = displayableData;
        this.nextIndex = 0;
    }

    getTitle() {
        return this.data.title;
    }

    nextDisplayable() {
        this.nextIndex++;
        if (this.nextIndex <= this.data.items.length) {
            return new Displayable(this.data.items[this.nextIndex - 1]);
        }
        return null;
    }
}

export class NameAsTextDisplayer {
    constructor(elementId) {
        this.elementId = elementId;
    }

    display(displayable) {
        const displayInElement = document.getElementById(this.elementId)
        displayInElement.innerText = displayable.content.name;
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
        console.log('Displayer-----');
        console.log(this.displayer);

        this.displayer.display(displayable);
        this.play(seconds);
    }
}

class Displayable {
    constructor(content) {
        this.content = content;
    }
}