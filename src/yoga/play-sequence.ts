/**
 * @file Yoga Sequence Player
 * @description Manages yoga sequence playback with automated timing and navigation.
 * Handles loading sequences from JSON, displaying poses, and user interactions.
 */

import { DisplayablePlayer, TextDisplayer, IDisplayable, IDisplayableCollection } from "../base/displayables.js";
import { getResourceCollection } from "../base/models.js";

// Public constants
export const BACK_ARROW = "←";

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
 * Series option from interactive JSON
 */
interface SeriesOption {
    id: string;
    name: string;
    ref: string;
}

/**
 * Interactive series data structure
 */
interface InteractiveSeriesData {
    items: SeriesOption[];
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
export async function startApp(config: AppConfig): Promise<void> {
    const app = new Application(config);
    await app.start();
}

/**
 * Returns available yoga sequence links
 * @returns Map of sequence IDs to JSON file paths
 * @example
 * const links = getSequenceLinks();
 * // { suryanamskaraa: '/assets/data/yoga/...', ... }
 */
export function getSequenceLinks(): SequenceLinks {
    return {
        suryanamskaraa: "/assets/data/yoga/suryanamaskara-a.json",
        fundamental: "/assets/data/yoga/fundamental-basic-sequence.json"
    };
}

// Private classes

/**
 * Application - Main application controller
 * @private
 * @class
 */
class Application {
    private ashtangaSequencesDivId: string;
    private sequenceView: SequenceView;

    constructor(config: AppConfig) {
        this.ashtangaSequencesDivId = config.ashtangaSequencesDivId;
        this.sequenceView = new SequenceView(
            config.titleDivId,
            config.secondsInterval
        );
    }

    async start(): Promise<void> {
        const controller = new SequencesView(this.sequenceView);
        await controller.displayAll(this.ashtangaSequencesDivId);
    }
}

/**
 * SequencesView - Manages display of available sequences
 * @private
 * @class
 */
class SequencesView {
    private allSeriesOptions: SeriesOption[] | null;
    private sequenceView: SequenceView;

    constructor(sequenceView: SequenceView) {
        this.allSeriesOptions = null;
        this.sequenceView = sequenceView;
    }

    async displayAll(displayInElementId: string): Promise<void> {
        this.allSeriesOptions = await this._createSeriesOptions();
        this._displayAll(displayInElementId);
    }

    displayPrevious(): void {
        this.sequenceView.displayPrevious();
    }

    private _displayAll(displayInElementId: string): void {
        const displayInElement = document.getElementById(displayInElementId);
        if (!displayInElement) return;
        
        const buttons = this._createButtons();
        buttons.forEach(button => {
            displayInElement.appendChild(button);
        });
    }

    private async _createSeriesOptions(): Promise<SeriesOption[]> {
        const interactiveResources = getResourceCollection<InteractiveSeriesData>('../assets/data/yoga/interactive-series.json');
        await interactiveResources.fetchAll();
        return interactiveResources.data?.items ?? [];
    }

    private _createButtons(): HTMLButtonElement[] {
        if (!this.allSeriesOptions) return [];
        return this.allSeriesOptions.map(seriesOption => this._createButton(seriesOption));
    }

    private _createButton(seriesOption: SeriesOption): HTMLButtonElement {
        const button = document.createElement("button");
        button.innerText = seriesOption.name;
        button.id = seriesOption.id;
        button.addEventListener("click", async () => {
            await this._playSequence(`..${seriesOption.ref}`);
        });
        return button;
    }

    private async _playSequence(resourceUrl: string): Promise<void> {
        const yogaSequence = await this._getYogaSequenceCollection(resourceUrl);
        this.sequenceView.displaySequence(yogaSequence);
    }

    private async _getYogaSequenceCollection(resourceUrl: string): Promise<YogaSequenceCollection> {
        const resourceCollection = getResourceCollection<YogaSequenceData>(resourceUrl);
        await resourceCollection.fetchAll();
        if (!resourceCollection.data) {
            throw new Error(`Failed to load sequence from ${resourceUrl}`);
        }
        return new YogaSequenceCollection(resourceCollection.data);
    }
}

/**
 * SequenceView - Controls individual sequence display and playback
 * @private
 * @class
 * @todo Refactor back button to use observer pattern with BackButtonDisplayer
 */
class SequenceView {
    private _titleDivId: string;
    private _secondsInterval: number;
    private _player: DisplayablePlayer | null;
    private _backButton: PreviousPoseButton | null;

    constructor(titleDivId: string, secondsInterval: number) {
        this._titleDivId = titleDivId;
        this._secondsInterval = secondsInterval;
        this._player = null;
        this._backButton = null;
    }

    displaySequence(yogaSequence: YogaSequenceCollection): void {
        this._displaySequenceTitle(yogaSequence);
        this._play(yogaSequence);
        this._displayBackButton();
    }

    displayPrevious(): void {
        if (this._player) {
            this._player.displayPrevious();
        }
    }

    private _displayBackButton(): void {
        const displayInElement = document.getElementById("yoga-sequences");
        if (!displayInElement || !this._player) return;
        
        this._backButton = new PreviousPoseButton("previous-pose", BACK_ARROW, this._player);
        displayInElement.appendChild(this._backButton.playerButton);
    }

    private _displaySequenceTitle(yogaSequence: YogaSequenceCollection): void {
        const titleDisplayer = new TextDisplayer(this._titleDivId);
        titleDisplayer.display(yogaSequence);
    }

    private _play(yogaSequenceCollection: YogaSequenceCollection): void {
        const displayer = new YogaPoseDisplayer();
        this._player = new DisplayablePlayer(yogaSequenceCollection);
        this._player.register(displayer);
        this._player.play(this._secondsInterval);
    }
}

/**
 * PreviousPoseButton - Back button for sequence navigation
 * @private
 * @class
 */
class PreviousPoseButton {
    public playerButton: HTMLButtonElement;
    private player: DisplayablePlayer;

    constructor(id: string, text: string, player: DisplayablePlayer) {
        this.playerButton = document.createElement("button");
        this.playerButton.innerText = text;
        this.playerButton.id = id;
        this.player = player;
        this.playerButton.addEventListener("click", () => {
            this.player.displayPrevious();
        });
    }
}

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
export class YogaSequenceCollection implements IDisplayableCollection, IDisplayable {
    public text: string;
    public nextIndex: number;
    public data: YogaSequenceData;

    /**
     * Creates a YogaSequenceCollection instance
     * @constructor
     * @param yogaSequenceData - Sequence data with title and items
     */
    constructor(yogaSequenceData: YogaSequenceData) {
        this.text = yogaSequenceData.title;
        this.nextIndex = -1;
        this.data = yogaSequenceData;
    }

    /**
     * Gets the next displayable pose in sequence
     * @returns The next yoga pose or null if at end
     */
    nextDisplayable(): IDisplayable | null {
        this.nextIndex++;
        if (this._hasItems() && this.nextIndex < this.data.items.length) {
            return this._yogaPose(this.nextIndex);
        }
        return null;
    }

    /**
     * Gets the previous displayable pose in sequence
     * @returns The previous yoga pose or null if at start
     */
    previousDisplayable(): IDisplayable | null {
        if (this.nextIndex > 0) {
            this.nextIndex--;
            return this._yogaPose(this.nextIndex);
        }
        return null;
    }

    // Private methods

    /**
     * Checks if sequence has items
     * @private
     * @returns True if items exist
     */
    private _hasItems(): boolean {
        return this.data.items.length > 0;
    }

    /**
     * Gets yoga pose at specified index
     * @private
     * @param index - Index in items array
     * @returns The yoga pose data
     */
    private _yogaPose(index: number): YogaPoseData {
        return this.data.items[index]!;
    }
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
export class YogaPoseDisplayer {
    private _currentPoseData: YogaPoseData | null;
    private _greetingDisplayer: TextDisplayer;
    private _nextCount: number;
    private _document: Document;

    /**
     * Creates a YogaPoseDisplayer instance
     * @constructor
     * @param greetingDisplayer - Optional custom greeting displayer
     * @param doc - Optional document object for testing
     */
    constructor(greetingDisplayer: TextDisplayer | null = null, doc: Document | null = null) {
        this._currentPoseData = null;
        this._greetingDisplayer = greetingDisplayer || new TextDisplayer("ashtanga-sequences");
        this._displayGreetingText('Get ready...');
        this._nextCount = 0;
        this._document = doc || document;
        this._setBackButtonText('');
    }

    /**
     * Displays the next yoga pose
     * @param yogaPoseData - Pose data to display
     */
    displayNext(yogaPoseData: IDisplayable): void {
        const poseData = yogaPoseData as unknown as YogaPoseData;
        this._clearGreetingText();
        this._display(poseData);
        this._nextCount++;
        this._setBackButtonText(BACK_ARROW);
    }

    /**
     * Displays the previous yoga pose
     * @param yogaPoseData - Pose data to display
     */
    displayPrevious(yogaPoseData: IDisplayable): void {
        const poseData = yogaPoseData as YogaPoseData;
        if (poseData !== null) {
            this._display(poseData);
            this._nextCount--;
        }
        if (this._nextCount === 0) {
            this._setBackButtonText('');
        }
    }

    // Private methods

    /**
     * Clears greeting text if currently displayed
     * @private
     */
    private _clearGreetingText(): void {
        if (this._isDisplayingPose()) {
            this._displayGreetingText('');
        }
    }

    /**
     * Displays greeting text
     * @private
     * @param greetingText - Text to display
     */
    private _displayGreetingText(greetingText: string): void {
        this._greetingDisplayer.display({ text: greetingText });
    }

    /**
     * Displays yoga pose data in DOM
     * @private
     * @param yogaPoseData - Pose data to display
     */
    private _display(yogaPoseData: YogaPoseData): void {
        this._currentPoseData = yogaPoseData;
        this._setInnerText("name", yogaPoseData.name);
        this._setInnerText("englishName", yogaPoseData.englishName);
    }

    /**
     * Sets back button text
     * @private
     * @param text - Text to set
     */
    private _setBackButtonText(text: string): void {
        this._setInnerText('previous-pose', text);
    }

    /**
     * Checks if currently displaying a pose
     * @private
     * @returns True if no pose displayed yet
     */
    private _isDisplayingPose(): boolean {
        return this._currentPoseData === null;
    }

    /**
     * Sets inner text of element by ID
     * @private
     * @param elementId - DOM element ID
     * @param text - Text to set
     */
    private _setInnerText(elementId: string, text: string): void {
        const displayInElement = this._document.getElementById(elementId);
        if (displayInElement !== null) {
            displayInElement.innerText = text;
        } else {
            console.log(`Could not find element ${elementId} to set ${text}.`);
        }
    }
}
