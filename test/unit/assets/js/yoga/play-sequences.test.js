const { TestScheduler } = require('@jest/core');

const ps = require('../../../../../assets/js/yoga/play-sequence.js');

describe('YogaSequenceCollection', () => {
    it("returns null when no items", () => {
        const yogaSequnceData = getData(0);
        const collection = new ps.YogaSequenceCollection(yogaSequnceData);
        expect(collection.nextDisplayable()).toBeNull();
    });

    it("returns the all poses and then null", () => {
        const yogaSequnceData = getData(2);
        const collection = new ps.YogaSequenceCollection(yogaSequnceData);
        let next = collection.nextDisplayable();
        expect(next.name).toEqual("name 0");
        expect(next.englishName).toEqual("EN 0");
        next = collection.nextDisplayable();
        expect(next.name).toEqual("name 1");
        expect(next.englishName).toEqual("EN 1");
        expect(collection.nextDisplayable()).toBeNull();
    });

    it('returns null when no items and previousDisplayable is called', () => {
        const yogaSequenceData = getData(0);
        const collection = new ps.YogaSequenceCollection(yogaSequenceData);
        expect(collection.previousDisplayable()).toBeNull();
    });

    it('returns first displayable', () => {
        const yogaSequnceData = getData(2);
        const collection = new ps.YogaSequenceCollection(yogaSequnceData);
        collection.nextDisplayable();
        collection.nextDisplayable();
        const previous = collection.previousDisplayable();
        expect(previous.name).toEqual("name 0")
    });
});

describe('YogaPoseDisplayer', () => {

    it('invokes set greeting text with get ready...', () => {
        const textDisplayer = new TextDisplayerDouble();
        const displayer = new ps.YogaPoseDisplayer(textDisplayer);
        expect(textDisplayer.invokedDisplayWith.text).toEqual('Get ready...');
    });

    it('clears greeting text and displays yogaPoseData', () => {
        const textDisplayer = new TextDisplayerDouble();
        const document = new DocumentDouble();
        const displayer = new ps.YogaPoseDisplayer(textDisplayer, document);
        const poseData = getPoseData();
        displayer.displayNext(poseData);
        expect(textDisplayer.invokedDisplayWith).toEqual({ text: '' });
        expect(document.invokedSetInnerTextWith['name']).toEqual('name 0');
        expect(document.invokedSetInnerTextWith['englishName']).toEqual('EN 0');
    });
});

class TextDisplayerDouble {
    constructor() {
        this.invokedDisplayWith = null;
    }

    display(greetingText) {
        this.invokedDisplayWith = greetingText;
    }
}

class DocumentDouble {
    constructor() {
        this.elements = [];
        this.invokedSetInnerTextWith = {};
        this._innerText = null;
    }

    get innerText() {
        return this._innerText;
    }

    set innerText(value) {
        this.invokedSetInnerTextWith[this._lastElementId] = value;
    }

    getElementById(elementId) {
        this._lastElementId = elementId;
        return this;
    }


}

function getPoseData() {
    return getData(1).items[0];
}

function getData(poseCount) {
    const yogaSequnceData = {
        title: "my sequence title",
        items: []
    };
    for (let index = 0; index < poseCount; index++) {
        yogaSequnceData.items.push(
            { name: `name ${index}`, englishName: `EN ${index}` }
        );
    }
    return yogaSequnceData;
};
