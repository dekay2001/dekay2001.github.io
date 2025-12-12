# Development Setup

## Development Environment

- **OS**: Windows with PowerShell
- **Ruby**: Ruby 3.4.7 (installed at C:\Ruby34-x64\bin)
- **Jekyll**: Installed via Bundler with GitHub Pages gem
- **TypeScript**: TypeScript 5.9.3 (source in `src/`, compiles to `assets/js/`)
- **Testing**: Jest with ts-jest for TypeScript testing
- **Node Dependencies**: typescript, ts-jest, @types/jest, jest, jest-environment-jsdom
- **Ruby Dependencies**: github-pages gem (includes Jekyll and all GitHub Pages dependencies)
- **Deployment**: Automatic via GitHub Pages + GitHub Actions (compiles TypeScript on push to `master`)

---

## Local Development

### Two-Terminal Setup (Recommended)

**Terminal 1 - TypeScript Watch Mode:**
```powershell
npm run build:watch
```
*Automatically recompiles TypeScript whenever you save changes to `src/` files*

**Terminal 2 - Jekyll Server:**
```powershell
bundle exec jekyll serve --livereload
```
*Serves site at http://localhost:4000 and auto-refreshes browser on changes*

### Quick Start (One-Time Build)

```powershell
# 1. Compile TypeScript first (required!)
npm run build

# 2. Start Jekyll server
bundle exec jekyll serve

# 3. Visit http://localhost:4000
```

### Important Notes

- Ruby 3.4.7 is installed at C:\Ruby34-x64\bin
- May need to add Ruby to PATH: `$env:PATH += ";C:\Ruby34-x64\bin"`
- **Always compile TypeScript before starting Jekyll** - Jekyll serves compiled JavaScript from `assets/js/`, not TypeScript source
- Jekyll auto-regenerates on file changes (watch mode enabled by default)
- Changes to `_config.yml` require Jekyll restart (Ctrl+C, then restart)

---

## Testing Workflow

```powershell
# 1. Compile TypeScript
npm run build

# 2. Run tests
npm test -- --watchAll=false

# 3. Start Jekyll and test in browser
bundle exec jekyll serve
# Visit http://localhost:4000
```

---

## Dependencies & Versions

### Node Dependencies (package.json)

```json
{
  "@types/jest": "^30.0.0",
  "jest": "^30.0.5",
  "jest-environment-jsdom": "^30.0.5",
  "ts-jest": "^29.4.6",
  "typescript": "^5.9.3"
}
```

### Ruby Dependencies (Gemfile)

```ruby
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
gem "webrick"
```

The `github-pages` gem includes all dependencies needed for GitHub Pages compatibility, including Jekyll and all approved plugins.

---

## Troubleshooting

### Issue: "bundle: command not found"
**Solution:** Add Ruby to PATH:
```powershell
$env:PATH += ";C:\Ruby34-x64\bin"
bundle exec jekyll serve
```

### Issue: Changes not appearing
**Solutions:**
1. Verify TypeScript compiled: `npm run build`
2. Hard refresh browser: `Ctrl+F5`
3. Clear browser cache
4. Restart Jekyll server (Ctrl+C, then restart)

### Issue: JavaScript errors in browser
**Check:**
1. TypeScript compiled without errors: `npm run build`
2. Browser console for specific error messages (F12)
3. Verify HTML references correct paths: `/assets/js/*.js`

### Issue: Jekyll shows config changes
**Note:** Changes to `_config.yml` require Jekyll restart:
```powershell
# Stop server: Ctrl+C
# Restart:
bundle exec jekyll serve
```
