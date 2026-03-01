# dekay2001.github.io

Personal GitHub Pages site built with Jekyll + Liquid + JavaScript.

## Local Development
- Install Ruby gems: `bundle install`
- Install Node dependencies: `npm install`
- Run site: `bundle exec jekyll serve`
- Run tests: `npm test -- --watchAll=false`

## Context Engineering Workflow
This repository uses custom instructions, agents, and prompts for planning-first development.

### 1) Start with planning
- In VS Code Chat, run `/plan-qna`.
- Provide your feature request.
- Answer the 3 clarifying questions.
- Review the generated plan based on `plan-template.md`.
- Ensure the plan includes a SOLID design review for non-trivial changes.

### 2) Move to implementation
- From the planning response, use the **Start Implementation** handoff.
- The implementation agent executes the approved plan using TDD (Red → Green → Refactor) and clean code practices.

### 3) Validate before merge
- Run `npm test -- --watchAll=false` for JavaScript changes.
- Verify local rendering with `bundle exec jekyll serve` for content/layout/config changes.

## Common Prompts
- `/plan-qna Add category badges to blog post cards and include mobile-friendly spacing.`
- `/plan-qna Improve blog search UX with keyboard navigation and clearer empty states.`
- `Implement plan: [paste approved plan markdown here]`
- `Review current changes against plan-template.md and list any missing tasks.`
- `Create a focused bug-fix plan for inconsistent category filtering between paginated pages.`
- `Update PRODUCT.md and ARCHITECTURE.md to reflect the latest blog search/filter behavior.`

## Source-of-Truth Docs
- Product context: `PRODUCT.md`
- Architecture context: `ARCHITECTURE.md`
- Contributing rules: `CONTRIBUTING.md`
- Agent index: `.github/copilot-instructions.md`
