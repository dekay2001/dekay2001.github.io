/**
 * @file Resource Collection Models
 * @description Provides data models for fetching and managing remote JSON resources.
 */

/**
 * Creates a new ResourceCollection instance
 * @param {string} resourceUrl - The URL of the JSON resource to fetch
 * @returns {ResourceCollection} A new ResourceCollection instance
 * @example
 * const collection = getResourceCollection('/assets/data/yoga/sequences.json');
 * await collection.fetchAll();
 * console.log(collection.data);
 */
export function getResourceCollection(resourceUrl) {
    return new ResourceCollection(resourceUrl);
}

/**
 * ResourceCollection - Manages fetching and storing remote JSON data
 * 
 * @class
 * @description Provides a simple interface for fetching JSON resources
 * and storing the parsed data.
 * 
 * @property {string} resourceUrl - The URL of the resource
 * @property {Object|null} data - The fetched and parsed JSON data
 * 
 * @example
 * const collection = new ResourceCollection('/data/posts.json');
 * await collection.fetchAll();
 * // collection.data now contains the parsed JSON
 */
class ResourceCollection {
    /**
     * Creates a ResourceCollection instance
     * @constructor
     * @param {string} resourceUrl - The URL of the JSON resource to fetch
     */
    constructor(resourceUrl) {
        this.resourceUrl = resourceUrl;
        this.data = null;
    }

    /**
     * Fetches and parses the JSON resource
     * @async
     * @returns {Promise<void>}
     * @throws {Error} If fetch fails or JSON parsing fails
     */
    async fetchAll() {
        const response = await fetch(this.resourceUrl);
        this.data = await response.json();
    }
}