---
layout: post
title: "Adding Blog Filters"
date: 2025-12-26
categories: [moments, tech]
tags: [development, javascript, jekyll, blog]
---

{{ page.date | date: "%m/%d/%Y" }}

## Adding Category Filtering to My Blog

Today I spent about 3 hours implementing category filtering functionality for my blog and resolving several issues that came up along the way. This was a productive session that resulted in [PR #37](https://github.com/dekay2001/dekay2001.github.io/pull/37).

### What I Built

I added a category filter system that allows visitors to filter blog posts by category. The filters appear as buttons on the blog page, and clicking them shows only posts in that category. The implementation includes:

- **Client-side filtering** with JavaScript for posts on the current page
- **Full post loading** from JSON when filtering by category (to show all matching posts across all pages)
- **URL parameter support** so filters can be bookmarked and shared
- **Active state management** to show which filter is currently selected
- **Integration with search** functionality for combined filtering and searching

### Issues Discovered and Resolved

While testing the filtering, I discovered my blog categories were inconsistent:

1. **Format error** - My latest post had categories without brackets: `categories: ai personal reflection moments` instead of `categories: [ai, personal, reflection, moments]`

2. **Too many overlapping categories** - I had 27 unique categories across 40 posts, with many used only once (like "fluid", "water", "essence", "floating" all in one post)

3. **Semantic overlaps** - Categories like "ai", "chatgpt", "professional", and "software" all meant essentially the same thing

4. **Posts with 6-9 categories** - Some posts were over-categorized, defeating the purpose of categorization

### The Solution

I standardized everything down to **8 core categories**:
- **personal** - Personal experiences and reflections
- **yoga** - Yoga philosophy and practice  
- **tech** - Technology, AI, coding, software
- **creative** - Music, theater, artistic pursuits
- **philosophy** - Philosophical musings and questions
- **mindfulness** - Meditation and spiritual practices
- **reflection** - Major life reflections
- **moments** - Quick updates and milestones (like this one!)

Posts now have 1-3 categories maximum, making the system actually useful for navigation.

### Code Organization

As part of this work, I also reorganized the JavaScript code to follow clean code principles, specifically the "Public Interface First" pattern. Now the public methods are declared at the top of the class, making the code easier to read and understand.

### Next Steps

I'm evaluating what comes next, but one thing I'd like to explore is making it easier to add moments to the blog on demand. These quick updates are valuable for tracking progress and reflection, but they should be frictionless to create.

### Technical Notes

- All 77 unit tests passing ✅
- Filter buttons dynamically update the URL
- Pagination is hidden when filtering (shows all matching posts)
- Falls back gracefully if JSON fetch fails
- Works with existing search functionality

This was a satisfying project - starting with a feature request and discovering deeper issues that needed fixing along the way. The blog is now more organized and easier to navigate.
