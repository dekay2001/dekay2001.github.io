/**
 * @jest-environment jsdom
 */

const { TestScheduler } = require('@jest/core');
const models = require('../../../../../assets/js/base/models.js');


describe("models.getResourceCollection", () => {
    test("Initializes with resourceUrl and no data", () => {
        const url = "http://myUrl";
        const collection = models.getResourceCollection(url);
        expect(collection.resourceUrl).toEqual(url);
        expect(collection.data).toEqual(null);
    });

    it("can fetchAll on returned ResourceCollection", async () => {
        global.fetch = jest.fn(() => Promise.resolve({
            json: async () => ({ "id": "15" })
        }));
        const uri = "../../../../../assets/data/advanced-series.json";
        const collection = models.getResourceCollection(uri);
        await collection.fetchAll();
        expect(collection.data.id).toEqual("15")
    });
});