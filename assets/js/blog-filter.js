/**
 * @file Blog Category Filter
 * @description Provides category filtering for blog posts with URL parameter support.
 * Integrates with BlogSearch for combined filtering and search functionality.
 */

// Constants
const SELECTORS = {
    POST_LIST: 'post-list',
    FILTER_BUTTONS: '.filter-btn'
};

const ATTRIBUTES = {
    DATA_CATEGORY: 'data-category',
    DATA_CATEGORIES: 'data-categories'
};

const CSS_CLASSES = {
    ACTIVE: 'active'
};

const CATEGORIES = {
    ALL: 'all'
};

/**
 * BlogFilter - Manages blog post category filtering
 * 
 * @class
 * @description Provides category-based filtering with the following features:
 * - Filters posts by category (all, moments, personal, yoga, etc.)
 * - Updates URL with category parameter
 * - Reads category from URL on initialization
 * - Dispatches events for integration with search
 * - Handles posts with multiple categories
 * 
 * @example
 * // Automatically initialized on DOMContentLoaded
 * const filter = new BlogFilter();
 */
export class BlogFilter {
    /**
     * Creates a BlogFilter instance and initializes the filtering interface
     * @constructor
     */
    constructor() {
        this.posts = [];
        this.activeCategory = CATEGORIES.ALL;
        this.postList = document.getElementById(SELECTORS.POST_LIST);
        this.filterButtons = document.querySelectorAll(SELECTORS.FILTER_BUTTONS);
        
        this._init();
    }

    /**
     * Gets the currently active category
     * @returns {string} The active category
     */
    getActiveCategory() {
        return this.activeCategory;
    }

    /**
     * Filters posts by category
     * @param {string} category - The category to filter by ('all' shows all posts)
     */
    async filterByCategory(category) {
        this.activeCategory = category;
        
        // If filtering by 'all', restore original paginated posts
        if (category === CATEGORIES.ALL) {
            this._restorePaginatedView();
            this._updateActiveButton(category);
            this._updateURL(category);
            
            const visibleCount = this.posts.filter(p => p.element.style.display !== 'none').length;
            this._dispatchCategoryChangedEvent(category, visibleCount);
            return;
        }
        
        // Otherwise, fetch and show all matching posts from JSON
        try {
            const allPosts = await this._fetchAllPosts();
            const filteredPosts = allPosts.filter(post => 
                post.categories && post.categories.includes(category)
            );
            
            this._renderFilteredPosts(filteredPosts);
            this._hidePagination();
            this._updateActiveButton(category);
            this._updateURL(category);
            this._dispatchCategoryChangedEvent(category, filteredPosts.length);
        } catch (error) {
            console.error('Failed to load posts:', error);
            // Fallback to client-side filtering of current page
            this._filterCurrentPagePosts(category);
        }
    }

    /**
     * Resets the filter to show all posts
     */
    async reset() {
        await this.filterByCategory(CATEGORIES.ALL);
    }

    /**
     * Fetches all posts from search.json
     * @private
     * @returns {Promise<Array>} Array of all posts
     */
    async _fetchAllPosts() {
        const response = await fetch('/search.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    /**
     * Renders filtered posts in the post list
     * @private
     * @param {Array} posts - Array of post objects to render
     */
    _renderFilteredPosts(posts) {
        if (!this.postList) return;
        
        // Clear and render filtered posts
        this.postList.innerHTML = '';
        
        posts.forEach(post => {
            const li = document.createElement('li');
            li.setAttribute(ATTRIBUTES.DATA_CATEGORIES, post.categories.join(', '));
            
            li.innerHTML = `
                <a class="postlink" href="${post.url}">
                    <span class="post-title">${post.title}</span>
                    <span class="post-date">${post.date}</span>
                </a>
            `;
            
            this.postList.appendChild(li);
        });
    }

    /**
     * Initializes the filter by loading posts and setting up event listeners
     * @private
     */
    _init() {
        // Store original HTML before any filtering
        if (this.postList) {
            this.originalPostListHTML = this.postList.innerHTML;
        }
        
        this._loadPostsFromDOM();
        this._attachEventListeners();
        this._loadCategoryFromURL();
    }

    /**
     * Loads post data from DOM elements
     * @private
     */
    _loadPostsFromDOM() {
        if (!this.postList) {
            return;
        }

        const postItems = this.postList.querySelectorAll('li');
        
        postItems.forEach(item => {
            const categoriesAttr = item.getAttribute(ATTRIBUTES.DATA_CATEGORIES);
            const categories = categoriesAttr 
                ? categoriesAttr.split(',')
                    .map(cat => cat.trim())
                    .filter(cat => cat.length > 0)
                : [];

            this.posts.push({
                element: item,
                categories: categories
            });
        });
    }

    /**
     * Attaches click event listeners to filter buttons
     * @private
     */
    _attachEventListeners() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute(ATTRIBUTES.DATA_CATEGORY);
                this.filterByCategory(category);
            });
        });
    }

    /**
     * Loads category from URL parameter and applies filter
     * @private
     */
    _loadCategoryFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category && this._isValidCategory(category)) {
            this.filterByCategory(category);
        }
    }

    /**
     * Checks if a category is valid (has a corresponding button)
     * @private
     * @param {string} category - The category to validate
     * @returns {boolean} True if the category is valid
     */
    _isValidCategory(category) {
        return Array.from(this.filterButtons).some(btn => 
            btn.getAttribute(ATTRIBUTES.DATA_CATEGORY) === category
        );
    }

    /**
     * Fetches all posts from search.json
     * @private
     * @returns {Promise<Array>} Array of all posts
     */
    async _fetchAllPosts() {
        const response = await fetch('/search.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    /**
     * Renders filtered posts in the post list
     * @private
     * @param {Array} posts - Array of post objects to render
     */
    _renderFilteredPosts(posts) {
        if (!this.postList) return;
        
        // Clear and render filtered posts
        this.postList.innerHTML = '';
        
        posts.forEach(post => {
            const li = document.createElement('li');
            li.setAttribute(ATTRIBUTES.DATA_CATEGORIES, post.categories.join(', '));
            
            // li.innerHTML = `
            //     <a class="postlink" href="${post.url}">
            //         <span class="post-title">${post.title}</span>
            //         <span class="post-date">${post.date}</span>
            //     </a>
            // `;
            const link = document.createElement('a');  
            link.className = 'postlink';  
            link.href = post.url;  

            const titleSpan = document.createElement('span');  
            titleSpan.className = 'post-title';  
            titleSpan.textContent = post.title;  

            const dateSpan = document.createElement('span');  
            dateSpan.className = 'post-date';  
            dateSpan.textContent = post.date;  

            link.appendChild(titleSpan);  
            link.appendChild(dateSpan);  

            li.appendChild(link);
            
            this.postList.appendChild(li);
        });
    }

    /**
     * Restores the original paginated view
     * @private
     */
    _restorePaginatedView() {
        if (this.originalPostListHTML && this.postList) {
            this.postList.innerHTML = this.originalPostListHTML;
            // Reload posts from restored DOM
            this.posts = [];
            this._loadPostsFromDOM();
        }
        this._showPagination();
    }

    /**
     * Filters posts on the current page (fallback)
     * @private
     * @param {string} category - The category to filter by
     */
    _filterCurrentPagePosts(category) {
        let visibleCount = 0;

        this.posts.forEach(post => {
            const shouldShow = category === CATEGORIES.ALL || post.categories.includes(category);
            post.element.style.display = shouldShow ? '' : 'none';
            
            if (shouldShow) {
                visibleCount++;
            }
        });

        this._updateActiveButton(category);
        this._updateURL(category);
        this._dispatchCategoryChangedEvent(category, visibleCount);
    }

    /**
     * Hides pagination controls
     * @private
     */
    _hidePagination() {
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            pagination.style.display = 'none';
        }
    }

    /**
     * Shows pagination controls
     * @private
     */
    _showPagination() {
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            pagination.style.display = '';
        }
    }

    /**
     * Updates the active state of filter buttons
     * @private
     * @param {string} category - The active category
     */
    _updateActiveButton(category) {
        this.filterButtons.forEach(button => {
            const buttonCategory = button.getAttribute(ATTRIBUTES.DATA_CATEGORY);
            if (buttonCategory === category) {
                button.classList.add(CSS_CLASSES.ACTIVE);
            } else {
                button.classList.remove(CSS_CLASSES.ACTIVE);
            }
        });
    }

    /**
     * Updates the URL with the current category parameter
     * @private
     * @param {string} category - The active category
     */
    _updateURL(category) {
        const url = category === CATEGORIES.ALL 
            ? window.location.pathname 
            : `?category=${category}`;
        
        window.history.pushState({ category }, '', url);
    }

    /**
     * Dispatches a custom event when category changes
     * @private
     * @param {string} category - The active category
     * @param {number} visibleCount - Number of visible posts
     */
    _dispatchCategoryChangedEvent(category, visibleCount) {
        const event = new CustomEvent('categoryChanged', {
            detail: {
                category: category,
                visibleCount: visibleCount
            }
        });
        document.dispatchEvent(event);
    }
}

// Auto-initialize on DOMContentLoaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.blogFilter = new BlogFilter();
    });
}
