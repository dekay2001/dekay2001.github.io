/**
 * @file Yoga Sequence Player
 * @description Manages yoga sequence playback with automated timing and navigation.
 * Handles loading sequences from JSON, displaying poses, and user interactions.
 */
import { TextDisplayer, IDisplayable, IDisplayableCollection } from "../base/displayables.js";
export declare const BACK_ARROW = "\u2190";
/**
 * Application configuration interface
 */
export interface AppConfig {
    titleDivId: string;
    secondsInterval: number;
    ashtangaSequencesDivId: string;
    resourceUrl?: string;
}
/**
 * Sequence link mapping
 */
export interface SequenceLinks {
    [key: string]: string;
}
/**
 * Yoga pose data structure
 */
export interface YogaPoseData extends IDisplayable {
    name: string;
    englishName: string;
}
/**
 * Yoga sequence data structure
 */
export interface YogaSequenceData {
    title: string;
    items: YogaPoseData[];
}
/**
 * Starts the yoga sequence application
 * @async
 * @param config - Application configuration
 * @returns Promise that resolves when app is started
 * @example
 * await startApp({
 *   titleDivId: 'title',
 *   secondsInterval: 5,
 *   ashtangaSequencesDivId: 'sequences'
 * });
 */
export declare function startApp(config: AppConfig): Promise<void>;
/**
 * Returns available yoga sequence links
 * @returns Map of sequence IDs to JSON file paths
 * @example
 * const links = getSequenceLinks();
 * // { suryanamskaraa: '/assets/data/yoga/...', ... }
 */
export declare function getSequenceLinks(): SequenceLinks;
/**
 * YogaSequenceCollection - Manages yoga pose sequences
 *
 * @class
 * @description Provides iteration through a collection of yoga poses with
 * forward and backward navigation capabilities.
 *
 * @property text - The sequence title
 * @property nextIndex - Current position in sequence (-1 = not started)
 * @property data - The raw sequence data
 *
 * @example
 * const collection = new YogaSequenceCollection({
 *   title: 'Sun Salutation A',
 *   items: [{ name: 'Tadasana', englishName: 'Mountain Pose' }, ...]
 * });
 */
export declare class YogaSequenceCollection implements IDisplayableCollection, IDisplayable {
    text: string;
    nextIndex: number;
    data: YogaSequenceData;
    /**
     * Creates a YogaSequenceCollection instance
     * @constructor
     * @param yogaSequenceData - Sequence data with title and items
     */
    constructor(yogaSequenceData: YogaSequenceData);
    /**
     * Gets the next displayable pose in sequence
     * @returns The next yoga pose or null if at end
     */
    nextDisplayable(): IDisplayable | null;
    /**
     * Gets the previous displayable pose in sequence
     * @returns The previous yoga pose or null if at start
     */
    previousDisplayable(): IDisplayable | null;
    /**
     * Checks if sequence has items
     * @private
     * @returns True if items exist
     */
    private _hasItems;
    /**
     * Gets yoga pose at specified index
     * @private
     * @param index - Index in items array
     * @returns The yoga pose data
     */
    private _yogaPose;
}
/**
 * YogaPoseDisplayer - Observer for displaying yoga poses
 *
 * @class
 * @description Listens to DisplayablePlayer events and updates the DOM
 * with yoga pose information. Manages greeting text, pose names, and
 * back button visibility.
 *
 * @property _greetingDisplayer - TextDisplayer for greeting messages
 * @property _currentPoseData - Currently displayed pose
 * @property _nextCount - Number of poses displayed
 * @property _document - Document object for testing
 *
 * @example
 * const displayer = new YogaPoseDisplayer();
 * player.register(displayer);
 * // Automatically called by player:
 * // displayer.displayNext(poseData);
 */
export declare class YogaPoseDisplayer {
    private _currentPoseData;
    private _greetingDisplayer;
    private _nextCount;
    private _document;
    /**
     * Creates a YogaPoseDisplayer instance
     * @constructor
     * @param greetingDisplayer - Optional custom greeting displayer
     * @param doc - Optional document object for testing
     */
    constructor(greetingDisplayer?: TextDisplayer | null, doc?: Document | null);
    /**
     * Displays the next yoga pose
     * @param yogaPoseData - Pose data to display
     */
    displayNext(yogaPoseData: IDisplayable): void;
    /**
     * Displays the previous yoga pose
     * @param yogaPoseData - Pose data to display
     */
    displayPrevious(yogaPoseData: IDisplayable): void;
    /**
     * Clears greeting text if currently displayed
     * @private
     */
    private _clearGreetingText;
    /**
     * Displays greeting text
     * @private
     * @param greetingText - Text to display
     */
    private _displayGreetingText;
    /**
     * Displays yoga pose data in DOM
     * @private
     * @param yogaPoseData - Pose data to display
     */
    private _display;
    /**
     * Sets back button text
     * @private
     * @param text - Text to set
     */
    private _setBackButtonText;
    /**
     * Checks if currently displaying a pose
     * @private
     * @returns True if no pose displayed yet
     */
    private _isDisplayingPose;
    /**
     * Sets inner text of element by ID
     * @private
     * @param elementId - DOM element ID
     * @param text - Text to set
     */
    private _setInnerText;
}
//# sourceMappingURL=play-sequence.d.ts.map