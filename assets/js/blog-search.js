/**
 * @file Blog Search Functionality
 * @description Provides client-side search across all blog posts using a JSON feed.
 * Supports searching by title and excerpt with result highlighting and keyboard shortcuts.
 */

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
class BlogSearch {
    /**
     * Creates a BlogSearch instance and initializes the search interface
     * @constructor
     */
    constructor() {
        this.posts = [];
        this.allPostsLoaded = false;
        this.searchInput = document.getElementById('blog-search-input');
        this.searchResults = document.getElementById('search-results');
        this.postList = document.getElementById('post-list');
        this.searchContainer = document.getElementById('blog-search-container');
        this.clearButton = document.getElementById('clear-search');
        
        this._init();
    }

    /**
     * Loads all blog posts from the JSON feed
     * @async
     * @returns {Promise<void>}
     * @description Falls back to loading posts from the current page DOM if fetch fails
     */
    async loadAllPosts() {
        try {
            const response = await fetch('/search.json');
            const postsData = await response.json();
            
            this.posts = postsData.map(post => ({
                title: post.title.toLowerCase(),
                titleOriginal: post.title,
                date: post.date,
                url: post.url,
                excerpt: post.excerpt ? post.excerpt.toLowerCase() : '',
                excerptOriginal: post.excerpt || '',
                categories: post.categories || []
            }));
            
            this.allPostsLoaded = true;
        } catch (error) {
            console.error('Error loading posts:', error);
            this._loadPostsFromPage();
        }
    }

    /**
     * Handles search input and filters posts
     * @param {string} query - The search query string
     */
    handleSearch(query) {
        const searchQuery = query.toLowerCase().trim();
        
        if (searchQuery.length === 0) {
            this.showAllPosts();
            return;
        }

        if (searchQuery.length < 2) {
            return; // Wait for at least 2 characters
        }

        // Search in title and excerpt
        const results = this.posts.filter(post => 
            post.title.includes(searchQuery) || 
            post.excerpt.includes(searchQuery)
        );

        this.displayResults(results, searchQuery);
    }

    /**
     * Displays search results with highlighting
     * @param {Array<Object>} results - Array of post objects matching the search
     * @param {string} query - The search query for highlighting
     */
    displayResults(results, query) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="no-results">
                    <p>No posts found matching "<strong>${this._escapeHtml(query)}</strong>"</p>
                    ${this.allPostsLoaded ? '<p class="search-note">Searched across all blog posts</p>' : ''}
                </div>
            `;
            this.searchResults.style.display = 'block';
            this.postList.style.display = 'none';
            return;
        }

        const resultsHtml = results.map(post => {
            const excerptHtml = post.excerptOriginal 
                ? `<span class="post-excerpt">${this._highlightMatch(post.excerptOriginal, query)}</span>`
                : '';
            
            return `
                <li>
                    <a class="postlink" href="${post.url}">
                        <span class="post-title">${this._highlightMatch(post.titleOriginal, query)}</span>
                        <span class="post-date">${post.date}</span>
                        ${excerptHtml}
                    </a>
                </li>
            `;
        }).join('');

        this.searchResults.innerHTML = `
            <div class="search-results-header">
                <p>Found ${results.length} post${results.length !== 1 ? 's' : ''} matching "<strong>${this._escapeHtml(query)}</strong>"</p>
                ${this.allPostsLoaded ? '<p class="search-note">Searched across all blog posts</p>' : ''}
            </div>
            <ul>${resultsHtml}</ul>
        `;
        
        this.searchResults.style.display = 'block';
        this.postList.style.display = 'none';
    }

    /**
     * Shows all posts by hiding search results
     */
    showAllPosts() {
        this.searchResults.style.display = 'none';
        this.postList.style.display = 'block';
    }

    /**
     * Clears the search input and shows all posts
     */
    clearSearch() {
        this.searchInput.value = '';
        this.showAllPosts();
        this.searchInput.focus();
    }

    // Private methods

    /**
     * Initializes event listeners and loads posts
     * @private
     */
    _init() {
        if (!this.searchInput) return;
        
        // Load all posts from JSON feed
        this.loadAllPosts();
        
        // Add event listeners
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.clearButton?.addEventListener('click', () => this.clearSearch());
        
        // Add keyboard shortcut (Ctrl+K or Cmd+K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.searchInput.focus();
            }
        });
    }

    /**
     * Fallback method to load posts from current page DOM
     * @private
     */
    _loadPostsFromPage() {
        const postLinks = document.querySelectorAll('.postlink');
        postLinks.forEach(link => {
            const title = link.querySelector('.post-title')?.textContent || '';
            const date = link.querySelector('.post-date')?.textContent || '';
            const url = link.getAttribute('href');
            
            this.posts.push({
                title: title.toLowerCase(),
                titleOriginal: title,
                date: date,
                url: url,
                excerpt: '',
                excerptOriginal: '',
                categories: []
            });
        });
    }

    /**
     * Highlights matching text in search results
     * @private
     * @param {string} text - The text to highlight
     * @param {string} query - The search query to highlight
     * @returns {string} HTML string with <mark> tags around matches
     */
    _highlightMatch(text, query) {
        if (!query) return this._escapeHtml(text);
        
        const regex = new RegExp(`(${this._escapeRegex(query)})`, 'gi');
        return this._escapeHtml(text).replace(regex, '<mark>$1</mark>');
    }

    /**
     * Escapes HTML to prevent XSS attacks
     * @private
     * @param {string} text - The text to escape
     * @returns {string} Escaped HTML string
     */
    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Escapes special regex characters
     * @private
     * @param {string} str - The string to escape
     * @returns {string} Escaped regex string
     */
    _escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogSearch();
});
