
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
    constructor(displayableCollection) {
        this.displayableCollection = displayableCollection;
        this._listeners = [];
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
            this._notifyListeners(previousDisplayable);
        }
    }

    display(displayable, seconds) {
        this._notifyListeners(displayable);
        this.play(seconds);
    }

    register(listener) {
        this._listeners[this._listeners.length] = listener;
    }

    _notifyListeners(newDisplayable) {
        this._listeners.forEach(listener => {
            listener.display(newDisplayable);
        });
    }
}

export class Displayable {
    constructor(content) {
        this.content = content;
        this.text = content.text;
    }
}