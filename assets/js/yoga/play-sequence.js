/**
 * @file Yoga Sequence Player
 * @description Manages yoga sequence playback with automated timing and navigation.
 * Handles loading sequences from JSON, displaying poses, and user interactions.
 */

import { DisplayablePlayer, TextDisplayer } from "../base/displayables.js";
import { getResourceCollection } from "../base/models.js";

// Public constants
export const BACK_ARROW = "←";

/**
 * Starts the yoga sequence application
 * @async
 * @param {Object} config - Application configuration
 * @param {string} config.titleDivId - ID of element for sequence title
 * @param {number} config.secondsInterval - Seconds between pose displays
 * @param {string} config.ashtangaSequencesDivId - ID of element for sequence buttons
 * @returns {Promise<void>}
 * @example
 * await startApp({
 *   titleDivId: 'title',
 *   secondsInterval: 5,
 *   ashtangaSequencesDivId: 'sequences'
 * });
 */
export async function startApp(config) {
    const app = new Application(config);
    await app.start();
}

/**
 * Returns available yoga sequence links
 * @returns {Object<string, string>} Map of sequence IDs to JSON file paths
 * @example
 * const links = getSequenceLinks();
 * // { suryanamskaraa: '/assets/data/yoga/...', ... }
 */
export function getSequenceLinks() {
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
    constructor(config) {
        this.config = config;
        this.resourceUrl = config.resourceUrl;
        this.ashtangaSequencesDivId = config.ashtangaSequencesDivId;
        this.sequenceView = new SequenceView(
            config.titleDivId,
            config.secondsInterval
        );
    }

    async start() {
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
    constructor(sequenceView) {
        this.allSeriesOptions = null;
        this.sequenceView = sequenceView;
    }

    async displayAll(displayInElementId) {
        this.allSeriesOptions = await this._createSeriesOptions();
        this._displayAll(displayInElementId);
    }

    displayPrevious() {
        this.sequenceView.displayPrevious();
    }

    _displayAll(displayInElementId) {
        const displayInElement = document.getElementById(displayInElementId);
        const buttons = this._createButtons();
        buttons.forEach(button => {
            displayInElement.appendChild(button);
        });
    }

    async _createSeriesOptions() {
        const interactiveResources = getResourceCollection('../assets/data/yoga/interactive-series.json');
        await interactiveResources.fetchAll();
        return interactiveResources.data.items;
    }

    _createButtons() {
        return this.allSeriesOptions.map(seriesOption => this._createButton(seriesOption));
    }

    _createButton(seriesOption) {
        const button = document.createElement("button");
        button.innerText = seriesOption.name;
        button.id = seriesOption.id;
        button.addEventListener("click", async () => {
            await this._playSequence(`..${seriesOption.ref}`);
        });
        return button;
    }

    async _playSequence(resourceUrl) {
        const yogaSequence = await this._getYogaSequenceCollection(resourceUrl);
        this.sequenceView.displaySequence(yogaSequence);
    }

    async _getYogaSequenceCollection(resourceUrl) {
        const resourceCollection = getResourceCollection(resourceUrl);
        await resourceCollection.fetchAll();
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
    constructor(titleDivId, secondsInterval) {
        this._titleDivId = titleDivId;
        this._secondsInterval = secondsInterval;
        this._player = null;
        this._backButton = null;
    }

    displaySequence(yogaSequence) {
        this._displaySequenceTitle(yogaSequence);
        this._play(yogaSequence);
        this._displayBackButton();
    }

    _displayBackButton() {
        const displayInElement = document.getElementById("yoga-sequences");
        this._backButton = new PreviousPoseButton("previous-pose", BACK_ARROW, this._player);
        displayInElement.appendChild(this._backButton.playerButton);
    }

    _displaySequenceTitle(yogaSequence) {
        const titleDisplayer = new TextDisplayer(this._titleDivId);
        titleDisplayer.display(yogaSequence);
    }

    _play(yogaSequenceCollection) {
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
    constructor(id, text, player) {
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
 * @property {string} text - The sequence title
 * @property {number} nextIndex - Current position in sequence (-1 = not started)
 * @property {Object} data - The raw sequence data
 * @property {Array<Object>} data.items - Array of yoga pose objects
 * 
 * @example
 * const collection = new YogaSequenceCollection({
 *   title: 'Sun Salutation A',
 *   items: [{ name: 'Tadasana', englishName: 'Mountain Pose' }, ...]
 * });
 */
export class YogaSequenceCollection {
    /**
     * Creates a YogaSequenceCollection instance
     * @constructor
     * @param {Object} yogaSequenceData - Sequence data with title and items
     * @param {string} yogaSequenceData.title - Sequence name
     * @param {Array<Object>} yogaSequenceData.items - Array of poses
     */
    constructor(yogaSequenceData) {
        this.text = yogaSequenceData.title;
        this.nextIndex = -1;
        this.data = yogaSequenceData;
    }

    /**
     * Gets the next displayable pose in sequence
     * @returns {Object|null} The next yoga pose or null if at end
     */
    nextDisplayable() {
        this.nextIndex++;
        if (this._hasItems() && this.nextIndex < this.data.items.length) {
            return this._yogaPose(this.nextIndex);
        }
        return null;
    }

    /**
     * Gets the previous displayable pose in sequence
     * @returns {Object|null} The previous yoga pose or null if at start
     */
    previousDisplayable() {
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
     * @returns {boolean} True if items exist
     */
    _hasItems() {
        return this.data.items.length > 0;
    }

    /**
     * Gets yoga pose at specified index
     * @private
     * @param {number} index - Index in items array
     * @returns {Object} The yoga pose data
     */
    _yogaPose(index) {
        return this.data.items[index];
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
 * @property {Object} _greetingDisplayer - TextDisplayer for greeting messages
 * @property {Object} _currentPoseData - Currently displayed pose
 * @property {number} _nextCount - Number of poses displayed
 * @property {Document} _document - Document object for testing
 * 
 * @example
 * const displayer = new YogaPoseDisplayer();
 * player.register(displayer);
 * // Automatically called by player:
 * // displayer.displayNext(poseData);
 */
export class YogaPoseDisplayer {
    /**
     * Creates a YogaPoseDisplayer instance
     * @constructor
     * @param {TextDisplayer} [greetingDisplayer=null] - Optional custom greeting displayer
     * @param {Document} [doc=null] - Optional document object for testing
     */
    constructor(greetingDisplayer = null, doc = null) {
        this._currentPoseData = null;
        this._greetingDisplayer = greetingDisplayer || new TextDisplayer("ashtanga-sequences");
        this._displayGreetingText('Get ready...');
        this._nextCount = 0;
        this._document = doc || document;
        this._setBackButtonText('');
    }

    /**
     * Displays the next yoga pose
     * @param {Object} yogaPoseData - Pose data to display
     * @param {string} yogaPoseData.name - Sanskrit name
     * @param {string} yogaPoseData.englishName - English name
     */
    displayNext(yogaPoseData) {
        this._clearGreetingText();
        this._display(yogaPoseData);
        this._nextCount++;
        this._setBackButtonText(BACK_ARROW);
    }

    /**
     * Displays the previous yoga pose
     * @param {Object|null} yogaPoseData - Pose data to display or null
     */
    displayPrevious(yogaPoseData) {
        if (yogaPoseData !== null) {
            this._display(yogaPoseData);
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
    _clearGreetingText() {
        if (this._isDisplayingPose()) {
            this._displayGreetingText('');
        }
    }

    /**
     * Displays greeting text
     * @private
     * @param {string} greetingText - Text to display
     */
    _displayGreetingText(greetingText) {
        this._greetingDisplayer.display({ text: greetingText });
    }

    /**
     * Displays yoga pose data in DOM
     * @private
     * @param {Object} yogaPoseData - Pose data to display
     */
    _display(yogaPoseData) {
        this._currentPoseData = yogaPoseData;
        this._setInnerText("name", yogaPoseData.name);
        this._setInnerText("englishName", yogaPoseData.englishName);
    }

    /**
     * Sets back button text
     * @private
     * @param {string} text - Text to set
     */
    _setBackButtonText(text) {
        this._setInnerText('previous-pose', text);
    }

    /**
     * Checks if currently displaying a pose
     * @private
     * @returns {boolean} True if no pose displayed yet
     */
    _isDisplayingPose() {
        return this._currentPoseData === null;
    }

    /**
     * Sets inner text of element by ID
     * @private
     * @param {string} elementId - DOM element ID
     * @param {string} text - Text to set
     */
    _setInnerText(elementId, text) {
        const displayInElement = this._document.getElementById(elementId);
        if (displayInElement !== null) {
            displayInElement.innerText = text;
        } else {
            console.log(`Could not find element ${elementId} to set ${text}.`);
        }
    }
}
