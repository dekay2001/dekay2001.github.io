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
});

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

