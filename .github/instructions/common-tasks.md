# Common Tasks & Patterns

## Creating a New Blog Post

**User Intent**: "Create a new blog post about [topic]"

**Steps**:
1. Generate filename: `_posts/YYYY-MM-DD-topic-name.md`
2. Include proper front matter with post layout
3. Add relevant content based on existing post style

**Template:**
```markdown
---
layout: post
title: "Your Title Here"
date: YYYY-MM-DD
---

Content starts here...
```

**Naming Convention**: `YYYY-MM-DD-title-with-dashes.md`

---

## Adding TypeScript Functionality

**User Intent**: "Add a new [feature] to the yoga/playground section"

**Steps**:
1. Create TypeScript file in appropriate `src/` subdirectory (e.g., `src/base/` or `src/yoga/`)
2. Export functions/classes with proper types for testing
3. Create corresponding test file in `test/unit/` with `.test.ts` extension
4. Compile TypeScript: `npm run build`
5. Run tests: `npm test -- --watchAll=false`
6. Reference compiled output in HTML: `<script src="/assets/js/path/to/file.js"></script>`

---

## Updating Packages

**User Intent**: "Update packages" or "check for outdated dependencies"

**Steps**:
1. Check current status: `npm outdated`
2. Update package.json to latest: `ncu -u`
3. Install updates: `npm install`
4. Run tests: `npm test -- --watchAll=false`
5. Check security: `npm audit`

**PowerShell One-Liner:**
```powershell
ncu -u; npm install; npm test -- --watchAll=false
```

---

## Modifying Site Styling

**User Intent**: "Change the [color/layout/style] of [element]"

**Steps**:
1. Identify relevant CSS file in `assets/css/`
2. Consider responsive variants (responsive-*.css files)
3. Use existing class naming conventions
4. Test changes across layouts (default, post, resume)

**CSS Files**:
- `style.css` - Core theme styles
- `responsive-default.css` - Home page responsive
- `responsive-post.css` - Blog post responsive
- `responsive-resume.css` - Resume page responsive

---

## Modifying Layouts/Includes

**Layouts** (`_layouts/`):
- Use Liquid templating with `{{ page.variable }}` and `{% include file.html %}`
- All layouts inherit from Jekyll theme but can override
- Main layouts: `default.html`, `post.html`, `resume.html`

**Includes** (`_includes/`):
- Small, reusable components (header, footer, navigation)
- Include with: `{% include filename.html %}`
- Main includes: `navheader.html`, `footer.html`, `mainpic.html`

---

## Working with Configuration

**_config.yml**:
- Site-wide settings (title, description, theme, pagination)
- Changes require Jekyll restart in local development
- Restart: Ctrl+C, then `bundle exec jekyll serve`

**_data/navigation.yml**:
- Navigation structure for site menu
- Format: list of name/url pairs

---

## Site Deployment

**When Asked About Site Updates**:
- Assume user wants changes pushed to GitHub Pages
- Remind about deployment time (1-5 minutes)
- Suggest verifying at https://dekay2001.github.io

**Deployment Process**:
1. Push to `master` branch
2. GitHub Actions compiles TypeScript
3. GitHub Pages builds Jekyll site
4. Site live in 1-5 minutes

---

## Debugging Tips

**When Debugging**:
- Check Jest tests first: `npm test -- --watchAll=false`
- Verify file paths (absolute vs relative)
- Consider browser caching for CSS/JS changes (hard refresh: Ctrl+F5)
- Check GitHub Actions for deployment issues
- Use browser console (F12) for JavaScript errors
