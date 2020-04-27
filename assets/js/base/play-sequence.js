// TODO:  extend ResourceCollection
class DisplayableCollection {
    constructor(displayableData) {
        this.data = displayableData;
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

//  TODO: Inject the displayer.  
//  Add a Title property to the DisplayableCollection so I can add a title for "Fundamental Basic Sequence"
//  Add VCR controls.  Start, Stop, Forward, Back
//  Add a "yoga" application folder.  Move playSequence to the main application of that folder. 
//  Put logic/factory functions related to creating a yoga sequence player to that folder. 
//  Add a yoga link/page that uses the yoga application.
//  Add more sequences/data to yoga application. 
//  Add controls to switch sequences. 
//  Add controls to changing timing. 
export async function playSequence(secondsInterval, inElementId, resourceCollection) {
    const displayer = new NameAsTextDisplayer(inElementId);
    await resourceCollection.fetchAll();
    const displayableCollection = new DisplayableCollection(resourceCollection.data);
    const player = new DisplayablePlayer(displayableCollection, displayer);
    player.play(secondsInterval);
}

