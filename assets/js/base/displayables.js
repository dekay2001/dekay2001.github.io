// export class DisplayableCollection {
//     constructor(sourceData) {
//         this.data = this.toDisplayableData(sourceData);
//         this.nextIndex = 0;
//     }

//     nextDisplayable() {
//         this.nextIndex++;
//         if (this.nextIndex <= this.data.items.length) {
//             return this._displayable(this.nextIndex - 1);
//         }
//         return null;
//     }

//     previousDisplayable() {
//         if (this.nextIndex > 0) {
//             this.nextIndex--;
//             return this._displayable(this.nextIndex);
//         }
//     }

//     toDisplayableData(sourceData) {
//         // Override on descendents to provide text property if it doesn't exist
//         return sourceData;
//     }

//     _displayable(index) {
//         return new Displayable(this.data.items[index]);
//     }
// }

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
        if (nextDisplayable !== null) {
            this.displayer.display(displayable);
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