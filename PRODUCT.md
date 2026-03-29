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

### Done

- **Title:** Resume Page Overhaul — Showcase AI Leadership & Personal Projects
- **Why:** Resume hasn't been updated since November 2025. Significant work on Project Alpha (prompt engineering research lab), two Jekyll sites, and continued WiseTech Global lead engineer role are not reflected.
- **Scope (in):** Rewrite professional summary to emphasize AI-driven leadership. Add 2025-2026 WiseTech bullets (AI velocity, prompt engineering, Graph API, Sybase migration). Add "Personal & Open Source Projects" section (Project Alpha, dekay2001.github.io, Dover Run Club). Add "Thought Leadership" section (book chapters, frameworks, moments). Update technical skills table (bump AI/Copilot to 9, add Jekyll/Jest/ES6, extend HTML/CSS/JS ranges to 2026). Add employer acquisition context (Profit Tools → Valsoft → Envase → WiseTech). Trim/consolidate pre-2017 bullets.
- **Scope (out):** Layout or styling changes to resume template. New resume page URL or navigation changes.
- **Priority:** P3
- **Effort:** M
- **Status:** Done
