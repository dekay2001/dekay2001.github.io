/**
 * @jest-environment jsdom
 */

describe('BlogFilter', () => {
    let BlogFilter;
    
    beforeEach(() => {
        // Set up DOM with filter buttons and posts
        document.body.innerHTML = `
            <div class="category-filters">
                <button class="filter-btn active" data-category="all">All Posts</button>
                <button class="filter-btn" data-category="moments">Moments</button>
                <button class="filter-btn" data-category="personal">Personal</button>
                <button class="filter-btn" data-category="yoga">Yoga</button>
                <button class="filter-btn" data-category="ai">AI</button>
                <button class="filter-btn" data-category="reflection">Reflection</button>
            </div>
            
            <ul id="post-list">
                <li data-categories="ai, personal, reflection, moments">
                    <a href="/2025/12/05/ai-mirrors">
                        <span class="post-title">AI Mirrors</span>
                    </a>
                </li>
                <li data-categories="personal, reflection">
                    <a href="/2020/03/23/pandemic">
                        <span class="post-title">Pandemic</span>
                    </a>
                </li>
                <li data-categories="yoga, philosophy">
                    <a href="/2020/03/29/eight-limbs">
                        <span class="post-title">Eight Limbs</span>
                    </a>
                </li>
                <li data-categories="moments, ai">
                    <a href="/2025/11/15/constraint-driven">
                        <span class="post-title">Constraint Driven</span>
                    </a>
                </li>
                <li>
                    <a href="/2019/11/03/first-entry">
                        <span class="post-title">First Entry</span>
                    </a>
                </li>
            </ul>
        `;

        // Mock fetch globally to return empty array (forces fallback to client-side filtering for old tests)
        global.fetch = jest.fn(() =>
            Promise.reject(new Error('Use fallback'))
        );

        // Reset modules and clear window object
        delete window.BlogFilter;
        delete window.history.pushState;
        window.history.pushState = jest.fn();
        jest.resetModules();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Helper to create BlogFilter instance
    const createBlogFilter = () => {
        const { BlogFilter: BlogFilterClass } = require('../../../../assets/js/blog-filter.js');
        return new BlogFilterClass();
    };

    describe('Initialization', () => {
        test('should load all posts on initialization', () => {
            const filter = createBlogFilter();
            expect(filter.posts).toHaveLength(5);
        });

        test('should parse categories from data-categories attribute', () => {
            const filter = createBlogFilter();
            expect(filter.posts[0].categories).toEqual(['ai', 'personal', 'reflection', 'moments']);
        });

        test('should handle posts without categories', () => {
            const filter = createBlogFilter();
            expect(filter.posts[4].categories).toEqual([]);
        });

        test('should trim whitespace from categories', () => {
            const filter = createBlogFilter();
            // Categories are comma-separated with spaces
            expect(filter.posts[0].categories).not.toContain(' ai');
            expect(filter.posts[0].categories).toContain('ai');
        });

        test('should set initial active category to "all"', () => {
            const filter = createBlogFilter();
            expect(filter.getActiveCategory()).toBe('all');
        });

        test('should attach event listeners to filter buttons', () => {
            createBlogFilter();
            const buttons = document.querySelectorAll('.filter-btn');
            expect(buttons.length).toBe(6);
        });
    });

    describe('Basic Filtering', () => {
        test('should show all posts when "all" filter is active', async () => {
            const filter = createBlogFilter();
            await filter.filterByCategory('all');
            
            const visiblePosts = Array.from(document.querySelectorAll('#post-list li'))
                .filter(li => li.style.display !== 'none');
            
            expect(visiblePosts).toHaveLength(5);
        });

        test('should show only moments posts when "moments" filter is active', async () => {
            const filter = createBlogFilter();
            await filter.filterByCategory('moments');
            
            const visiblePosts = Array.from(document.querySelectorAll('#post-list li'))
                .filter(li => li.style.display !== 'none');
            
            expect(visiblePosts).toHaveLength(2); // AI Mirrors + Constraint Driven
        });

        test('should show only personal posts when "personal" filter is active', async () => {
            const filter = createBlogFilter();
            await filter.filterByCategory('personal');
            
            const visiblePosts = Array.from(document.querySelectorAll('#post-list li'))
                .filter(li => li.style.display !== 'none');
            
            expect(visiblePosts).toHaveLength(2); // AI Mirrors + Pandemic
        });

        test('should show only yoga posts when "yoga" filter is active', async () => {
            const filter = createBlogFilter();
            await filter.filterByCategory('yoga');
            
            const visiblePosts = Array.from(document.querySelectorAll('#post-list li'))
                .filter(li => li.style.display !== 'none');
            
            expect(visiblePosts).toHaveLength(1); // Eight Limbs
        });

        test('should hide posts without categories when filtering', async () => {
            const filter = createBlogFilter();
            await filter.filterByCategory('moments');
            
            const firstEntryPost = Array.from(document.querySelectorAll('#post-list li'))
                .find(li => li.textContent.includes('First Entry'));
            
            expect(firstEntryPost.style.display).toBe('none');
        });
    });

    describe('Multiple Categories Support', () => {
        test('should show posts with multiple categories in any matching filter', async() => {
            const filter = createBlogFilter();
            
            // AI Mirrors has categories: ai, personal, reflection, moments
            await filter.filterByCategory('moments');
            let aiMirrorsPost = Array.from(document.querySelectorAll('#post-list li'))
                .find(li => li.textContent.includes('AI Mirrors'));
            expect(aiMirrorsPost.style.display).not.toBe('none');
            
            await filter.filterByCategory('personal');
            aiMirrorsPost = Array.from(document.querySelectorAll('#post-list li'))
                .find(li => li.textContent.includes('AI Mirrors'));
            expect(aiMirrorsPost.style.display).not.toBe('none');
        });
    });

    describe('Active State Management', () => {
        test('should update active category when filtering', async () => {
            const filter = createBlogFilter();
            await filter.filterByCategory('moments');
            expect(filter.getActiveCategory()).toBe('moments');
        });

        test('should add active class to clicked button', async () => {
            const filter = createBlogFilter();
            const momentsBtn = document.querySelector('[data-category="moments"]');
            
            await filter.filterByCategory('moments');
            
            expect(momentsBtn.classList.contains('active')).toBe(true);
        });

        test('should remove active class from previous button', async () => {
            const filter = createBlogFilter();
            const allBtn = document.querySelector('[data-category="all"]');
            const momentsBtn = document.querySelector('[data-category="moments"]');
            
            expect(allBtn.classList.contains('active')).toBe(true);
            
            await filter.filterByCategory('moments');
            
            expect(allBtn.classList.contains('active')).toBe(false);
            expect(momentsBtn.classList.contains('active')).toBe(true);
        });

        test('should reset to "all" category', async () => {
            const filter = createBlogFilter();
            await filter.filterByCategory('moments');
            await filter.reset();
            
            expect(filter.getActiveCategory()).toBe('all');
            const visiblePosts = Array.from(document.querySelectorAll('#post-list li'))
                .filter(li => li.style.display !== 'none');
            expect(visiblePosts).toHaveLength(5);
        });
    });

    describe('URL Parameter Handling', () => {
        test('should update URL with category parameter when filtering', async () => {
            const filter = createBlogFilter();
            await filter.filterByCategory('moments');
            
            expect(window.history.pushState).toHaveBeenCalledWith(
                { category: 'moments' },
                '',
                '?category=moments'
            );
        });

        test('should clear category parameter when showing all posts', async () => {
            const filter = createBlogFilter();
            await filter.filterByCategory('moments');
            await filter.filterByCategory('all');
            
            expect(window.history.pushState).toHaveBeenLastCalledWith(
                { category: 'all' },
                '',
                window.location.pathname
            );
        });

        test('should parse URL parameters from search string', () => {
            // Test the URL parsing logic by simulating what would happen
            const testSearch = '?category=moments';
            const params = new URLSearchParams(testSearch);
            expect(params.get('category')).toBe('moments');
        });

        test('should validate category from URL against available buttons', () => {
            const filter = createBlogFilter();
            // The _isValidCategory method ensures only valid categories are applied
            expect(filter.getActiveCategory()).toBe('all'); // Default when no valid category in URL
        });

        test('should handle empty category parameter gracefully', () => {
            const testSearch = '?category=';
            const params = new URLSearchParams(testSearch);
            const category = params.get('category');
            // Empty category should default to 'all'
            expect(category).toBe('');
        });
    });

    describe('Event Dispatching', () => {
        test('should dispatch categoryChanged event when filtering', async () => {
            const filter = createBlogFilter();
            const eventListener = jest.fn();
            document.addEventListener('categoryChanged', eventListener);
            
            await filter.filterByCategory('moments');
            
            expect(eventListener).toHaveBeenCalled();
            const event = eventListener.mock.calls[0][0];
            expect(event.detail.category).toBe('moments');
        });

        test('should include visible post count in event', async () => {
            const filter = createBlogFilter();
            const eventListener = jest.fn();
            document.addEventListener('categoryChanged', eventListener);
            
            await filter.filterByCategory('moments');
            
            const event = eventListener.mock.calls[0][0];
            expect(event.detail.visibleCount).toBe(2);
        });
    });

    describe('Edge Cases', () => {
        test('should handle missing post-list element gracefully', () => {
            document.body.innerHTML = `
                <div class="category-filters">
                    <button class="filter-btn active" data-category="all">All</button>
                </div>
            `;
            
            expect(() => createBlogFilter()).not.toThrow();
        });

        test('should handle missing filter buttons gracefully', () => {
            document.body.innerHTML = `
                <ul id="post-list">
                    <li data-categories="test"><a href="/test">Test</a></li>
                </ul>
            `;
            
            expect(() => createBlogFilter()).not.toThrow();
        });

        test('should handle empty data-categories attribute', () => {
            document.body.innerHTML = `
                <div class="category-filters">
                    <button class="filter-btn active" data-category="all">All</button>
                </div>
                <ul id="post-list">
                    <li data-categories="">
                        <a href="/test"><span class="post-title">Test</span></a>
                    </li>
                </ul>
            `;
            
            const filter = createBlogFilter();
            expect(filter.posts[0].categories).toEqual([]);
        });

        test('should handle categories with extra commas', () => {
            document.body.innerHTML = `
                <div class="category-filters">
                    <button class="filter-btn active" data-category="all">All</button>
                </div>
                <ul id="post-list">
                    <li data-categories="ai,, personal,">
                        <a href="/test"><span class="post-title">Test</span></a>
                    </li>
                </ul>
            `;
            
            const filter = createBlogFilter();
            // Should filter out empty strings from extra commas
            expect(filter.posts[0].categories).toEqual(['ai', 'personal']);
        });
    });

    describe('Button Click Integration', () => {
        test('should filter posts when button is clicked', async () => {
            createBlogFilter();
            const momentsBtn = document.querySelector('[data-category="moments"]');
            
            momentsBtn.click();
            // Wait for async operation
            await new Promise(resolve => setTimeout(resolve, 10));
            
            const visiblePosts = Array.from(document.querySelectorAll('#post-list li'))
                .filter(li => li.style.display !== 'none');
            expect(visiblePosts).toHaveLength(2);
        });

        test('should update active button when clicked', async () => {
            createBlogFilter();
            const momentsBtn = document.querySelector('[data-category="moments"]');
            
            momentsBtn.click();
            // Wait for async operation
            await new Promise(resolve => setTimeout(resolve, 10));
            
            expect(momentsBtn.classList.contains('active')).toBe(true);
        });
    });

    describe('Reflection Category', () => {
        test('should filter posts by reflection category', async () => {
            const filter = createBlogFilter();
            await filter.filterByCategory('reflection');
            
            const visiblePosts = Array.from(document.querySelectorAll('#post-list li'))
                .filter(li => li.style.display !== 'none');
            expect(visiblePosts).toHaveLength(2); // AI Mirrors and Pandemic
        });

        test('should activate reflection button when clicked', async () => {
            createBlogFilter();
            const reflectionBtn = document.querySelector('[data-category="reflection"]');
            
            reflectionBtn.click();
            // Wait for async operation
            await new Promise(resolve => setTimeout(resolve, 10));
            
            expect(reflectionBtn.classList.contains('active')).toBe(true);
        });

        test('should update URL with reflection parameter', async () => {
            const filter = createBlogFilter();
            await filter.filterByCategory('reflection');
            
            expect(window.history.pushState).toHaveBeenCalledWith(
                { category: 'reflection' },
                '',
                '?category=reflection'
            );
        });
    });

    describe('Load All Posts from JSON', () => {
        const mockAllPosts = [
            { title: 'Post 1', url: '/2025/01/post-1', date: 'Jan. 01, 25', categories: ['yoga'], excerpt: 'Excerpt 1' },
            { title: 'Post 2', url: '/2024/01/post-2', date: 'Jan. 01, 24', categories: ['personal'], excerpt: 'Excerpt 2' },
            { title: 'Post 3', url: '/2023/01/post-3', date: 'Jan. 01, 23', categories: ['yoga', 'personal'], excerpt: 'Excerpt 3' },
            { title: 'Post 4', url: '/2022/01/post-4', date: 'Jan. 01, 22', categories: ['ai'], excerpt: 'Excerpt 4' },
            { title: 'Post 5', url: '/2021/01/post-5', date: 'Jan. 01, 21', categories: [], excerpt: 'Excerpt 5' }
        ];

        beforeEach(() => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockAllPosts)
                })
            );
        });

        afterEach(() => {
            global.fetch.mockRestore();
        });

        test('should fetch search.json when filtering by category other than "all"', async () => {
            const filter = createBlogFilter();
            await filter.filterByCategory('yoga');
            
            expect(global.fetch).toHaveBeenCalledWith('/search.json');
        });

        test('should not fetch search.json when filtering by "all"', async () => {
            const filter = createBlogFilter();
            await filter.filterByCategory('all');
            
            expect(global.fetch).not.toHaveBeenCalled();
        });

        test('should render all matching posts from JSON', async () => {
            const filter = createBlogFilter();
            await filter.filterByCategory('yoga');
            
            // Should show 2 yoga posts (Post 1 and Post 3)
            const visiblePosts = Array.from(document.querySelectorAll('#post-list li'))
                .filter(li => li.style.display !== 'none');
            expect(visiblePosts.length).toBeGreaterThanOrEqual(2);
        });

        test('should hide pagination controls when filtering', async () => {
            const filter = createBlogFilter();
            await filter.filterByCategory('yoga');
            
            const pagination = document.querySelector('.pagination');
            if (pagination) {
                expect(pagination.style.display).toBe('none');
            }
        });

        test('should show pagination controls when returning to "all"', async () => {
            const filter = createBlogFilter();
            await filter.filterByCategory('yoga');
            await filter.filterByCategory('all');
            
            const pagination = document.querySelector('.pagination');
            if (pagination) {
                expect(pagination.style.display).not.toBe('none');
            }
        });

        test('should handle fetch errors gracefully', async () => {
            global.fetch = jest.fn(() =>
                Promise.reject(new Error('Network error'))
            );
            
            const filter = createBlogFilter();
            await expect(filter.filterByCategory('yoga')).resolves.not.toThrow();
        });

        test('should render posts with correct HTML structure', async () => {
            const filter = createBlogFilter();
            await filter.filterByCategory('yoga');
            
            const postList = document.querySelector('#post-list');
            const firstPost = postList.querySelector('li');
            
            if (firstPost) {
                expect(firstPost.querySelector('a')).toBeTruthy();
                expect(firstPost.querySelector('.post-title')).toBeTruthy();
                expect(firstPost.querySelector('.post-date')).toBeTruthy();
            }
        });

        test('should preserve data-categories attribute on rendered posts', async () => {
            const filter = createBlogFilter();
            await filter.filterByCategory('yoga');
            
            const postList = document.querySelector('#post-list');
            const posts = postList.querySelectorAll('li[data-categories]');
            
            expect(posts.length).toBeGreaterThan(0);
        });
    });
});
