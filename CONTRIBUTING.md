# Contributing

## Development Setup
- Ruby + Bundler for Jekyll workflow.
- Node.js for JavaScript testing.

Install dependencies as needed:
- `bundle install`
- `npm install`

## Local Development
- Run site locally: `bundle exec jekyll serve`
- Default local URL: `http://localhost:4000`

Restart Jekyll after `_config.yml` changes.

## Testing
- Run unit tests before submitting changes: `npm test -- --watchAll=false`
- Optional coverage run: `npm test -- --coverage --watchAll=false`

## File and Naming Conventions
- Blog posts: `_posts/YYYY-MM-DD-title-with-dashes.md`
- Tests: `test/unit/**` mirroring source paths where practical
- JavaScript uses modern ES6+ style and exports testable public APIs

## Coding Expectations
- Keep public interfaces near the top of modules/classes.
- Use descriptive names and avoid one-letter identifiers.
- Prefer focused, single-responsibility functions.
- Handle errors in async logic and validate inputs early.
- Avoid unrelated refactors during feature work.

## Planning and Design Expectations
- For non-trivial work, include a SOLID review in the implementation plan.
- Document trade-offs and boundary decisions before coding.

## TDD Expectations
- Follow Red → Green → Refactor for implementation tasks.
- Write/update failing tests first for each acceptance criterion.
- Implement the minimal code needed to pass tests.
- Refactor only with tests green and behavior preserved.

## Content and Site Compatibility
- Maintain GitHub Pages compatibility.
- Preserve existing URLs and content structure unless explicitly changing IA.
- Keep navigation and shared layout behavior consistent.

## Workflow
1. Make focused changes.
2. Run tests.
3. Verify local rendering for content/layout/JS changes.
4. Use clear commit messages describing intent and scope.

## Deployment
- Production deploy target branch is `master`.
- Pushing to `master` triggers GitHub Pages deployment.
