# Quick Command Reference

## TypeScript Compilation

```powershell
npm run build                         # Compile TypeScript once
npm run build:watch                   # Watch mode - auto-compile on save
```

---

## Testing

```powershell
npm test -- --watchAll=false           # Run tests once
npm test -- --coverage --watchAll=false # Run tests with coverage report
```

---

## Package Management

```powershell
npm outdated                           # Check for outdated packages
ncu -u                                # Update package.json to latest versions
npm install                           # Install/update dependencies
npm audit                             # Check for security vulnerabilities
npm audit fix                         # Auto-fix security issues
```

---

## Git Commands

```powershell
git status                            # Check current status
git add .                             # Stage all changes
git commit -m "message"               # Commit with message
git push origin master                # Push to master (triggers deployment)
git checkout -b feature/name          # Create and switch to new branch
git log --oneline                     # View commit history
```

---

## Local Jekyll Development

```powershell
# Add Ruby to PATH (if needed)
$env:PATH += ";C:\Ruby34-x64\bin"

# Start local server
bundle exec jekyll serve              # Basic server at http://localhost:4000
bundle exec jekyll serve --livereload # With auto-reload on changes

# Manage Ruby dependencies
bundle install                        # Install Ruby gems
bundle update                         # Update all gems
```

---

## Complete Local Testing Setup (Two Terminals)

**Terminal 1 - TypeScript Watch:**
```powershell
npm run build:watch
```
*Auto-compiles TypeScript on every save*

**Terminal 2 - Jekyll Server:**
```powershell
bundle exec jekyll serve --livereload
```
*Serves site at http://localhost:4000 with auto-refresh*

---

## Pre-Commit Workflow

```powershell
# 1. Compile TypeScript
npm run build

# 2. Run tests
npm test -- --watchAll=false

# 3. Stage and commit
git add .
git commit -m "Descriptive message"

# 4. Push to deploy
git push origin master
```

---

## Quick One-Liners

```powershell
# Update packages and test
ncu -u; npm install; npm test -- --watchAll=false

# Build and start Jekyll
npm run build; bundle exec jekyll serve

# Full pre-commit check
npm run build; npm test -- --watchAll=false; git status
```

---

## Debugging Commands

```powershell
# Check TypeScript compilation errors
npm run build

# View test failures
npm test -- --watchAll=false --verbose

# Check for linting issues (if configured)
npm run lint

# View browser console (for runtime errors)
# Press F12 in browser, check Console tab
```

---

## Common Troubleshooting

```powershell
# Clear npm cache
npm cache clean --force

# Reinstall all dependencies
rm -r node_modules
npm install

# Clear Jekyll cache and rebuild
rm -r _site
bundle exec jekyll serve

# Hard refresh browser (clear cache)
# Press Ctrl+F5
```
