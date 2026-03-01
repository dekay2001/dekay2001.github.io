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
