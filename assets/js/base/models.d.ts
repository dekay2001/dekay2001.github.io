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
export declare function getResourceCollection<T = unknown>(resourceUrl: string): ResourceCollection<T>;
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
declare class ResourceCollection<T = unknown> {
    resourceUrl: string;
    data: T | null;
    /**
     * Creates a ResourceCollection instance
     * @constructor
     * @param resourceUrl - The URL of the JSON resource to fetch
     */
    constructor(resourceUrl: string);
    /**
     * Fetches and parses the JSON resource
     * @async
     * @returns Promise that resolves when data is fetched
     * @throws Error if fetch fails or JSON parsing fails
     */
    fetchAll(): Promise<void>;
}
export { ResourceCollection };
//# sourceMappingURL=models.d.ts.map