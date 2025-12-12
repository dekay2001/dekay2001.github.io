/**
 * @jest-environment jsdom
 */

import { getResourceCollection } from '../../../../../src/base/models';


describe("models.getResourceCollection", () => {
    test("Initializes with resourceUrl and no data", () => {
        const url = "http://myUrl";
        const collection = getResourceCollection(url);
        expect(collection.resourceUrl).toEqual(url);
        expect(collection.data).toEqual(null);
    });

    it("can fetchAll on returned ResourceCollection", async () => {
        global.fetch = jest.fn(() => Promise.resolve({
            json: async () => ({ "id": "15" })
        }) as any);
        const uri = "../../../../../assets/data/advanced-series.json";
        const collection = getResourceCollection(uri);
        await collection.fetchAll();
        expect((collection.data as any).id).toEqual("15")
    });
});