/**
 * @file Displayable Classes
 * @description Provides display logic for text content and automated sequence playback.
 * Implements observer pattern for notifying listeners of display changes.
 */

/**
 * Interface for objects that can be displayed
 */
export interface IDisplayable {
    text: string;
}

/**
 * Interface for collections that can provide displayable items
 */
export interface IDisplayableCollection {
    nextDisplayable(): IDisplayable | null;
    previousDisplayable(): IDisplayable | null;
}

/**
 * Interface for listeners that respond to display events
 */
export interface IDisplayListener {
    displayNext(displayable: IDisplayable): void;
    displayPrevious(displayable: IDisplayable): void;
}

/**
 * TextDisplayer - Displays text content in a DOM element
 * 
 * @class
 * @description Simple text display utility that renders displayable objects
 * by setting the innerText of a target element.
 * 
 * @property elementId - The ID of the DOM element to display text in
 * 
 * @example
 * const displayer = new TextDisplayer('title-div');
 * displayer.display({ text: 'Hello World' });
 */
export class TextDisplayer {
    public elementId: string;

    /**
     * Creates a TextDisplayer instance
     * @constructor
     * @param elementId - The ID of the DOM element to display text in
     */
    constructor(elementId: string) {
        this.elementId = elementId;
    }

    /**
     * Displays the text content of a displayable object
     * @param displayable - An object with a text property
     */
    display(displayable: IDisplayable): void {
        const displayInElement = document.getElementById(this.elementId);
        if (displayInElement) {
            displayInElement.innerText = displayable.text;
        }
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
 * @property displayableCollection - Collection with nextDisplayable() and previousDisplayable() methods
 * @property _listeners - Registered observer objects with displayNext/displayPrevious methods
 * 
 * @example
 * const collection = new YogaSequenceCollection(data);
 * const player = new DisplayablePlayer(collection);
 * player.register(someListener);
 * player.play(5); // Display next item every 5 seconds
 */
export class DisplayablePlayer {
    public displayableCollection: IDisplayableCollection;
    private _listeners: IDisplayListener[];

    /**
     * Creates a DisplayablePlayer instance
     * @constructor
     * @param displayableCollection - Collection implementing nextDisplayable() and previousDisplayable()
     */
    constructor(displayableCollection: IDisplayableCollection) {
        this.displayableCollection = displayableCollection;
        this._listeners = [];
    }

    /**
     * Starts playback at specified interval
     * @param seconds - Interval in seconds between displays
     */
    play(seconds: number): void {
        setTimeout(() => {
            this.displayNext(seconds);
        }, seconds * 1000);
    }

    /**
     * Displays the next item in the collection
     * @param seconds - Interval for recursive playback
     */
    displayNext(seconds: number): void {
        const nextDisplayable = this.displayableCollection.nextDisplayable();
        if (nextDisplayable !== null) {
            this._display(nextDisplayable, seconds);
            this._notifyListenersDisplayNext(nextDisplayable);
        }
    }

    /**
     * Displays the previous item in the collection
     */
    displayPrevious(): void {
        const previousDisplayable = this.displayableCollection.previousDisplayable();
        if (previousDisplayable !== null) {
            this._notifyListenersDisplayPrevious(previousDisplayable);
        }
    }

    /**
     * Registers a listener for display events
     * @param listener - Object with displayNext() and displayPrevious() methods
     */
    register(listener: IDisplayListener): void {
        this._listeners.push(listener);
    }

    // Private methods

    /**
     * Internal display handler that continues playback
     * @private
     * @param _displayable - The displayable item (unused)
     * @param seconds - Interval for next display
     */
    private _display(_displayable: IDisplayable, seconds: number): void {
        this.play(seconds);
    }

    /**
     * Notifies all listeners of next display
     * @private
     * @param newDisplayable - The newly displayed item
     */
    private _notifyListenersDisplayNext(newDisplayable: IDisplayable): void {
        this._listeners.forEach(listener => {
            listener.displayNext(newDisplayable);
        });
    }

    /**
     * Notifies all listeners of previous display
     * @private
     * @param previousDisplayable - The previously displayed item
     */
    private _notifyListenersDisplayPrevious(previousDisplayable: IDisplayable): void {
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
 * @property content - The original content object
 * @property text - The text extracted from content
 * 
 * @example
 * const displayable = new Displayable({ text: 'Hello' });
 * console.log(displayable.text); // 'Hello'
 */
export class Displayable implements IDisplayable {
    public content: IDisplayable;
    public text: string;

    /**
     * Creates a Displayable instance
     * @constructor
     * @param content - Content object with a text property
     */
    constructor(content: IDisplayable) {
        this.content = content;
        this.text = content.text;
    }
}
