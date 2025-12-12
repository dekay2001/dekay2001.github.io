/**
 * @file Blog Search Functionality
 * @description Provides client-side search across all blog posts using a JSON feed.
 * Supports searching by title and excerpt with result highlighting and keyboard shortcuts.
 */
/**
 * Post data structure from search.json
 */
interface PostData {
    title: string;
    date: string;
    url: string;
    excerpt?: string;
    categories?: string[];
}
/**
 * Internal searchable post structure
 */
interface SearchablePost {
    title: string;
    titleOriginal: string;
    date: string;
    url: string;
    excerpt: string;
    excerptOriginal: string;
    categories: string[];
}
/**
 * BlogSearch - Manages blog post search functionality
 *
 * @class
 * @description Provides site-wide blog search with the following features:
 * - Fetches all posts from /search.json for comprehensive searching
 * - Real-time search as user types
 * - Highlights matching terms in results
 * - Keyboard shortcut (Ctrl/Cmd+K) to focus search
 * - XSS protection through HTML escaping
 *
 * @example
 * // Automatically initialized on DOMContentLoaded
 * const search = new BlogSearch();
 */
declare class BlogSearch {
    private posts;
    private allPostsLoaded;
    private searchInput;
    private searchResults;
    private postList;
    private clearButton;
    /**
     * Creates a BlogSearch instance and initializes the search interface
     * @constructor
     */
    constructor();
    /**
     * Loads all blog posts from the JSON feed
     * @async
     * @returns Promise that resolves when posts are loaded
     * @description Falls back to loading posts from the current page DOM if fetch fails
     */
    loadAllPosts(): Promise<void>;
    /**
     * Handles search input and filters posts
     * @param query - The search query string
     */
    handleSearch(query: string): void;
    /**
     * Displays search results with highlighting
     * @param results - Array of post objects matching the search
     * @param query - The search query for highlighting
     */
    displayResults(results: SearchablePost[], query: string): void;
    /**
     * Shows all posts by hiding search results
     */
    showAllPosts(): void;
    /**
     * Clears the search input and shows all posts
     */
    clearSearch(): void;
    /**
     * Initializes event listeners and loads posts
     * @private
     */
    private _init;
    /**
     * Fallback method to load posts from current page DOM
     * @private
     */
    private _loadPostsFromPage;
    /**
     * Highlights matching text in search results
     * @private
     * @param text - The text to highlight
     * @param query - The search query to highlight
     * @returns HTML string with <mark> tags around matches
     */
    private _highlightMatch;
    /**
     * Escapes HTML to prevent XSS attacks
     * @private
     * @param text - The text to escape
     * @returns Escaped HTML string
     */
    private _escapeHtml;
    /**
     * Escapes special regex characters
     * @private
     * @param str - The string to escape
     * @returns Escaped regex string
     */
    private _escapeRegex;
}
//# sourceMappingURL=blog-search.d.ts.map