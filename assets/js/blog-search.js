// Blog Search Functionality
class BlogSearch {
    constructor() {
        this.posts = [];
        this.allPostsLoaded = false;
        this.searchInput = document.getElementById('blog-search-input');
        this.searchResults = document.getElementById('search-results');
        this.postList = document.getElementById('post-list');
        this.searchContainer = document.getElementById('blog-search-container');
        this.clearButton = document.getElementById('clear-search');
        
        this.init();
    }

    init() {
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
            // Fallback to current page posts
            this.loadPostsFromPage();
        }
    }

    loadPostsFromPage() {
        // Fallback: Get post links from the current page
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

    displayResults(results, query) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="no-results">
                    <p>No posts found matching "<strong>${this.escapeHtml(query)}</strong>"</p>
                    ${this.allPostsLoaded ? '<p class="search-note">Searched across all blog posts</p>' : ''}
                </div>
            `;
            this.searchResults.style.display = 'block';
            this.postList.style.display = 'none';
            return;
        }

        const resultsHtml = results.map(post => {
            const excerptHtml = post.excerptOriginal 
                ? `<span class="post-excerpt">${this.highlightMatch(post.excerptOriginal, query)}</span>`
                : '';
            
            return `
                <li>
                    <a class="postlink" href="${post.url}">
                        <span class="post-title">${this.highlightMatch(post.titleOriginal, query)}</span>
                        <span class="post-date">${post.date}</span>
                        ${excerptHtml}
                    </a>
                </li>
            `;
        }).join('');

        this.searchResults.innerHTML = `
            <div class="search-results-header">
                <p>Found ${results.length} post${results.length !== 1 ? 's' : ''} matching "<strong>${this.escapeHtml(query)}</strong>"</p>
                ${this.allPostsLoaded ? '<p class="search-note">Searched across all blog posts</p>' : ''}
            </div>
            <ul>${resultsHtml}</ul>
        `;
        
        this.searchResults.style.display = 'block';
        this.postList.style.display = 'none';
    }

    highlightMatch(text, query) {
        if (!query) return this.escapeHtml(text);
        
        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return this.escapeHtml(text).replace(regex, '<mark>$1</mark>');
    }

    showAllPosts() {
        this.searchResults.style.display = 'none';
        this.postList.style.display = 'block';
    }

    clearSearch() {
        this.searchInput.value = '';
        this.showAllPosts();
        this.searchInput.focus();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogSearch();
});
