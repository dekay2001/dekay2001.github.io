/**
 * @file Displayable Classes
 * @description Provides display logic for text content and automated sequence playback.
 * Implements observer pattern for notifying listeners of display changes.
 */

/**
 * TextDisplayer - Displays text content in a DOM element
 * 
 * @class
 * @description Simple text display utility that renders displayable objects
 * by setting the innerText of a target element.
 * 
 * @property {string} elementId - The ID of the DOM element to display text in
 * 
 * @example
 * const displayer = new TextDisplayer('title-div');
 * displayer.display({ text: 'Hello World' });
 */
export class TextDisplayer {
    /**
     * Creates a TextDisplayer instance
     * @constructor
     * @param {string} elementId - The ID of the DOM element to display text in
     */
    constructor(elementId) {
        this.elementId = elementId;
    }

    /**
     * Displays the text content of a displayable object
     * @param {Object} displayable - An object with a text property
     * @param {string} displayable.text - The text to display
     */
    display(displayable) {
        const displayInElement = document.getElementById(this.elementId);
        displayInElement.innerText = displayable.text;
    }
}

/**
 * DisplayablePlayer - Manages automated sequence playback with observer pattern
 * 
 * @class
 * @description Plays through a collection of displayable items at timed intervals.
 * Notifies registered listeners when items are displayed, enabling synchronized
 * UI updates across multiple components.
 * 
 * @property {Object} displayableCollection - Collection with nextDisplayable() and previousDisplayable() methods
 * @property {Array<Object>} _listeners - Registered observer objects with displayNext/displayPrevious methods
 * 
 * @example
 * const collection = new YogaSequenceCollection(data);
 * const player = new DisplayablePlayer(collection);
 * player.register(someListener);
 * player.play(5); // Display next item every 5 seconds
 */
export class DisplayablePlayer {
    /**
     * Creates a DisplayablePlayer instance
     * @constructor
     * @param {Object} displayableCollection - Collection implementing nextDisplayable() and previousDisplayable()
     */
    constructor(displayableCollection) {
        this.displayableCollection = displayableCollection;
        this._listeners = [];
    }

    /**
     * Starts playback at specified interval
     * @param {number} seconds - Interval in seconds between displays
     */
    play(seconds) {
        setTimeout(() => {
            this.displayNext(seconds);
        }, seconds * 1000);
    }

    /**
     * Displays the next item in the collection
     * @param {number} seconds - Interval for recursive playback
     */
    displayNext(seconds) {
        const nextDisplayable = this.displayableCollection.nextDisplayable();
        if (nextDisplayable !== null) {
            this._display(nextDisplayable, seconds);
            this._notifyListenersDisplayNext(nextDisplayable);
        }
    }

    /**
     * Displays the previous item in the collection
     */
    displayPrevious() {
        const previousDisplayable = this.displayableCollection.previousDisplayable();
        this._notifyListenersDisplayPrevious(previousDisplayable);
    }

    /**
     * Registers a listener for display events
     * @param {Object} listener - Object with displayNext() and displayPrevious() methods
     */
    register(listener) {
        this._listeners.push(listener);
    }

    // Private methods

    /**
     * Internal display handler that continues playback
     * @private
     * @param {Object} displayable - The displayable item
     * @param {number} seconds - Interval for next display
     */
    _display(displayable, seconds) {
        this.play(seconds);
    }

    /**
     * Notifies all listeners of next display
     * @private
     * @param {Object} newDisplayable - The newly displayed item
     */
    _notifyListenersDisplayNext(newDisplayable) {
        this._listeners.forEach(listener => {
            listener.displayNext(newDisplayable);
        });
    }

    /**
     * Notifies all listeners of previous display
     * @private
     * @param {Object} previousDisplayable - The previously displayed item
     */
    _notifyListenersDisplayPrevious(previousDisplayable) {
        this._listeners.forEach(listener => {
            listener.displayPrevious(previousDisplayable);
        });
    }
}

/**
 * Displayable - Basic displayable content wrapper
 * 
 * @class
 * @description Simple wrapper for content objects to provide a consistent
 * text property interface for display systems.
 * 
 * @property {Object} content - The original content object
 * @property {string} text - The text extracted from content
 * 
 * @example
 * const displayable = new Displayable({ text: 'Hello' });
 * console.log(displayable.text); // 'Hello'
 */
export class Displayable {
    /**
     * Creates a Displayable instance
     * @constructor
     * @param {Object} content - Content object with a text property
     * @param {string} content.text - The text to display
     */
    constructor(content) {
        this.content = content;
        this.text = content.text;
    }
}