---
layout: post
title: "Organizing by Filtering, Not Building: A Design Decision"
date: 2025-12-19
categories: [moments, tech]
---

{{ page.date | date: "%m/%d/%Y" }}

# Organizing by Filtering, Not Building: A Design Decision

I started by thinking I needed a "research section" or "books section" for my blog. After analyzing five different approaches, I realized the answer was much simpler: just add category filters to the existing blog.

This is part of my [Project Alpha](https://github.com/dekay2001/ai-prompts-library) work, exploring how AI changes software development and leadership.

## The Problem

I have 42 blog posts spanning 2019-2025 covering personal reflections, yoga philosophy, and Project Alpha "moments" documenting my AI development experiments. I wanted a way to easily find Project Alpha content for future book research without cluttering navigation or forcing artificial boundaries.

The site already had clean navigation: Home, Blog, Learn-Ashtanga, Resume, Playground. Five items. Simple and focused.

## The Initial Confusion

My first instinct: "I need to add a new section."

I explored:
- Should I create a "Moments" section?
- Should I add a "Research" area?
- Do I need new infrastructure for Project Alpha content?

After discussion with an AI assistant, the real need crystallized. I didn't need a new section. I needed a way to **categorize and filter existing blog posts** so Project Alpha moments were easy to find.

## The Five Options Analyzed

### Option 1: Add "Moments" Section

Add a sixth top-level navigation item for Project Alpha content.

**Navigation**: `Home | Blog | Moments | Learn-Ashtanga | Resume | Playground`

**Pros**: Clear separation, dedicated space  
**Cons**: Six nav items (cluttered), rigid categorization, content splitting

### Option 2: "Writing" Parent with Dropdown

Replace "Blog" with "Writing" dropdown containing "Blog" and "Moments" sub-items.

**Pros**: Groups related content, keeps five nav items  
**Cons**: Requires dropdown implementation, extra click, mobile complexity

### Option 3: Unified Blog with Category Filter ✅

Keep existing navigation. Add filter tabs above the search box on the blog page.

**Blog page enhancement**:
```
Blog
[All] [Moments] [Personal] [Yoga] ← Filter tabs
[Search box]
Posts: ...
```

**Pros**: Clean nav (unchanged), flexible categorization (posts can have multiple categories), leverages existing Jekyll category system, scalable  
**Cons**: Moments less prominent than dedicated section, requires JavaScript

### Option 4: "Project Alpha" Landing Page

Create a curated collection page that links back to blog posts.

**Pros**: Project Alpha gets identity, no content splitting  
**Cons**: Six nav items, duplicate access paths, manual curation

### Option 5: Sidebar Filter

Add sidebar with checkboxes for categories.

**Pros**: No nav changes, flexible  
**Cons**: Layout redesign, mobile awkwardness, moments not prominent

## The Decision: Option 3

I chose the unified blog with category filters for several reasons:

**Keeps navigation clean.** Five items remain. No clutter.

**Allows flexible categorization.** Posts can be both "moments" and "personal." Real content doesn't fit in single boxes. Why force it?

**Easy to implement.** Jekyll categories already exist. Just add JavaScript filtering UI. Leverage existing systems rather than building new ones.

**Scalable.** Want to add "AI" or "Yoga" filters later? Just add buttons. No navigation restructuring needed.

**Maintains unity.** Everything stays in the blog. "Moments" is just a filtered view, not a separate content stream.

**Works with search.** Filter and search can work together. Filter to "Moments," then search within that category.

## The Core Principle

**Don't create artificial boundaries when a simple filter provides the same value.**

Navigation is precious real estate. Every new item adds cognitive load. Filter tabs within an existing section are better than proliferating top-level sections.

Content organization via filtering, not splitting.

## The Implementation Plan

The decision led to a clear implementation strategy:

**Tag posts with categories:**
```yaml
categories: [moments, tech, personal]
```

**Add filter buttons to blog page:**
```html
<div class="category-filters">
    <button data-category="all">All Posts</button>
    <button data-category="moments">Moments</button>
    <button data-category="personal">Personal</button>
    <button data-category="yoga">Yoga</button>
</div>
```

**JavaScript filters posts:**
- Click button → show/hide posts by category
- Update URL: `/blog/?category=moments`
- Integrate with existing search

**Style with existing design system:**
- Match Portugal Sunset theme colors
- Glassmorphism effects for buttons
- Active state with orange accent glow

(This implementation shipped a week later in another "moment" I've already documented.)

## Lessons From the Process

### The Question Shifted

**Started with**: "What should I build?"  
**Ended with**: "How can I organize what I have?"

That shift in perspective led to a simpler, more maintainable solution.

### Don't Over-Engineer

A separate section with its own infrastructure would have been overkill. A filter on existing content solves the same problem with less complexity.

### Flexibility Beats Rigid Structure

Allowing posts to have multiple categories (both "moments" and "personal") reflects reality better than forcing binary choices.

### Leverage Existing Systems

Jekyll categories were already in place. Adding a filter leverages that instead of building something new. Work with what you have.

### Multiple Documents Serve Different Needs

I created two documents from this work:
1. **Detailed moment document** (the source for this post) - Full analysis, decision rationale, implementation details
2. **Simple next-steps checklist** - Just "what do I do next?" when resuming work

The first is for reflection and communication. The second is for execution. Both serve valuable purposes.

## The Pattern: When to Filter, When to Split

**Use filtering when**:
- Content fits multiple overlapping categories
- Need flexible, maintainable organization
- Want to avoid navigation clutter
- Have existing infrastructure to leverage

**Split into sections when**:
- Content truly needs separate identity or branding
- Different content types require different layouts or features
- Categories are genuinely mutually exclusive
- Small amount of content makes filtering overkill

## Reflection

This moment demonstrates the value of analyzing multiple options before building. The first instinct ("add a new section") wasn't wrong, but exploring alternatives revealed a simpler solution.

Sometimes the best infrastructure decision is not to build new infrastructure.

---

*This post is part of a series documenting my experiments with AI-assisted development as part of [Project Alpha](https://github.com/dekay2001/ai-prompts-library). Sometimes the right answer is organizing what you already have, not building something new.*
