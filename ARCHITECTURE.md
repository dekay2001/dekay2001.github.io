# Architecture

## System Overview
This repository is a Jekyll static site deployed through GitHub Pages. Pages are rendered at build time with Liquid templates, then enhanced on the client with JavaScript modules for interactive features.

## Stack
- Static site generator: Jekyll (via `github-pages` gem).
- Templating: Liquid with `_layouts/` and `_includes/`.
- Styling: static CSS under `assets/css/`.
- Front-end behavior: ES6 JavaScript in `assets/js/`.
- JS tests: Jest + Babel in `test/unit/`.

## Key Architecture Boundaries
- Content and structure:
  - Markdown content (`index.md`, `_posts/`, section pages).
  - Jekyll config (`_config.yml`) controls site-level behavior including blog pagination.
- Presentation:
  - Layout files in `_layouts/` define base templates.
  - Shared UI fragments in `_includes/`.
  - CSS in `assets/css/`.
- Behavior:
  - Generic and feature-specific JavaScript modules in `assets/js/`.
  - Blog filtering and search scripts load on blog index.

## Blog Rendering and Search/Filter Flow
1. Jekyll builds paginated blog pages from `_posts/` using pagination config.
2. Blog page template renders category controls and initial paginated post list.
3. `assets/js/blog-filter.js` handles category selection and URL state.
4. `assets/js/blog-search.js` loads `search.json` for cross-post search and renders result UI.
5. Search and filter behaviors are validated by unit tests in `test/unit/assets/js/`.

## Directory Landmarks
- `_posts/`: canonical blog content.
- `_layouts/`, `_includes/`: templating and reusable view fragments.
- `_data/`: structured metadata such as navigation.
- `assets/js/base/`: shared JavaScript primitives.
- `assets/js/yoga/`, `assets/js/lyrical-learner/`: section-specific modules.
- `test/unit/`: unit tests mirroring JS source structure.

## Build, Test, and Deploy
- Local Jekyll serve: `bundle exec jekyll serve`.
- JS tests: `npm test -- --watchAll=false`.
- Deployment target branch: `master` (GitHub Pages auto-deploy flow for this repo).

## Architectural Guardrails
- Keep GitHub Pages compatibility; avoid unsupported build assumptions.
- Preserve URL/content stability for existing posts and sections.
- Prefer small, focused changes over broad refactors.
- Keep public interfaces clear and testable in JavaScript modules.
