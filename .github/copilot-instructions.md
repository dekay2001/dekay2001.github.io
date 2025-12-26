# GitHub Copilot Instructions

## Quick Reference

### Essential Commands
```powershell
# Testing
npm test -- --watchAll=false           # Run tests before commit
npm test -- --coverage --watchAll=false # With coverage report

# Local Jekyll Development
bundle exec jekyll serve               # Start server at http://localhost:4000
$env:PATH += ";C:\Ruby34-x64\bin"     # Add Ruby to PATH (if needed)

# Package Management
npm outdated                           # Check outdated packages
ncu -u && npm install                 # Update all packages
npm audit                             # Security check

# Deployment
git push origin master                # Auto-deploy to https://dekay2001.github.io
```

### File Naming Conventions
- **Blog Post**: `_posts/YYYY-MM-DD-title.md` with front matter (`layout: post`)
- **Test File**: `test/unit/**/*.test.js` mirroring source structure
- **JavaScript**: `assets/js/base/` or `assets/js/yoga/` (export for testing)

---

## Project Overview

**Jekyll-based GitHub Pages site** (`dekay2001.github.io`) with personal blog, resume, yoga sequences, and playground sections.

### Tech Stack
- **Jekyll**: Static site with `jekyll-theme-cayman`, Liquid templating
- **JavaScript**: ES6+ with Jest/Babel testing
- **Environment**: Windows/PowerShell, Ruby 3.4.7, Node.js
- **Deployment**: Auto-deploy to GitHub Pages on `master` branch push

### Repository Structure
```
_posts/           → Blog posts (YYYY-MM-DD-title.md)
_layouts/         → Custom page layouts (default.html, post.html, resume.html)
_includes/        → Reusable components (header, footer, navigation)
_data/            → YAML/JSON data files (navigation.yml)
assets/
  js/             → JavaScript (base/, yoga/ subdirectories)
  css/            → Stylesheets (responsive-*.css variants)
  data/           → Data files (yoga sequences, etc.)
test/unit/        → Jest tests mirroring assets/js/ structure
```

---

## Code Generation Patterns

### Blog Posts
```markdown
<!-- File: _posts/YYYY-MM-DD-title-with-dashes.md -->
---
layout: post
title: "Your Title Here"
date: YYYY-MM-DD
---
Content starts here...
```

### JavaScript
- **Location**: `assets/js/base/` (shared) or `assets/js/yoga/` (yoga-specific)
- **Export for testing**: `export { functionName };`
- **ES6+ required**: const/let, arrow functions, template literals
- **Patterns**: See `displayables.js`, `models.js` for examples

### Tests
```javascript
// File: test/unit/assets/js/path/to/file.test.js
// Add @jest-environment jsdom if DOM testing needed
import { myFunction } from '../../../../assets/js/path/to/file.js';

describe('myFunction', () => {
  test('should perform expected behavior', () => {
    // Arrange → Act → Assert
    expect(myFunction(input)).toBe(expectedOutput);
  });
});
```
**Always run before commit**: `npm test -- --watchAll=false`

### Layouts & Configuration
- **Layouts**: Liquid templating (`{{ page.variable }}`, `{% include file.html %}`)
- **CSS**: Responsive variants in `assets/css/responsive-*.css`
- **_config.yml**: Requires Jekyll restart to apply changes
- **Navigation**: Managed in `_data/navigation.yml`

---

## Workflow Checklist

### Pre-Commit
1. ✅ Run tests: `npm test -- --watchAll=false`
2. ✅ Verify code follows conventions (see Clean Code Standards below)
3. ✅ Write descriptive commit message (verb + specific change)

### Commit Message Format
✅ Good: "Add blog post: [title]" | "Fix search filtering in blog.js" | "Refactor yoga display logic"
❌ Bad: "Update files" | "Fix bug" | "Changes"

### Deployment
- Push to `master` → Auto-deploys to https://dekay2001.github.io (1-5 min)
- Verify deployment after push
- Feature branches for major changes only



---

## Clean Code Standards

### Public Interface First (Critical)
**Always declare public interfaces at the top of modules and classes** to enable top-down reading without jumping around in code.

- **Modules**: Export statements and public functions/constants should be declared first
- **Classes**: Public methods and properties should be declared before private ones
- **Rationale**: Readers should understand the public API without scrolling through implementation details

**Example - Module Structure**:
```javascript
// ✅ CORRECT: Public interface first
export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + _applyDiscount(item), 0);
}

export function formatPrice(amount) {
  return _currencyFormatter.format(amount);
}

// Private implementation details below
function _applyDiscount(item) {
  return item.price * (1 - item.discount);
}

const _currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});
```

```javascript
// ❌ INCORRECT: Private details mixed with public interface
function _applyDiscount(item) {
  return item.price * (1 - item.discount);
}

export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + _applyDiscount(item), 0);
}

const _currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

export function formatPrice(amount) {
  return _currencyFormatter.format(amount);
}
```

**Example - Class Structure**:
```javascript
// ✅ CORRECT: Public methods first
class DataProcessor {
  // Public interface
  constructor(config) {
    this._config = config;
    this._cache = new Map();
  }

  process(data) {
    if (this._cache.has(data.id)) {
      return this._cache.get(data.id);
    }
    return this._processAndCache(data);
  }

  clearCache() {
    this._cache.clear();
  }

  // Private methods below
  _processAndCache(data) {
    const result = this._transform(data);
    this._cache.set(data.id, result);
    return result;
  }

  _transform(data) {
    return { ...data, processed: true };
  }
}
```

### JavaScript Best Practices

**Modern JavaScript (ES6+)**:
- Use `const` by default, `let` only when reassignment needed, never `var`
- Prefer arrow functions for callbacks and non-method functions
- Use template literals for string interpolation
- Destructuring for object/array extraction
- Spread operator for object/array copying
- Default parameters instead of `||` fallbacks

**Naming Conventions**:
- `camelCase` for variables, functions, and methods
- `PascalCase` for classes and constructors
- `UPPER_SNAKE_CASE` for constants
- Prefix private methods/properties with underscore: `_privateMethod`
- Use descriptive names that reveal intent

**Function Design**:
- Keep functions small and focused (single responsibility)
- Limit parameters (3 or fewer; use object for more)
- Avoid side effects in pure functions
- Return early to reduce nesting
- Use async/await instead of promise chains

**Error Handling**:
- Always handle promise rejections
- Use try/catch with async/await
- Throw meaningful error messages
- Validate inputs early
- Don't catch errors you can't handle

**Code Organization**:
- One class per file (with same name as file)
- Group related functions in modules
- Import statements at top, grouped by type (external, internal, local)
- Maximum file length: ~300 lines (split if larger)

**Comments and Documentation**:
- Use JSDoc for public APIs
- Comment "why", not "what"
- Keep comments up-to-date with code
- Document non-obvious behavior or edge cases

### Code Review Checklist

During code reviews, **always verify**:

1. ✅ **Public interfaces declared first** in all modules and classes
2. ✅ Modern JavaScript patterns used (const/let, arrow functions, destructuring)
3. ✅ Functions are small, focused, and well-named
4. ✅ Consistent naming conventions throughout
5. ✅ Error handling present for async operations
6. ✅ No commented-out code or console.log statements
7. ✅ JSDoc comments for public APIs
8. ✅ Imports organized and grouped logically
9. ✅ No magic numbers or strings (use named constants)
10. ✅ Code is DRY (Don't Repeat Yourself)

### Anti-Patterns to Avoid

**Avoid**:
- ❌ Nested callbacks (callback hell) - use async/await
- ❌ Modifying function parameters
- ❌ Implicit type coercion (`==` instead of `===`)
- ❌ Global variables
- ❌ Large functions (>30 lines typically needs splitting)
- ❌ Deep nesting (>3 levels indicates refactoring needed)
- ❌ Mixed public/private declarations in classes
- ❌ Mixing concerns in a single function/module

### Testing Standards

**Test Development Approach:**
- Write tests before or alongside code (TDD/BDD)
- Tests should document expected behavior and serve as living documentation
- Create test files in `test/unit/` mirroring source structure

**Test File Structure:**
- Test file naming: `*.test.js` (e.g., `blog-search.test.js`)
- Use `@jest-environment jsdom` comment when DOM is required
- Import from source: `import { Thing } from '../../../../assets/js/path/to/file.js';`
- Group related tests with `describe()` blocks

**Test Naming and Organization:**
- Use descriptive test names: `test('should calculate total with discount applied')`
- Alternative pattern: "should [expected behavior] when [condition]"
- Follow **Arrange-Act-Assert** pattern:
  ```javascript
  test('should return discounted price', () => {
    // Arrange: Set up test data
    const item = { price: 100, discount: 0.2 };
    
    // Act: Execute the function
    const result = calculatePrice(item);
    
    // Assert: Verify the result
    expect(result).toBe(80);
  });
  ```

**Mocking and Dependencies:**
- Mock external dependencies (fetch, DOM elements, file system)
- Use Jest mocking: `jest.fn()`, `jest.mock()`
- Mock `global.fetch` for API calls in jsdom environment
- Keep mocks simple and focused on the test's purpose

**Coverage and Quality:**
- Aim for >80% code coverage for critical paths
- Test both happy paths and edge cases
- Test error handling and validation
- Run tests before committing: `npm test -- --watchAll=false`
- Verify all tests pass before pushing changes

---

## Code Style Preferences

### JavaScript
- ES6+ features (arrow functions, const/let, template literals)
- Functional programming patterns preferred
- Export reusable functions/classes for testing
- JSDoc for complex logic

### Markdown
- ATX-style headers (`#`, `##`)
- Language-specified code blocks
- Match existing blog post tone

### HTML/Liquid
- Semantic HTML5 elements
- Liquid templating for dynamic content
- Accessibility required (alt text, ARIA labels)

### CSS
- BEM-like naming conventions
- Mobile-first responsive design
- Component-based organization

---

## Context & Environment

### Local Development
- **Ruby**: 3.4.7 at C:\Ruby34-x64\bin (may need to add to PATH)
- **Jekyll**: `bundle exec jekyll serve` → http://localhost:4000
- **Auto-reload**: Enabled by default on file changes
- **Gemfile**: Uses `github-pages` gem for compatibility

### Package Management (PowerShell)
- Check updates: `npm outdated`
- Bulk updates: `ncu -u && npm install`
- Security: `npm audit`
- Always test after updates

### Debugging
- Run tests first: `npm test -- --watchAll=false`
- Check file paths (absolute vs relative)
- Browser caching may affect CSS/JS
- GitHub Actions for deployment issues

---

## Dependencies

### Node.js (package.json)
```json
{
  "@babel/core": "^7.13.10",
  "@babel/preset-env": "^7.13.10",
  "babel-jest": "^30.0.5",
  "jest": "^30.0.5",
  "jest-environment-jsdom": "^30.0.5"
}
```
*Note: May be outdated. Suggest latest when updating.*

### Ruby (Gemfile)
```ruby
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
gem "webrick"
```
*The `github-pages` gem includes Jekyll and all GitHub Pages dependencies.*

---

## Site Sections

### Blog
- Jekyll blog with pagination (4 posts/page)
- Posts from 2019 onwards
- Topics: personal reflections, tech, yoga/philosophy
- Layout: `post.html`

### Yoga
- Data-driven: JSON in `assets/data/yoga/`
- Interactive sequences: `assets/js/yoga/`
- Key files: `main.js`, `play-sequence.js`, `displayables.js`, `models.js`

### Resume
- Markdown: `resume/index.md`
- Layout: `resume.html`
- Styling: `responsive-resume.css`

### Playground
- Experimental features
- More flexible than other sections



---

## Success Criteria

✅ Code follows patterns and conventions
✅ Tests pass (JavaScript changes)
✅ Files in correct directories
✅ Descriptive commit messages
✅ GitHub Pages compatible
✅ Responsive design (CSS/HTML changes)
✅ No broken links

---

*Last Updated: December 26, 2025*
