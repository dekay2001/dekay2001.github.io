# GitHub Copilot Instructions

## Project Context

This is a Jekyll-based GitHub Pages site (`dekay2001.github.io`) serving as a personal blog with resume, yoga sequences, and playground sections. The site uses `jekyll-theme-cayman` with custom layouts, JavaScript functionality, and Jest testing.

## Repository Structure

- **Jekyll Site**: Custom layouts in `_layouts/`, includes in `_includes/`, data in `_data/`
- **Blog Posts**: Markdown files in `_posts/` with naming format `YYYY-MM-DD-title.md`
- **JavaScript**: Source in `assets/js/` with subdirectories `base/` and `yoga/`
- **Tests**: Jest tests in `test/unit/assets/js/` mirroring source structure
- **Content Pages**: `index.md` (home), `resume/index.md`, `yoga/index.html`, `playground/index.html`
- **Assets**: CSS in `assets/css/`, images in `assets/images/`, data files in `assets/data/`

## Development Environment

- **OS**: Windows with PowerShell
- **Ruby**: Ruby 3.4.7 (installed at C:\Ruby34-x64\bin)
- **Jekyll**: Installed via Bundler with GitHub Pages gem
- **Testing**: Jest with Babel (ES6+ support) and jsdom environment
- **Node Dependencies**: @babel/core, @babel/preset-env, babel-jest, jest, jest-environment-jsdom
- **Ruby Dependencies**: github-pages gem (includes Jekyll and all GitHub Pages dependencies)
- **Deployment**: Automatic via GitHub Pages on push to `master` branch
- **Site URL**: https://dekay2001.github.io
- **Local Development**: http://localhost:4000 (via Jekyll server)

---

## Code Generation Guidelines

### When Creating Blog Posts

- Use Jekyll naming convention: `YYYY-MM-DD-title-with-dashes.md`
- Include front matter with layout, title, and date
- Place in `_posts/` directory
- Default layout: `post`

**Template:**
```markdown
---
layout: post
title: "Your Title Here"
date: YYYY-MM-DD
---

Content starts here...
```

### When Writing JavaScript

- Use ES6+ syntax (Babel transpiles for Jest)
- Place source files in `assets/js/base/` or `assets/js/yoga/` depending on purpose
- Export functions/classes for testing: `export { functionName };`
- Follow existing patterns from `displayables.js` and `models.js`

### When Writing Tests

- Create test files in `test/unit/` mirroring source structure
- Use `.test.js` extension
- Import from source: `import { Thing } from '../../../../assets/js/path/to/file.js';`
- Use Jest syntax: `describe()`, `test()`, `expect()`
- Run tests before committing: `npm test -- --watchAll=false`

**Template:**
```javascript
import { myFunction } from '../../../../assets/js/base/example.js';

describe('myFunction', () => {
  test('should perform expected behavior', () => {
    expect(myFunction(input)).toBe(expectedOutput);
  });
});
```

### When Modifying Layouts/Includes

- **Layouts**: Use Liquid templating with `{{ page.variable }}` and `{% include file.html %}`
- **Includes**: Small, reusable components (header, footer, navigation)
- **CSS**: Responsive styles in separate files (responsive-default.css, responsive-post.css, etc.)
- All layouts inherit from Jekyll theme but can override

### When Working with Configuration

- **_config.yml**: Site-wide settings (title, description, theme, pagination)
- Changes to `_config.yml` require Jekyll restart in local development
- Navigation structure in `_data/navigation.yml`

---

## Common Tasks & Patterns

### Creating a New Blog Post

**User Intent**: "Create a new blog post about [topic]"

**Action**: 
1. Generate filename: `_posts/YYYY-MM-DD-topic-name.md`
2. Include proper front matter with post layout
3. Add relevant content based on existing post style

### Adding JavaScript Functionality

**User Intent**: "Add a new [feature] to the yoga/playground section"

**Action**:
1. Create JS file in appropriate `assets/js/` subdirectory
2. Export functions/classes for testing
3. Create corresponding test file in `test/unit/`
4. Reference in HTML with `<script src="/assets/js/path/to/file.js"></script>`

### Updating Packages

**User Intent**: "Update packages" or "check for outdated dependencies"

**Action**:
1. Suggest: `npm outdated` to check current status
2. Provide update commands using PowerShell syntax
3. Recommend: `ncu -u && npm install && npm test -- --watchAll=false`
4. Always suggest running tests after updates

### Modifying Site Styling

**User Intent**: "Change the [color/layout/style] of [element]"

**Action**:
1. Identify relevant CSS file in `assets/css/`
2. Consider responsive variants (responsive-*.css files)
3. Use existing class naming conventions
4. Test changes across layouts (default, post, resume)

---

## Testing Requirements

- **Always** run tests before committing: `npm test -- --watchAll=false`
- Test coverage for all exported JavaScript functions
- Mock external dependencies in tests
- Use descriptive test names following pattern: "should [expected behavior] when [condition]"

---

## Git Workflow Preferences

### Commit Messages

Generate clear, descriptive commit messages:
- ✅ "Add blog post: [title]"
- ✅ "Update resume with [specific change]"
- ✅ "Fix [specific issue] in [component]"
- ✅ "Refactor [component] to [improvement]"
- ❌ "Update files"
- ❌ "Fix bug"

### Branch Strategy

- **Primary branch**: `master`
- Feature branches for major changes
- Always push to appropriate branch (currently on: `Githubinstructions`)

### Pre-commit Checklist

Before suggesting `git push`, ensure:
1. Tests pass: `npm test -- --watchAll=false`
2. No linting errors (if applicable)
3. Files are properly formatted
4. Commit message is descriptive

---

## File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Blog Post | `YYYY-MM-DD-title.md` | `2025-11-23-copilot-instructions.md` |
| Test File | `*.test.js` | `models.test.js` |
| Layout | `*.html` | `default.html`, `post.html` |
| Include | `*.html` | `footer.html`, `navheader.html` |
| Data | `*.json` or `*.yml` | `navigation.yml`, `primary-series.json` |

---

## Code Style Preferences

### JavaScript
- Use ES6+ features (arrow functions, const/let, template literals)
- Prefer functional programming patterns
- Export reusable functions and classes
- Document complex logic with comments

### Markdown
- Use ATX-style headers (`#`, `##`, etc.)
- Code blocks with language specification
- Follow existing blog post tone and structure

### HTML/Liquid
- Semantic HTML5 elements
- Liquid tags for dynamic content
- Maintain accessibility (alt text, ARIA labels where needed)

### CSS
- BEM-like naming or existing convention
- Mobile-first responsive design
- Organize by component/section

---

## Important Context for Responses

### When Asked About Site Updates
- Assume user wants changes pushed to GitHub Pages
- Remind about deployment time (1-5 minutes)
- Suggest verifying at https://dekay2001.github.io

### When Asked About Package Management
- Use PowerShell syntax (Windows environment)
- Recommend `npm-check-updates` (ncu) for bulk updates
- Always suggest testing after updates
- Consider security with `npm audit`

### When Asked About Local Development
- Ruby 3.4.7 is installed at C:\Ruby34-x64\bin
- Jekyll is set up with GitHub Pages gem via Bundler
- Start local server: `bundle exec jekyll serve`
- Access at: http://localhost:4000
- Note: May need to add Ruby to PATH in new PowerShell sessions: `$env:PATH += ";C:\Ruby34-x64\bin"`
- Gemfile includes github-pages gem for GitHub Pages compatibility
- Jekyll auto-regenerates on file changes (watch mode enabled by default)

### When Debugging
- Check Jest tests first
- Verify file paths (absolute vs relative)
- Consider browser caching for CSS/JS changes
- Check GitHub Actions for deployment issues

---

## Dependencies & Versions

Current package.json devDependencies:
```json
{
  "@babel/core": "^7.13.10",
  "@babel/preset-env": "^7.13.10",
  "babel-jest": "^30.0.5",
  "jest": "^30.0.5",
  "jest-environment-jsdom": "^30.0.5"
}
```

**Note**: These versions may be outdated. When asked to update, suggest latest versions.

### Ruby Dependencies (Gemfile)

The project uses Bundler to manage Jekyll and GitHub Pages dependencies:
```ruby
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
gem "webrick"
```

The `github-pages` gem includes all dependencies needed for GitHub Pages compatibility, including Jekyll and all approved plugins.

---

## Special Sections

### Yoga Section
- Data-driven: JSON files in `assets/data/yoga/`
- Interactive sequences with JavaScript in `assets/js/yoga/`
- Main files: `main.js`, `play-sequence.js`
- Display logic in `base/displayables.js` and `base/models.js`

### Playground Section
- Experimental/demo area
- Uses `playground.js`
- More flexible than other sections

### Blog Section
- Standard Jekyll blog with pagination (4 posts per page)
- Posts dating back to 2019
- Topics: personal reflections, tech, yoga/philosophy
- Layout: `post.html`

### Resume Section
- Markdown-based: `resume/index.md`
- Custom layout: `resume.html`
- Separate responsive CSS: `responsive-resume.css`

---

## Quick Command Reference

```powershell
# Testing
npm test -- --watchAll=false           # Run tests once
npm test -- --coverage --watchAll=false # With coverage

# Package Management
npm outdated                           # Check outdated packages
ncu -u                                # Update package.json to latest
npm install                           # Install dependencies
npm audit                             # Security check

# Git
git status                            # Check status
git add .                             # Stage all changes
git commit -m "message"               # Commit
git push origin master                # Deploy to GitHub Pages

# Local Jekyll Development
$env:PATH += ";C:\Ruby34-x64\bin"     # Add Ruby to PATH (if needed)
bundle exec jekyll serve              # Start local server at http://localhost:4000
bundle exec jekyll serve --livereload # With live reload (requires wdm gem)
bundle install                        # Install/update Ruby dependencies
bundle update                         # Update all gems to latest compatible versions
```

---

## Success Criteria

When completing tasks, ensure:
- ✅ Code follows existing patterns and conventions
- ✅ Tests pass (if JavaScript changes)
- ✅ Files are in correct directories
- ✅ Commit messages are descriptive
- ✅ Changes are appropriate for GitHub Pages deployment
- ✅ Responsive design considered (if CSS/HTML changes)
- ✅ No broken links or references

---

*Last Updated: November 23, 2025*
