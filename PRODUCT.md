# Product

## Purpose
`dekay2001.github.io` is a personal GitHub Pages site used to publish writing and interactive projects. The site currently centers on a blog experience with search and category filtering, and also includes resume, yoga, playground, and related personal sections.

## Primary User Experience
- Read blog posts in a paginated list.
- Filter posts by category from the blog index.
- Search posts by title and excerpt from the blog index.
- Open dedicated content areas (resume, yoga, playground) from navigation.

## Core Sections
- Home: lightweight landing content from `index.md`.
- Blog: paginated post listing with category filters and search.
- Resume: structured professional profile page.
- Yoga: interactive sequence and related content.
- Playground and other sections: experiments and side content.

## Content Model
- Blog posts are markdown files in `_posts/` using date-prefixed filenames.
- Navigation is data-driven via `_data/navigation.yml`.
- Layout structure is handled in `_layouts/` and shared fragments in `_includes/`.

## Blog Experience Requirements
- Pagination is enabled via Jekyll config (`paginate: 10`).
- Category filtering supports multi-category posts.
- Search uses `search.json` as a cross-post index and falls back to current-page data when needed.

## Non-Functional Expectations
- GitHub Pages compatibility first.
- Maintainable JavaScript with strong test coverage for behavior-heavy modules.
- Fast static delivery and graceful fallback behavior for client-side features.

## Success Criteria
- New features align with existing information architecture.
- Blog UX remains stable: pagination, filtering, and search continue to work together.
- Changes preserve GitHub Pages deployment compatibility and existing content paths.

## Roadmap

> **Cross-roadmap status mapping** (see `roadmap-index.md` in the ai-prompts-library repo): items listed here use **Done** plus Priority/Effort. Done ≈ 📖 Published; un-started backlog items ≈ 📝 Idea; in-progress ≈ ✍️ Drafting.

### Done

- **Title:** Resume Page Overhaul — Showcase AI Leadership & Personal Projects
- **Why:** Resume hasn't been updated since November 2025. Significant work on Project Alpha (prompt engineering research lab), two Jekyll sites, and continued WiseTech Global lead engineer role are not reflected.
- **Scope (in):** Rewrite professional summary to emphasize AI-driven leadership. Add 2025-2026 WiseTech bullets (AI velocity, prompt engineering, Graph API, Sybase migration). Add "Personal & Open Source Projects" section (Project Alpha, dekay2001.github.io, Dover Run Club). Add "Thought Leadership" section (book chapters, frameworks, moments). Update technical skills table (bump AI/Copilot to 9, add Jekyll/Jest/ES6, extend HTML/CSS/JS ranges to 2026). Add employer acquisition context (Profit Tools → Valsoft → Envase → WiseTech). Trim/consolidate pre-2017 bullets.
- **Scope (out):** Layout or styling changes to resume template. New resume page URL or navigation changes.
- **Priority:** P3
- **Effort:** M
- **Status:** Done

### Code Quality (May 2026 Audit)

- **Title:** Security & Dead Code Cleanup
- **Why:** IE conditional comments load html5shiv over HTTP from defunct Google Code URL (mixed content, dead code). External `target="_blank"` links lack `rel="noopener"` (reverse tabnabbing). Orphaned `playground.js` never referenced. Empty `books/` directory (exists but contains no files).
- **Scope (in):** Remove IE conditional comments from all layouts and standalone pages. Add `rel="noopener noreferrer"` to all `target="_blank"` links (post.html, resume.html, mainpic.html). Delete `assets/js/playground.js`. Delete empty `books/` directory.
- **Scope (out):** Template restructuring. Content changes.
- **Priority:** P1
- **Effort:** S
- **Status:** Done

- **Title:** Template Consolidation (Head Extraction + Layout Merge)
- **Why:** Entire `<head>` section is copy-pasted across 6+ files. `post.html` and `resume.html` layouts are near-identical. Standalone pages (blog, yoga, playground) don't use layouts. Duplicate lyrical-learner page exists at two URLs.
- **Scope (in):** Extract `_includes/head.html` partial with parameterized CSS. Merge post/resume layouts using front matter variable for responsive CSS. Convert standalone pages to use head include. Delete duplicate `/playground/lyrical-learner/index.html`.
- **Scope (out):** Visual/styling changes. Content changes.
- **Priority:** P1
- **Effort:** M
- **Status:** Done

- **Title:** CSS DRY Refactoring
- **Why:** Identical tablet/desktop responsive rules for nav, hamburger, header/footer width repeated in responsive-default.css, responsive-post.css, and responsive-resume.css.
- **Scope (in):** Move shared nav/header responsive rules into `style.css` media queries. Remove duplicated rules from responsive-post and responsive-resume. Consolidate where possible.
- **Scope (out):** New visual features. Color/spacing changes.
- **Priority:** P2
- **Effort:** S
- **Status:** Done

- **Title:** SEO & Accessibility Improvements
- **Why:** Meta description hardcoded as "Blog" in layout files (`default.html`, `post.html`, `resume.html`) and `blog/index.html`. No Open Graph tags. No canonical URLs. Footer uses invalid `<i><span><p>` nesting. Post dates only visible on hover (inaccessible). Header hardcodes "Think Clearly" instead of `{{ site.title }}`. Nav label "Learn-Ashtanga" inconsistent with URL `/yoga/`.
- **Scope (in):** Implement dynamic `<title>` with fallback to site.title. Add page-level meta descriptions via front matter. Add Open Graph meta tags in head.html. Add canonical URLs. Fix footer semantic HTML. Make post dates visible by default. Use `{{ site.title }}` in navheader. Rename nav label to "Yoga".
- **Scope (out):** Content rewrites. Layout restructuring.
- **Priority:** P2
- **Effort:** M
- **Status:** Done

- **Title:** JavaScript Module Consistency
- **Why:** `blog-search.js` uses non-module pattern (no export, global DOMContentLoaded) while `blog-filter.js` uses ES module exports. Inconsistent script loading (`<script defer>` vs `<script type="module">`). `jest.setup.js` is a no-op placeholder.
- **Scope (in):** Convert `blog-search.js` to ES module with exports. Align script loading to `type="module"`. Remove or repurpose `jest.setup.js`.
- **Scope (out):** New features. Test additions (separate PR).
- **Priority:** P3
- **Effort:** S
- **Status:** Done

- **Title:** Test Organization & Coverage Gaps
- **Why:** `displayables.js` has no tests. Life-money tests live at `test/unit/assets/js/` top level instead of under a `life-money/` subfolder. No integration tests for blog-filter + blog-search interaction.
- **Scope (in):** Move life-money tests into `test/unit/assets/js/life-money/` subfolder. Add unit tests for `displayables.js`.
- **Scope (out):** Refactoring source modules. Integration test framework setup.
- **Priority:** P3
- **Effort:** S
- **Status:** Done

- **Title:** Config & Content Normalization
- **Why:** `theme: jekyll-theme-cayman` declared but unused (fully custom CSS). `index.md` lacks title front matter and has minimal content. Blog posts have inconsistent front matter (some missing `date`, inconsistent tags/categories).
- **Scope (in):** Remove unused theme declaration. Add `title` to `index.md` front matter. Normalize post front matter across all 57 posts (explicit `date`, consistent tag strategy).
- **Scope (out):** Content rewrites. New blog posts.
- **Priority:** P3
- **Effort:** M
- **Status:** Partial — theme removed and index.md title added; post front matter normalization deferred (bulk change across 57 files)
