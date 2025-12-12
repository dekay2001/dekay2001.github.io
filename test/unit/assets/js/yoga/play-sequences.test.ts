import { YogaSequenceCollection, YogaPoseDisplayer, BACK_ARROW, YogaSequenceData, YogaPoseData } from '../../../../../src/yoga/play-sequence';

describe('YogaSequenceCollection', () => {
    it("returns null when no items", () => {
        const yogaSequnceData = getData(0);
        const collection = new YogaSequenceCollection(yogaSequnceData);
        expect(collection.nextDisplayable()).toBeNull();
    });

    it("returns the all poses and then null", () => {
        const yogaSequnceData = getData(2);
        const collection = new YogaSequenceCollection(yogaSequnceData);
        let next = collection.nextDisplayable() as YogaPoseData;
        expect(next.name).toEqual("name 0");
        expect(next.englishName).toEqual("EN 0");
        next = collection.nextDisplayable() as YogaPoseData;
        expect(next.name).toEqual("name 1");
        expect(next.englishName).toEqual("EN 1");
        expect(collection.nextDisplayable()).toBeNull();
    });

    it('returns null when no items and previousDisplayable is called', () => {
        const yogaSequenceData = getData(0);
        const collection = new YogaSequenceCollection(yogaSequenceData);
        expect(collection.previousDisplayable()).toBeNull();
    });

    it('returns first displayable', () => {
        const yogaSequnceData = getData(2);
        const collection = new YogaSequenceCollection(yogaSequnceData);
        collection.nextDisplayable();
        collection.nextDisplayable();
        const previous = collection.previousDisplayable() as YogaPoseData;
        expect(previous.name).toEqual("name 0")
    });
});

describe('YogaPoseDisplayer', () => {

    it('invokes set greeting text with get ready...', () => {
        const textDisplayer = new TextDisplayerDouble();
        const document = new DocumentDouble();
        void new YogaPoseDisplayer(textDisplayer as any, document as any);
        expect(textDisplayer.invokedDisplayWith.text).toEqual('Get ready...');
    });

    it('invokes hide previous button initially', () => {
        const textDisplayer = new TextDisplayerDouble();
        const document = new DocumentDouble();
        void new YogaPoseDisplayer(textDisplayer as any, document as any);
        expect(document.invokedSetInnerTextWith['previous-pose']).toEqual('');
    });

    it('clears greeting text, displays next yogaPoseData, and displays back button', () => {
        const textDisplayer = new TextDisplayerDouble();
        const document = new DocumentDouble();
        const displayer = new YogaPoseDisplayer(textDisplayer as any, document as any);
        const poseData = getPoseData();
        displayer.displayNext(poseData);
        expect(textDisplayer.invokedDisplayWith).toEqual({ text: '' });
        expect(document.invokedSetInnerTextWith['name']).toEqual('name 0');
        expect(document.invokedSetInnerTextWith['englishName']).toEqual('EN 0');
        expect(document.invokedSetInnerTextWith['previous-pose']).toEqual(BACK_ARROW);
    });

    it('displays get ready... when previous yogaPoseData is null', () => {
        const textDisplayer = new TextDisplayerDouble();
        const document = new DocumentDouble();
        const displayer = new YogaPoseDisplayer(textDisplayer as any, document as any);
        const poseData = getPoseData();
        expect(displayer.displayPrevious(poseData)).toEqual(undefined);
        expect(textDisplayer.invokedDisplayWith).toEqual({ text: 'Get ready...' });
        expect(document.invokedSetInnerTextWith['name']).toEqual('name 0');
        expect(document.invokedSetInnerTextWith['englishName']).toEqual('EN 0');
    });

    it('displays previous yogaPoseData hides previous pose button', () => {
        const textDisplayer = new TextDisplayerDouble();
        const document = new DocumentDouble();
        const displayer = new YogaPoseDisplayer(textDisplayer as any, document as any);
        (displayer as any)._nextCount = 1;
        const poseData = getPoseData();
        displayer.displayPrevious(poseData)
        expect(document.invokedSetInnerTextWith['previous-pose']).toEqual('');
    });

    it('handles missing DOM elements gracefully without throwing errors', () => {
        const textDisplayer = new TextDisplayerDouble();
        const document = new DocumentDoubleWithNullElements();
        
        // Should not throw when elements don't exist (return null)
        expect(() => {
            new YogaPoseDisplayer(textDisplayer as any, document as any);
        }).not.toThrow();
        
        // Should not throw when trying to display poses with missing elements
        const displayer = new YogaPoseDisplayer(textDisplayer as any, document as any);
        const poseData = getPoseData();
        expect(() => {
            displayer.displayNext(poseData);
        }).not.toThrow();
    });
});

class TextDisplayerDouble {
    public invokedDisplayWith: any;

    constructor() {
        this.invokedDisplayWith = null;
    }

    display(greetingText: any): void {
        this.invokedDisplayWith = greetingText;
    }
}

class DocumentDouble {
    public elements: any[];
    public invokedSetInnerTextWith: Record<string, any>;
    private _innerText: any;
    private _lastElementId: string;

    constructor() {
        this.elements = [];
        this.invokedSetInnerTextWith = {};
        this._innerText = null;
        this._lastElementId = '';
    }

    get innerText(): any {
        return this._innerText;
    }

    set innerText(value: any) {
        this.invokedSetInnerTextWith[this._lastElementId] = value;
    }

    getElementById(elementId: string): this {
        this._lastElementId = elementId;
        return this;
    }
}

class DocumentDoubleWithNullElements {
    public invokedSetInnerTextWith: Record<string, any>;

    constructor() {
        this.invokedSetInnerTextWith = {};
    }

    getElementById(_elementId: string): null {
        // Simulates missing DOM elements by returning null
        return null;
    }
}

function getPoseData(): YogaPoseData {
    return getData(1).items[0]!;
}

function getData(poseCount: number): YogaSequenceData {
    const yogaSequnceData: YogaSequenceData = {
        title: "my sequence title",
        items: []
    };
    for (let index = 0; index < poseCount; index++) {
        yogaSequnceData.items.push(
            { name: `name ${index}`, englishName: `EN ${index}`, text: `Pose ${index}` }
        );
    }
    return yogaSequnceData;
};
