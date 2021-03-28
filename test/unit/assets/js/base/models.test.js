const { TestScheduler } = require('@jest/core');
const models = require('../../../../../assets/js/base/models.js');


describe("models.get_resource_collection", () => {
    test("Initializes with resourceUrl and no data", () => {
        const url = "http://myUrl";
        const collection = models.get_resource_collection(url);
        expect(collection.resourceUrl).toEqual(url);
        expect(collection.data).toEqual(null);
    });

    it("can fetchAll on returned ResourceCollection", async () => {
        window.fetch = jest.fn(() => Promise.resolve({
            json: async () => ({ "id": "15" })
        }));
        const uri = "../../../../../assets/data/advanced-series.json";
        const collection = models.get_resource_collection(uri);
        await collection.fetchAll();
        expect(collection.data.id).toEqual("15")
    });
});