# Blog Templates & Workflows

This directory contains templates and workflows for creating blog posts, particularly for converting Project Alpha moments into publishable content.

## Files

### `moment-to-blog-post-template.md`
Complete blog post template showing the structure, front matter, and placeholder sections for converting moments to blog posts.

**Usage:**
```powershell
cp templates/moment-to-blog-post-template.md _posts/YYYY-MM-DD-your-title.md
# Edit the new file with your content
```

### `MOMENT-PUBLISHING-WORKFLOW.md`
Comprehensive guide for converting Project Alpha moments into blog posts, including:
- Pre-publishing checklist
- Step-by-step process
- Content adaptation guidelines
- Format decision guide
- Category selection guide
- Common pitfalls
- Time estimates

---

## Quick Start

1. **Read the moment** you want to publish from `c:\Dev\ai-prompts-library\project-alpha\moments\`
2. **Copy the template** to create a new blog post file
3. **Follow the workflow** below
4. **Review** against the checklist
5. **Commit and push** to deploy

**Goal:** Make publishing moments to the blog **frictionless** - target 30-60 minutes from moment to published post.

---

## Pre-Publishing Checklist

- [ ] Read the moment document completely
- [ ] Identify the core insight (what's the one key lesson?)
- [ ] Decide on format: Narrative (~1,500 words) or Executive Summary (~800 words)
- [ ] Have the moment date ready (use original date from moment file)

---

## Step-by-Step Process

### 1. Copy the Template
```powershell
cp templates/moment-to-blog-post-template.md _posts/YYYY-MM-DD-your-title.md
```

### 2. Fill in Front Matter
- **Title:** Make it engaging and jargon-free
  - ✅ Good: "When AI Instructions Go Wrong (And How to Fix Them)"
  - ❌ Bad: "Instruction Friction: Guidelines and Consequences"
- **Date:** Use the original moment date (YYYY-MM-DD format)
- **Categories:** Always include `moments`, add 1-2 more from:
  - `tech` - Technical content, AI collaboration, coding
  - `personal` - Personal experiences, reflections
  - `philosophy` - Meta-learning, leadership insights
- **Tags:** Optional, use for searchability

### 3. Adapt the Content

#### Remove These:
- ❌ PR numbers, commit hashes, version numbers
- ❌ File paths and internal references
- ❌ "Version: v0.2" headers and project metadata
- ❌ Technical implementation details readers don't need
- ❌ References to other moments (unless you link to published blog post)

#### Keep/Add These:
- ✅ The core story or problem
- ✅ What you learned or discovered
- ✅ Practical lessons readers can apply
- ✅ Context about Project Alpha (first mention: "my ongoing exploration of AI collaboration")
- ✅ Personal voice and honest reflection
- ✅ Concrete examples and outcomes

#### Simplify These:
- 🔄 "Agent" → "AI assistant" (vary for readability)
- 🔄 Technical terms → Accessible language
- 🔄 Detailed process → Key insights
- 🔄 Internal jargon → Clear explanations

### 4. Structure Your Post

**For Executive Summary format (~800 words):**
```
Introduction (2 paragraphs)
↓
The Problem/Context (1-2 sections)
↓
What Happened/What You Built (1-2 sections)
↓
Key Lessons (bullet points or short sections)
↓
Takeaway (1-2 paragraphs)
```

**For Narrative format (~1,500 words):**
```
Opening Story (2-3 paragraphs)
↓
Background/Context (1-2 sections)
↓
The Journey (2-3 sections with subsections)
↓
Insights & Patterns (multiple sections)
↓
Practical Application (optional)
↓
Conclusion (2-3 paragraphs)
```

### 5. Review & Refine

**Self-editing checklist:**
- [ ] Removes all internal artifacts (PRs, file paths, versions)
- [ ] Explains Project Alpha context on first mention
- [ ] Teaches a transferable lesson (not just "here's what I did")
- [ ] Maintains personal voice (honest, reflective, humble)
- [ ] Works standalone (doesn't require reading other posts)
- [ ] Has clear takeaways (reader knows what to do differently)
- [ ] Proper front matter (layout: post, date, categories array)
- [ ] Length appropriate: 600-1,000 words (executive) or 1,200-1,800 words (narrative)
- [ ] Title is engaging and accessible

### 6. Test Locally (Optional)
```powershell
bundle exec jekyll serve
# Visit http://localhost:4000 to preview
```

### 7. Commit & Push

**Create a descriptive branch:**
```powershell
git checkout -b blog-post-moment-YYYY-MM-DD
git add _posts/YYYY-MM-DD-your-title.md
git commit -m "Add moment blog post: [Your Title]

Adapted from Project Alpha moment documenting [brief description].
Categories: [moments, tech/personal/philosophy]"
git push origin blog-post-moment-YYYY-MM-DD
```

**Or commit directly to master:**
```powershell
git checkout master
git add _posts/YYYY-MM-DD-your-title.md
git commit -m "Add moment: [Your Title]"
git push origin master
```

Posts auto-deploy to https://dekay2001.github.io within 1-5 minutes.

---

## Format Decision Guide

**Use Executive Summary (~800 words) when:**
- ✅ The moment documents a specific technical achievement
- ✅ The lesson is clear and actionable
- ✅ You want to publish quickly
- ✅ Examples: Infrastructure setup, feature implementation, tool usage

**Use Narrative Expansion (~1,500 words) when:**
- ✅ The moment explores complex meta-learning
- ✅ The story deserves deeper exploration
- ✅ Multiple insights connect to tell a bigger story
- ✅ Examples: Organizational drift, philosophical questions, major pivots

---

## Category Selection Guide

**Always include:** `moments`

**Add `tech` when:**
- Technical implementation or tools
- AI collaboration patterns
- Code, testing, development workflow

**Add `personal` when:**
- Personal experiences and reflections
- Life lessons through AI work
- Growth and self-awareness

**Add `philosophy` when:**
- Meta-learning and leadership insights
- Bigger questions about AI/humanity
- Thought leadership and patterns

**Max 3 categories total** - be selective!

---

## Common Pitfalls to Avoid

❌ **Too technical** - Explain acronyms, simplify jargon
❌ **Too internal** - Remove project-specific references
❌ **Too detailed** - Focus on insights, not every step
❌ **No context** - Explain Project Alpha for new readers
❌ **Passive voice** - Keep it first-person and active
❌ **Over-categorized** - Stick to 2-3 categories max

---

## Quick Reference: Past Successful Posts

**Executive Summary Examples:**
- [Adding Blog Filters](../_posts/2025-12-26-adding-blog-filters.md) - ~600 words
- [15 Minutes to Production](../_posts/2025-11-23-15-minutes-to-production.md) - ~1,200 words
- [When AI Instructions Go Wrong](../_posts/2025-11-30-when-ai-instructions-backfire.md) - ~1,000 words

**Narrative Examples:**
- [AI Mirrors](../_posts/2025-12-05-ai-mirrors.md) - ~2,300 words
- [When Your System Needs AI to Fix It](../_posts/2025-11-08-when-your-system-needs-ai-to-fix-it.md) - ~1,400 words

---

## Time Estimates

- **Executive Summary:** 30-45 minutes
- **Narrative Expansion:** 60-90 minutes
- **Review & Edit:** 15-30 minutes
- **Total:** 45 minutes to 2 hours depending on format

---

## Success Metrics

A good moment-to-blog conversion:
- ✅ Gets to the point quickly
- ✅ Teaches something practical
- ✅ Feels personal and honest
- ✅ Works for readers who don't know Project Alpha
- ✅ Has clear takeaways
- ✅ Is easy and enjoyable to read

---

**Pro tip:** Set a timer for 45 minutes. If you're not done by then, the post might need simplification or the format might need adjustment. The goal is frictionless publishing, not perfection.
