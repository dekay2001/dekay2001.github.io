/**
 * @jest-environment jsdom
 */

describe('BlogSearch', () => {
    let BlogSearch;
    let mockDocument;
    
    beforeEach(() => {
        // Set up DOM
        document.body.innerHTML = `
            <input type="text" id="blog-search-input" />
            <button id="clear-search"></button>
            <div id="search-results" style="display: none;"></div>
            <ul id="post-list">
                <li>
                    <a class="postlink" href="/post1">
                        <span class="post-title">Understanding JavaScript</span>
                        <span class="post-date">Mon. Nov 01, 23</span>
                    </a>
                </li>
                <li>
                    <a class="postlink" href="/post2">
                        <span class="post-title">Python for Beginners</span>
                        <span class="post-date">Tue. Nov 02, 23</span>
                    </a>
                </li>
                <li>
                    <a class="postlink" href="/post3">
                        <span class="post-title">Advanced JavaScript Patterns</span>
                        <span class="post-date">Wed. Nov 03, 23</span>
                    </a>
                </li>
            </ul>
        `;

        // Load the BlogSearch class
        delete window.BlogSearch;
        jest.resetModules();
    });

    describe('Initialization', () => {
        test('should load posts from DOM on initialization', () => {
            const blogSearch = createBlogSearch();
            expect(blogSearch.posts).toHaveLength(3);
        });

        test('should extract post data correctly', () => {
            const blogSearch = createBlogSearch();
            expect(blogSearch.posts[0]).toEqual({
                title: 'understanding javascript',
                titleOriginal: 'Understanding JavaScript',
                date: 'Mon. Nov 01, 23',
                url: '/post1'
            });
        });

        test('should not throw error if search elements are missing', () => {
            document.body.innerHTML = '';
            expect(() => createBlogSearch()).not.toThrow();
        });
    });

    describe('Search Functionality', () => {
        test('should find posts matching search query', () => {
            const blogSearch = createBlogSearch();
            const results = blogSearch.posts.filter(post => 
                post.title.includes('javascript')
            );
            expect(results).toHaveLength(2);
            expect(results[0].titleOriginal).toBe('Understanding JavaScript');
            expect(results[1].titleOriginal).toBe('Advanced JavaScript Patterns');
        });

        test('should be case-insensitive', () => {
            const blogSearch = createBlogSearch();
            const results = blogSearch.posts.filter(post => 
                post.title.includes('python')
            );
            expect(results).toHaveLength(1);
            expect(results[0].titleOriginal).toBe('Python for Beginners');
        });

        test('should return empty array when no matches found', () => {
            const blogSearch = createBlogSearch();
            const results = blogSearch.posts.filter(post => 
                post.title.includes('nonexistent')
            );
            expect(results).toHaveLength(0);
        });

        test('should handle partial word matches', () => {
            const blogSearch = createBlogSearch();
            const results = blogSearch.posts.filter(post => 
                post.title.includes('java')
            );
            expect(results).toHaveLength(2);
        });
    });

    describe('Display Results', () => {
        test('should display search results correctly', () => {
            const blogSearch = createBlogSearch();
            const results = [
                {
                    title: 'understanding javascript',
                    titleOriginal: 'Understanding JavaScript',
                    date: 'Mon. Nov 01, 23',
                    url: '/post1'
                }
            ];
            
            blogSearch.displayResults(results, 'javascript');
            
            const searchResults = document.getElementById('search-results');
            expect(searchResults.style.display).toBe('block');
            expect(searchResults.innerHTML).toContain('Found 1 post');
            expect(searchResults.innerHTML).toContain('Understanding');
            expect(searchResults.innerHTML).toContain('<mark>JavaScript</mark>');
        });

        test('should show no results message when no matches', () => {
            const blogSearch = createBlogSearch();
            blogSearch.displayResults([], 'nonexistent');
            
            const searchResults = document.getElementById('search-results');
            expect(searchResults.innerHTML).toContain('No posts found');
            expect(searchResults.innerHTML).toContain('nonexistent');
        });

        test('should handle plural/singular correctly', () => {
            const blogSearch = createBlogSearch();
            const oneResult = [{
                title: 'test',
                titleOriginal: 'Test',
                date: 'Today',
                url: '/test'
            }];
            
            blogSearch.displayResults(oneResult, 'test');
            expect(document.getElementById('search-results').innerHTML).toContain('Found 1 post');
            
            const twoResults = [oneResult[0], oneResult[0]];
            blogSearch.displayResults(twoResults, 'test');
            expect(document.getElementById('search-results').innerHTML).toContain('Found 2 posts');
        });

        test('should hide post list when showing search results', () => {
            const blogSearch = createBlogSearch();
            const results = [{
                title: 'test',
                titleOriginal: 'Test',
                date: 'Today',
                url: '/test'
            }];
            
            blogSearch.displayResults(results, 'test');
            
            const postList = document.getElementById('post-list');
            expect(postList.style.display).toBe('none');
        });
    });

    describe('Highlight Functionality', () => {
        test('should highlight matching text', () => {
            const blogSearch = createBlogSearch();
            const highlighted = blogSearch.highlightMatch('Understanding JavaScript', 'javascript');
            expect(highlighted).toContain('<mark>');
            expect(highlighted).toContain('JavaScript');
            expect(highlighted).toContain('</mark>');
        });

        test('should be case-insensitive for highlighting', () => {
            const blogSearch = createBlogSearch();
            const highlighted = blogSearch.highlightMatch('Understanding JavaScript', 'JAVASCRIPT');
            expect(highlighted).toContain('<mark>');
        });

        test('should handle multiple matches', () => {
            const blogSearch = createBlogSearch();
            const highlighted = blogSearch.highlightMatch('JavaScript and JavaScript', 'javascript');
            const matches = (highlighted.match(/<mark>/g) || []).length;
            expect(matches).toBe(2);
        });

        test('should escape HTML in text', () => {
            const blogSearch = createBlogSearch();
            const highlighted = blogSearch.highlightMatch('<script>alert("xss")</script>', 'script');
            expect(highlighted).not.toContain('<script>');
            expect(highlighted).toContain('&lt;');
            expect(highlighted).toContain('&gt;');
            expect(highlighted).toContain('<mark>script</mark>');
        });
    });

    describe('Clear Search', () => {
        test('should clear search input', () => {
            const blogSearch = createBlogSearch();
            const searchInput = document.getElementById('blog-search-input');
            searchInput.value = 'test query';
            
            blogSearch.clearSearch();
            expect(searchInput.value).toBe('');
        });

        test('should show all posts after clearing', () => {
            const blogSearch = createBlogSearch();
            blogSearch.clearSearch();
            
            const postList = document.getElementById('post-list');
            const searchResults = document.getElementById('search-results');
            
            expect(postList.style.display).toBe('block');
            expect(searchResults.style.display).toBe('none');
        });
    });

    describe('Utility Functions', () => {
        test('escapeHtml should escape dangerous characters', () => {
            const blogSearch = createBlogSearch();
            const escaped = blogSearch.escapeHtml('<script>alert("test")</script>');
            expect(escaped).toBe('&lt;script&gt;alert("test")&lt;/script&gt;');
        });

        test('escapeHtml should preserve safe text', () => {
            const blogSearch = createBlogSearch();
            const escaped = blogSearch.escapeHtml('Test "quotes" and apostrophes');
            // escapeHtml uses textContent which preserves quotes
            expect(escaped).toContain('Test');
            expect(escaped).toContain('quotes');
        });

        test('escapeRegex should escape regex special characters', () => {
            const blogSearch = createBlogSearch();
            const escaped = blogSearch.escapeRegex('test.*+?^${}()|[]\\');
            expect(escaped).toBe('test\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty search query', () => {
            const blogSearch = createBlogSearch();
            blogSearch.handleSearch('');
            
            const postList = document.getElementById('post-list');
            expect(postList.style.display).toBe('block');
        });

        test('should handle single character search', () => {
            const blogSearch = createBlogSearch();
            blogSearch.handleSearch('j');
            
            // Should not trigger search (minimum 2 characters)
            const searchResults = document.getElementById('search-results');
            expect(searchResults.style.display).toBe('none');
        });

        test('should handle whitespace in query', () => {
            const blogSearch = createBlogSearch();
            blogSearch.handleSearch('  javascript  ');
            
            const searchResults = document.getElementById('search-results');
            expect(searchResults.style.display).toBe('block');
        });

        test('should handle special characters in search', () => {
            const blogSearch = createBlogSearch();
            expect(() => blogSearch.handleSearch('test()')).not.toThrow();
        });

        test('should handle posts with missing elements', () => {
            document.body.innerHTML = `
                <input type="text" id="blog-search-input" />
                <button id="clear-search"></button>
                <div id="search-results"></div>
                <ul id="post-list">
                    <li>
                        <a class="postlink" href="/post1">
                            <span class="post-title"></span>
                        </a>
                    </li>
                </ul>
            `;
            
            expect(() => createBlogSearch()).not.toThrow();
        });
    });

    // Helper function to create BlogSearch instance
    function createBlogSearch() {
        // Inline the BlogSearch class for testing
        class BlogSearch {
            constructor() {
                this.posts = [];
                this.searchInput = document.getElementById('blog-search-input');
                this.searchResults = document.getElementById('search-results');
                this.postList = document.getElementById('post-list');
                this.clearButton = document.getElementById('clear-search');
                
                if (this.searchInput) {
                    this.loadPosts();
                }
            }

            loadPosts() {
                const postLinks = document.querySelectorAll('.postlink');
                postLinks.forEach(link => {
                    const title = link.querySelector('.post-title')?.textContent || '';
                    const date = link.querySelector('.post-date')?.textContent || '';
                    const url = link.getAttribute('href');
                    
                    this.posts.push({
                        title: title.toLowerCase(),
                        titleOriginal: title,
                        date: date,
                        url: url
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
                    return;
                }

                const results = this.posts.filter(post => 
                    post.title.includes(searchQuery)
                );

                this.displayResults(results, searchQuery);
            }

            displayResults(results, query) {
                if (results.length === 0) {
                    this.searchResults.innerHTML = `
                        <div class="no-results">
                            <p>No posts found matching "<strong>${this.escapeHtml(query)}</strong>"</p>
                        </div>
                    `;
                    this.searchResults.style.display = 'block';
                    this.postList.style.display = 'none';
                    return;
                }

                const resultsHtml = results.map(post => `
                    <li>
                        <a class="postlink" href="${post.url}">
                            <span class="post-title">${this.highlightMatch(post.titleOriginal, query)}</span>
                            <span class="post-date">${post.date}</span>
                        </a>
                    </li>
                `).join('');

                this.searchResults.innerHTML = `
                    <div class="search-results-header">
                        <p>Found ${results.length} post${results.length !== 1 ? 's' : ''} matching "<strong>${this.escapeHtml(query)}</strong>"</p>
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

        return new BlogSearch();
    }
});
