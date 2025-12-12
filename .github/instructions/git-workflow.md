# Git Workflow & Best Practices

## Commit Messages

Generate clear, descriptive commit messages:

**✅ Good Examples:**
- "Add blog post: [title]"
- "Update resume with [specific change]"
- "Fix [specific issue] in [component]"
- "Refactor [component] to [improvement]"

**❌ Bad Examples:**
- "Update files"
- "Fix bug"
- "Changes"
- "WIP"

---

## Branch Strategy

- **Primary branch**: `master`
- Feature branches for major changes
- Name feature branches descriptively: `feature/add-search`, `fix/yoga-navigation`

---

## Pre-commit Checklist

Before suggesting `git push`, ensure:

1. ✅ TypeScript compiles: `npm run build`
2. ✅ Tests pass: `npm test -- --watchAll=false`
3. ✅ No linting errors (if applicable)
4. ✅ Files are properly formatted
5. ✅ Commit message is descriptive

**Quick Pre-commit Commands:**
```powershell
npm run build
npm test -- --watchAll=false
git add .
git commit -m "Descriptive message"
git push origin master
```

---

## Success Criteria

When completing tasks, ensure:

- ✅ Code follows existing patterns and conventions
- ✅ TypeScript compiles (if TypeScript changes)
- ✅ Tests pass (if JavaScript changes)
- ✅ Files are in correct directories
- ✅ Commit messages are descriptive
- ✅ Changes are appropriate for GitHub Pages deployment
- ✅ Responsive design considered (if CSS/HTML changes)
- ✅ No broken links or references

---

## Common Git Commands

```powershell
# Check status
git status

# Stage all changes
git add .

# Commit with message
git commit -m "Your descriptive message"

# Push to master (triggers deployment)
git push origin master

# Create and switch to feature branch
git checkout -b feature/branch-name

# Switch branches
git checkout branch-name

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard uncommitted changes
git checkout -- .
```

---

## Package Management Best Practices

**Use PowerShell syntax** (Windows environment):

**Check for updates:**
```powershell
npm outdated
```

**Update packages:**
```powershell
ncu -u                           # Update package.json
npm install                      # Install updates
npm test -- --watchAll=false     # Verify tests still pass
```

**Security check:**
```powershell
npm audit
npm audit fix                    # Auto-fix vulnerabilities
```

**Always test after updates** to ensure nothing breaks!
