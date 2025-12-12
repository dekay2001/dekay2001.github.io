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
export declare class TextDisplayer {
    elementId: string;
    /**
     * Creates a TextDisplayer instance
     * @constructor
     * @param elementId - The ID of the DOM element to display text in
     */
    constructor(elementId: string);
    /**
     * Displays the text content of a displayable object
     * @param displayable - An object with a text property
     */
    display(displayable: IDisplayable): void;
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
export declare class DisplayablePlayer {
    displayableCollection: IDisplayableCollection;
    private _listeners;
    /**
     * Creates a DisplayablePlayer instance
     * @constructor
     * @param displayableCollection - Collection implementing nextDisplayable() and previousDisplayable()
     */
    constructor(displayableCollection: IDisplayableCollection);
    /**
     * Starts playback at specified interval
     * @param seconds - Interval in seconds between displays
     */
    play(seconds: number): void;
    /**
     * Displays the next item in the collection
     * @param seconds - Interval for recursive playback
     */
    displayNext(seconds: number): void;
    /**
     * Displays the previous item in the collection
     */
    displayPrevious(): void;
    /**
     * Registers a listener for display events
     * @param listener - Object with displayNext() and displayPrevious() methods
     */
    register(listener: IDisplayListener): void;
    /**
     * Internal display handler that continues playback
     * @private
     * @param _displayable - The displayable item (unused)
     * @param seconds - Interval for next display
     */
    private _display;
    /**
     * Notifies all listeners of next display
     * @private
     * @param newDisplayable - The newly displayed item
     */
    private _notifyListenersDisplayNext;
    /**
     * Notifies all listeners of previous display
     * @private
     * @param previousDisplayable - The previously displayed item
     */
    private _notifyListenersDisplayPrevious;
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
export declare class Displayable implements IDisplayable {
    content: IDisplayable;
    text: string;
    /**
     * Creates a Displayable instance
     * @constructor
     * @param content - Content object with a text property
     */
    constructor(content: IDisplayable);
}
//# sourceMappingURL=displayables.d.ts.map