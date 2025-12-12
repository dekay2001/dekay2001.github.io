/**
 * @file Resource Collection Models
 * @description Provides data models for fetching and managing remote JSON resources.
 */

/**
 * Creates a new ResourceCollection instance
 * @param resourceUrl - The URL of the JSON resource to fetch
 * @returns A new ResourceCollection instance
 * @example
 * const collection = getResourceCollection('/assets/data/yoga/sequences.json');
 * await collection.fetchAll();
 * console.log(collection.data);
 */
export function getResourceCollection<T = unknown>(resourceUrl: string): ResourceCollection<T> {
    return new ResourceCollection<T>(resourceUrl);
}

/**
 * ResourceCollection - Manages fetching and storing remote JSON data
 * 
 * @class
 * @description Provides a simple interface for fetching JSON resources
 * and storing the parsed data.
 * 
 * @property resourceUrl - The URL of the resource
 * @property data - The fetched and parsed JSON data
 * 
 * @example
 * const collection = new ResourceCollection<Post[]>('/data/posts.json');
 * await collection.fetchAll();
 * // collection.data now contains the parsed JSON
 */
class ResourceCollection<T = unknown> {
    public resourceUrl: string;
    public data: T | null;

    /**
     * Creates a ResourceCollection instance
     * @constructor
     * @param resourceUrl - The URL of the JSON resource to fetch
     */
    constructor(resourceUrl: string) {
        this.resourceUrl = resourceUrl;
        this.data = null;
    }

    /**
     * Fetches and parses the JSON resource
     * @async
     * @returns Promise that resolves when data is fetched
     * @throws Error if fetch fails or JSON parsing fails
     */
    async fetchAll(): Promise<void> {
        const response = await fetch(this.resourceUrl);
        this.data = await response.json();
    }
}

export { ResourceCollection };
